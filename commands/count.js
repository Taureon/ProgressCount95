const fs = require('fs')
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('count')
        .setDescription(`Get the current count`),
        //.addIntegerOption(option => option.setName('numb').setDescription('the number').setRequired(true)),
    execute: interaction => interaction.reply({ content: `The current number is **${fs.readFileSync('./data/numb.txt', 'utf8')}**`, ephemeral: true })
};
