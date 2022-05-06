const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('readme')
		.setDescription('Link to Readme on github'),
	async execute(interaction) {
    const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setURL('https://github.com/TheEzzran/JavaScriptVer/tree/master#readme')
					.setLabel('Readme')
					.setStyle('LINK'),
			);
    await interaction.reply({ content: 'Here you go!', ephemeral: true, components: [row] })
	},
};
