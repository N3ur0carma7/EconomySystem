const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    run: ({ interaction }) => {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'ban') {
            const targetUserId = subcommand.options.get('target-user');

            interaction.reply("It worked !")
        }
    },


    data: new SlashCommandBuilder()
            .setName('admin')
            .setDescription("Corresponds to admin commands")
            .addSubcommand((subcommand) => 
                subcommand
                    .setName('ban')
                    .setDescription("Bans a user from this server.")
                    .addMentionableOption((mentionnable) => 
                        mentionnable
                                .setName('target-user')
                                .setDescription("The member you want to ban.")
                                .setRequired(true)
                    ),       
            ),
};