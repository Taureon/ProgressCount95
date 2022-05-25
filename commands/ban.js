const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const banMBRfile = './data/banned.json';
const banMBR = require("." + banMBRfile);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban-count-toggle')
        .setDescription(`Ban a user from counting. Run again to unban.`)
        .addUserOption(option => option.setName('user').setDescription('the user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('the reason for the ban. Unused for unbans.').setRequired(true)),
    async execute(interaction) {
        //I'm using MANAGE_ROLES because it's a permission that is only available to all staff members - even helpers.
        //This can be bumped to MANAGE_MEMBERS later.
        if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            let mbr = interaction.options.getUser("user"),
            if (mbr.id === "511223071504334866") {
                interaction.reply("You can't ban Chris from counting!");
            } else {
                if (banMBR.some(me => me.id === mbr.id)) {
                    banMBR.splice(banMBR.indexOf(mbr.id), 1);
                    interaction.reply("✅ **" + mbr.tag + "** is no longer banned from counting.");

                    fs.writeFile(banMBRfile, JSON.stringify(banMBR, null, 2), err => {
                        if (err) console.error(err);
                    });
                } else {
                    banMBR.push({
                        "id": mbr.id,
                        "reason": interaction.options.getString("reason")
                    });
                    
                    fs.writeFile(banMBRfile, JSON.stringify(banMBR, null, 2), err => {
                        if (err) console.error(err);
                    });
    
                    console.log(`${interaction.user.tag} banned ${mbr}`);
                    //mbr.send("haha u r banned from counting")
                    interaction.reply({
                        content: `✅ **Banned ${mbr} from counting for "${interaction.options.getString("reason")}"**`,
                        ephemeral: false
                    }); 
                }
            }
        } else {
            interaction.reply({
                content: `❌ **You cannot do this!**`,
                ephemeral: true
            });
        }
    },
};
