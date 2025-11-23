#!/usr/bin/env node

const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const RSS_URL = 'https://write.as/skew/feed/';
const LAST_UPDATE_FILE = path.join(__dirname, '..', 'last-update.txt');

async function checkForUpdates() {
  try {
    const parser = new Parser();
    console.log(`Fetching RSS feed from ${RSS_URL}...`);
    const feed = await parser.parseURL(RSS_URL);
    
    if (!feed.items || feed.items.length === 0) {
      console.log('No posts found in RSS feed');
      process.exit(0);
    }
    
    // Get most recent post date from RSS
    const latestPostDate = new Date(feed.items[0].pubDate);
    console.log(`Latest post: "${feed.items[0].title}" (${latestPostDate.toISOString()})`);
    
    // Read last known update time
    let lastUpdate = new Date(0); // epoch if file doesn't exist
    if (fs.existsSync(LAST_UPDATE_FILE)) {
      const lastUpdateStr = fs.readFileSync(LAST_UPDATE_FILE, 'utf8').trim();
      lastUpdate = new Date(lastUpdateStr);
      console.log(`Last known update: ${lastUpdate.toISOString()}`);
    } else {
      console.log('No previous update record found - treating as first run');
    }
    
    // Check if there's new content
    const hasUpdates = latestPostDate > lastUpdate;
    
    if (hasUpdates) {
      console.log('✓ New content detected! Search index needs update.');
      // Save new update time
      fs.writeFileSync(LAST_UPDATE_FILE, latestPostDate.toISOString());
      
      // Set GitHub Actions output
      if (process.env.GITHUB_OUTPUT) {
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `updated=true\n`);
      }
      
      process.exit(0);
    } else {
      console.log('✓ No new content - search index is up to date.');
      
      // Set GitHub Actions output
      if (process.env.GITHUB_OUTPUT) {
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `updated=false\n`);
      }
      
      process.exit(0);
    }
  } catch (error) {
    console.error('Error checking RSS feed:', error.message);
    process.exit(1);
  }
}

checkForUpdates();
