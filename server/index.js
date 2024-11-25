import express from 'express'
import cors from 'cors'
import axios from 'axios'
import * as cheerio from 'cheerio'
import Anthropic from '@anthropic-ai/sdk'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: join(__dirname, '../.env') })

const app = express()
app.use(cors())
app.use(express.json())

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
})

const analysisCache = new Map()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

async function getWebsiteContent(url, maxRetries = MAX_RETRIES) {
  let lastError
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache'
        },
        timeout: 15000,
        maxRedirects: 5,
        validateStatus: (status) => status < 400
      })
      return response.data
    } catch (error) {
      lastError = error
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
        continue
      }
    }
  }
  
  throw lastError
}

async function scrapeWebsite(url) {
  try {
    console.log('Starting website analysis:', url)
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    const html = await getWebsiteContent(url)
    const $ = cheerio.load(html)

    // Remove non-content elements
    $('script, style, noscript, iframe, header, nav, footer').remove()

    // Get main content
    const mainContent = $('main, article, [role="main"], .content, #content').text() ||
                       $('body').text()

    // Get business-specific content
    const businessSelectors = [
      '*:contains("product")',
      '*:contains("service")',
      '*:contains("pricing")',
      '*:contains("features")',
      '*:contains("about us")',
      '*:contains("mission")',
      '*:contains("solution")',
      'h1, h2, h3'
    ]

    const businessContent = businessSelectors
      .map(selector => $(selector).text().trim())
      .filter(text => text.length > 20)
      .join('\n')

    // Get meta information
    const title = $('title').first().text().trim() ||
                 $('h1').first().text().trim() ||
                 url
                 
    const description = $('meta[name="description"]').attr('content') ||
                       $('meta[property="og:description"]').attr('content') ||
                       $('p').first().text().trim() ||
                       'No description available'

    const cleanText = text => text
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 2000)

    const content = {
      title: cleanText(title),
      description: cleanText(description),
      mainContent: cleanText(mainContent),
      businessContent: cleanText(businessContent)
    }

    // Validate content
    const totalContent = Object.values(content).join(' ').length
    if (totalContent < 100) {
      throw new Error('Insufficient content found for analysis')
    }

    console.log('Successfully extracted content:', {
      url,
      contentLength: totalContent
    })

    return content

  } catch (error) {
    const errorMessage = error.response?.status === 404 ? 'Website not found (404)' :
                        error.code === 'ENOTFOUND' ? 'Domain does not exist' :
                        error.code === 'ETIMEDOUT' ? 'Website took too long to respond' :
                        error.message

    throw new Error(`Cannot analyze website: ${errorMessage}`)
  }
}

async function analyzeWithClaude(websiteData, url) {
  try {
    const prompt = `You are a business model expert analyzing this website. Based on the available content, provide a thorough analysis focusing on five key areas.

Website: ${url}

Available Content:
${websiteData.title}
${websiteData.description}
${websiteData.mainContent}
${websiteData.businessContent}

Analyze the business model and provide scores and specific observations. If certain aspects aren't directly visible, use industry knowledge and available signals to make educated assessments.

Required JSON format:
{
  "overallScore": number (1.0-10.0),
  "criteria": {
    "valueProposition": {
      "score": number,
      "points": [
        "clear observation about their offering/value proposition",
        "insight about their unique value",
        "specific strength or weakness noted"
      ]
    },
    "marketFit": {
      "score": number,
      "points": [
        "observation about target market alignment",
        "market need/problem they solve",
        "market positioning insight"
      ]
    },
    "competitiveAdvantage": {
      "score": number,
      "points": [
        "unique strength or differentiator",
        "competitive position observation",
        "defensive moat insight"
      ]
    },
    "revenueModel": {
      "score": number,
      "points": [
        "revenue stream observation",
        "monetization strategy insight",
        "business model strength/weakness"
      ]
    },
    "scalability": {
      "score": number,
      "points": [
        "growth potential indicator",
        "scaling capability observation",
        "expansion opportunity noted"
      ]
    }
  }
}

Important:
- Provide specific, meaningful insights rather than generic observations
- Base analysis on visible evidence and industry knowledge
- If information is limited, note that in the points while still providing best assessment
- Use decimal precision for scores (e.g., 7.8)
- Keep points concise but insightful`

    const response = await anthropic.messages.create({
      model: 'claude-2.1',
      max_tokens: 1500,
      system: 'You are an expert business analyst. Provide specific, data-driven insights. Never give generic responses.',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4
    })

    const responseText = response.content[0].text.trim()
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid analysis response format')
    }

    const analysis = JSON.parse(jsonMatch[0])

    // Validate analysis structure
    if (!analysis.overallScore || !analysis.criteria || 
        !Object.keys(analysis.criteria).every(k => 
          analysis.criteria[k].score && 
          Array.isArray(analysis.criteria[k].points))) {
      throw new Error('Invalid analysis structure')
    }

    return analysis

  } catch (error) {
    console.error('Analysis failed:', error)
    throw new Error('Could not generate analysis: ' + error.message)
  }
}

app.post('/analyze', async (req, res) => {
  const { url } = req.body
  
  if (!url) {
    return res.status(400).json({ 
      error: 'URL required',
      message: 'Please provide a website URL to analyze'
    })
  }

  try {
    // Validate URL format
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`)
    } catch (e) {
      return res.status(400).json({
        error: 'Invalid URL',
        message: 'Please enter a valid website URL (e.g., example.com)'
      })
    }

    // Check cache
    const cacheKey = url.toLowerCase()
    const cached = analysisCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached analysis for:', url)
      return res.json(cached.data)
    }

    // Extract content
    const websiteData = await scrapeWebsite(url)
    
    // Generate analysis
    const analysis = await analyzeWithClaude(websiteData, url)

    const result = {
      success: true,
      analysis: {
        ...analysis,
        websiteUrl: url,
        analyzedAt: new Date().toISOString()
      }
    }

    // Cache result
    analysisCache.set(cacheKey, {
      timestamp: Date.now(),
      data: result
    })

    res.json(result)

  } catch (error) {
    console.error('Analysis failed for URL:', url, error)
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message || 'Could not analyze website. Please try again.'
    })
  }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log('Ready to analyze websites')
})