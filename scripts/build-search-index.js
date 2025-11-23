#!/usr/bin/env node

const Parser = require('rss-parser');
const https = require('https');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const RSS_URL = 'https://write.as/skew/feed/';
const OUTPUT_FILE = path.join(__dirname, '..', 'posts.json');

// Extract text content from HTML
function extractTextFromHTML(html) {
  const $ = cheerio.load(html);
  // Remove script and style tags
  $('script, style').remove();
  return $('body').text().replace(/\s+/g, ' ').trim();
}

// Fetch full post content from individual post URL
async function fetchPostContent(url) {
  return new Promise((resolve) => {
    try {
      console.log(`  Fetching content from ${url}...`);
      
      https.get(url, (response) => {
        let html = '';
        
        response.on('data', (chunk) => {
          html += chunk;
        });
        
        response.on('end', () => {
          const $ = cheerio.load(html);
          
          // Extract post content from Write.as structure
          const articleContent = $('article').html() || $('body').html();
          const textContent = extractTextFromHTML(articleContent);
          
          resolve(textContent.substring(0, 5000)); // Limit to 5000 chars for search index
        });
      }).on('error', (error) => {
        console.error(`  Error fetching ${url}:`, error.message);
        resolve('');
      });
    } catch (error) {
      console.error(`  Error fetching ${url}:`, error.message);
      resolve('');
    }
  });
}

// Extract slug from URL
function getSlugFromURL(url) {
  const match = url.match(/write\.as\/skew\/(.+)/);
  return match ? match[1] : url;
}

async function buildSearchIndex() {
  try {
    const parser = new Parser();
    console.log(`Fetching RSS feed from ${RSS_URL}...`);
    const feed = await parser.parseURL(RSS_URL);
    
    console.log(`Found ${feed.items.length} posts in RSS feed`);
    
    const posts = [];
    
    for (const item of feed.items) {
      console.log(`Processing: "${item.title}"`);
      
      // Fetch full content
      const content = await fetchPostContent(item.link);
      
      const post = {
        id: getSlugFromURL(item.link),
        title: item.title,
        url: item.link,
        date: item.pubDate,
        content: content,
        excerpt: item.contentSnippet || content.substring(0, 300),
        categories: item.categories || []
      };
      
      posts.push(post);
      
      // Rate limiting - wait 500ms between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Write to file
    console.log(`\nWriting ${posts.length} posts to ${OUTPUT_FILE}...`);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
    
    console.log('✓ Search index built successfully!');
    console.log(`  File: ${OUTPUT_FILE}`);
    console.log(`  Posts: ${posts.length}`);
    console.log(`  Size: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('Error building search index:', error.message);
    process.exit(1);
  }
}

buildSearchIndex();
