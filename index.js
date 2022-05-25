const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { token, countingCh, useCustomEmoji } = require('./config.json');
const client = new Client({
    ws: {
        properties: {
            $browser: "Discord iOS"
        }
    },
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
});
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

var owner = "284804878604435476";
var numb = parseInt(fs.readFileSync('./data/numb.txt', 'utf8'))
var lastCounterId = "0"
var serverSaves = 3
var bannedIDs = fs.readFileSync('./data/banned.json', 'utf8')
const customEmojis = {
    "32": "<:sys32:817120108761186405>",
    "67": "<:pBarFlint67:892434159300120629>",
    "66": "<:pBar66:868370162187927632>",
    "65": "<:pBar65:856835166374199297>",
    "64": "<:pBar64:853138163827212308>",
    "63": "<:pBar63:840276684556337172>",
    "9000": "<:ProgreshPower9000:825373078368288798>",
    "800": "<:ProgreshBC800:819147801425477652>",
    "64": "<:Progresh64KB:819147680089374730>",
    "36": "<:PBNOT36:819147051912134657>",
    "98": "<:PB98:819146172928491580>",
    "95": "<:PB95:662601719653597196>",
    "100": "💯",
    "1984": "<a:1984:971405081817804800>"
    //no checkmark emoji because it defaults to that if there is no custom emoji for a number
}

client.once('ready', () => {
    console.log('Ready!\n');
    if (useCustomEmoji) {
        console.log("Custom Emoji support is on! Some emojis may fail to react if the bot is not in the server with the emoji.")
    } else {
        console.log("Custom Emoji support is off! No custom emojis will be used.")
    }
    client.user.setActivity('counting', {
        type: 'COMPETING'
    });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
        numb = parseInt(fs.readFileSync('./data/numb.txt', 'utf8'));
    } catch (error) {
        console.log(`${error}\n\n`)
        if (interaction.user.id !== owner) {
            interaction.reply({content: `if you are seeing this, <@${owner}> messed up somehow. send this error to him plz :)\n\n\`\`\`${btoa(error)}\`\`\``, ephemeral: true});
        } else {
            interaction.reply({content: `wow good job you fucked something up (again)\n\n\`\`\`${error}\`\`\``, ephemeral: true});
        }
    }
});

client.on('messageCreate', async message => {

    if (message.author.bot) return
    if (bannedIDs.includes(message.author.id)) return
    if (message.channel.id !== countingCh) return
    
    var thec = message.content.split(' ')[0]
    if (!isNaN(thec) && message.attachments.size == 0 && message.stickers.size == 0) {
        if (lastCounterId !== message.author.id) {
            if (thec == String(numb++)) {
                if (useCustomEmoji) {
                    message.react(customEmojis[thec] || "✅");
                } else {
                    message.react("✅");
                }
                lastCounterId = message.author.id
            } else if (serverSaves !== 0) {
                message.react('⚠️');
                serverSaves--;
                numb--;
                message.reply(`${message.author} almost ruined the count, but a server save was used!\n**${serverSaves}** server saves remain.\nThe next number is **${numb+1}**`);
            } else {
                message.react('❌');
                message.reply(`${message.author} ruined the count!\nThe next number was **${numb+1}**, but they said **${thec}**!\nThe next number is **1** | **Wrong Number.**`);
                numb = 0;
                lastCounterId = "0";
            }
        } else if (serverSaves !== 0) {
            message.react('⚠️');
            serverSaves--;
            message.reply(`${message.author} almost ruined the count, but a server save was used!\n**${serverSaves}** server saves remain.\nThe next number is **${numb+1}**`);
        } else {
            message.react('❌');
            message.reply(`${message.author} ruined the count!\nThe next number is **1** | **You cannot count more than one time in a row**!`);
            numb = 0;
            lastCounterId = "0";
        }

        fs.writeFile('./data/numb.txt', String(numb), (err) => {
            if (err) throw err;
        });
    }

});

process.on('uncaughtException', (error, origin) => {
    console.log('----- Uncaught exception -----');
    console.log(error);
    console.log('----- Exception origin -----');
    console.log(origin);
})

process.on('unhandledRejection', (reason, promise) => {
    console.log('----- Unhandled Rejection at -----');
    console.log(promise);
    console.log('----- Reason -----');
    console.log(reason);
})

client.login(token);
