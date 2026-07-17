const config = require('../config.json');
const { sendLog } = require('../utils/logger');

// Store the last known status of each site. true = UP, false = DOWN
const siteStatus = new Map();

async function checkSites(client) {
  const sites = config.monitoredSites || [];
  if (sites.length === 0) return;

  const alertsChannelId = config.channels.siteAlertsChannelId;

  for (const site of sites) {
    const startTime = Date.now();
    let isUp = false;
    let responseTime = 0;

    try {
      // AbortController to handle timeouts (e.g., 10 seconds)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(site.url, { signal: controller.signal });
      clearTimeout(timeoutId);

      responseTime = Date.now() - startTime;
      isUp = response.ok; // 2xx-299 status code
    } catch (error) {
      isUp = false;
    }

    const previousStatus = siteStatus.get(site.url);

    // If status changed or it's the first check and it's down
    if (isUp !== previousStatus) {
      siteStatus.set(site.url, isUp);

      // Only send alert if we actually have the channel configured
      // and it's not just the first check confirming it's UP
      if (alertsChannelId && previousStatus !== undefined || !isUp) {
        
        const statusText = isUp ? '✅ RECOVERED' : '❌ DOWN';
        const color = isUp ? '#84cc16' : '#FF5555';
        const description = isUp 
          ? `**${site.name}** is back online.\n**Response Time:** ${responseTime}ms\n**URL:** ${site.url}`
          : `**${site.name}** is currently offline or unreachable.\n**URL:** ${site.url}`;

        // Send direct alert to the channel (avoiding logger to use specific channel, but logger function can take any channel id if we want. We'll manually fetch here for alerts).
        try {
          const channel = await client.channels.fetch(alertsChannelId);
          if (channel) {
            const { EmbedBuilder } = require('discord.js');
            const embed = new EmbedBuilder()
              .setTitle(`Site Alert: ${statusText}`)
              .setDescription(description)
              .setColor(color)
              .setTimestamp();
            
            await channel.send({ embeds: [embed] });
          }
        } catch (err) {
          console.error(`Could not send site alert to channel ${alertsChannelId}:`, err);
        }
      }
    }
  }
}

function initUptimeMonitor(client) {
  console.log('Initializing Uptime Monitor...');
  // Check every 5 minutes (300,000 ms)
  setInterval(() => checkSites(client), 300000);
  
  // Run initial check immediately
  checkSites(client);
}

module.exports = { initUptimeMonitor };
