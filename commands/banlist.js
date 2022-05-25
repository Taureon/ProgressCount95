const fs = require('node:fs')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const banMBRfile = './data/banned.json'
const banMBR = require("." + banMBRfile);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banlist')
        .setDescription(`Look at all the dead people.`),
    async execute(interaction) {
        //I'm using MANAGE_ROLES because it's a permission that is only available to all staff members - even helpers.
        //This can be bumped to MANAGE_MEMBERS later.
        if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            let banlist = '';

            for (var i=0; i < banMBR.length; i++) banlist += `**${i+1}.** <@${banMBR[i].id}> - ${banMBR[i].reason}\n`;

            if (banlist == '') banlist = '**No one is banned from counting.**';
            
            //create message embed
            const embed = new MessageEmbed()
                .setTitle('List of banned members from Counting')
                .setDescription(banlist)
                .setColor('#ff0000')
            interaction.reply({embeds: [embed]}); 
        } else {
            interaction.reply({
                content: `❌ **You cannot do this!**`,
                ephemeral: true
            });
        }
    },
};
