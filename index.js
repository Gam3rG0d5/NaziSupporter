const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

// Load configuration file (contains token and other settings)
const config = require('./config.json');

// Load user data
let userData = JSON.parse(fs.readFileSync('userData.json', 'utf8'));

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('message', message => {
    // Ignore bot messages and messages not in a guild
    if (message.author.bot || !message.guild) return;

    // Add XP to user
    const userId = message.author.id;
    addXP(userId);
});

function addXP(userId) {
    const xpToAdd = 10; // Example: Add 10 XP for each message
    if (!userData[userId]) userData[userId] = { xp: 0, level: 0 };
    userData[userId].xp += xpToAdd;
    const levelUpXP = 100; // Example: Level up every 100 XP
    if (userData[userId].xp >= levelUpXP) {
        userData[userId].level++;
        userData[userId].xp = 0;
        const levelUpChannel = client.channels.cache.get(config.levelUpChannelId);
        if (levelUpChannel) {
            levelUpChannel.send(`<@${userId}> has leveled up to level ${userData[userId].level}!`);
        }
    }
    fs.writeFileSync('userData.json', JSON.stringify(userData));
}

client.login(config.token);
