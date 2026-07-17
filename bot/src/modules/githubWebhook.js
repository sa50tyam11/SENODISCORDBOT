const express = require('express');
const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

function initWebhookServer(client) {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware to parse JSON payloads
  app.use(express.json());

  app.post('/webhook', async (req, res) => {
    // GitHub sends event type in headers
    const eventType = req.headers['x-github-event'];
    const payload = req.body;

    const devChannelId = config.channels.devActivityChannelId;
    if (!devChannelId) {
      return res.status(200).send('Webhook received, but no dev channel configured.');
    }

    try {
      const channel = await client.channels.fetch(devChannelId);
      if (!channel) return res.status(404).send('Dev channel not found.');

      let embed = new EmbedBuilder().setTimestamp();

      if (eventType === 'push') {
        const branch = payload.ref.replace('refs/heads/', '');
        const commits = payload.commits;
        const pusher = payload.pusher.name;
        const repoName = payload.repository.name;

        if (commits.length === 0) return res.status(200).send('No commits.');

        embed
          .setTitle(`[${repoName}:${branch}] ${commits.length} new commit(s)`)
          .setURL(payload.compare)
          .setColor('#6C63FF') // Electric Indigo
          .setAuthor({ name: pusher, iconURL: payload.sender.avatar_url });

        let commitList = '';
        for (const commit of commits.slice(0, 5)) {
          // Format commit message (truncate if too long)
          let msg = commit.message.split('\\n')[0];
          if (msg.length > 50) msg = msg.substring(0, 50) + '...';
          commitList += `[\`${commit.id.substring(0, 7)}\`](${commit.url}) ${msg}\\n`;
        }
        
        embed.setDescription(commitList);
        await channel.send({ embeds: [embed] });

      } else if (eventType === 'pull_request') {
        const action = payload.action;
        const pr = payload.pull_request;
        const repoName = payload.repository.name;

        // Only alert on opened, closed (merged)
        if (action === 'opened' || action === 'closed') {
          const isMerged = action === 'closed' && pr.merged;
          const statusText = isMerged ? 'Merged' : (action === 'closed' ? 'Closed' : 'Opened');
          const color = isMerged ? '#84cc16' : (action === 'closed' ? '#FF5555' : '#FFAA00');

          embed
            .setTitle(`[${repoName}] Pull Request ${statusText}: #${pr.number} ${pr.title}`)
            .setURL(pr.html_url)
            .setColor(color)
            .setAuthor({ name: pr.user.login, iconURL: pr.user.avatar_url });

          await channel.send({ embeds: [embed] });
        }
      }

      res.status(200).send('Webhook processed.');
    } catch (error) {
      console.error('Error processing GitHub webhook:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.listen(PORT, () => {
    console.log(`GitHub Webhook server listening on port ${PORT}`);
  });
}

module.exports = { initWebhookServer };
