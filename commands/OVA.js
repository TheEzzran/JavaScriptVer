const { SlashCommandBuilder } = require('@discordjs/builders');
const ova = require('../OVADice.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ova')
		.setDescription('Rolls Xd6 with OVA rules')
    .addStringOption(option =>
        option.setName("dice")
        .setDescription("Rolls 'dice' OVA dice")
        .setRequired(true)),
	async execute(interaction) {
    await interaction.deferReply()
    const dice = interaction.options.getString("dice")
    let output = `${interaction.user}` + " rolled " + dice + " OVA dice\n" + ova.OVADice(dice)
    await interaction.editReply(output)
	},
};
