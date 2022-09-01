const { SlashCommandBuilder } = require('@discordjs/builders');
const ova = require('../OVADice.js');
const { majorID } = require('./config.json');
const { meID } = require('./config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ova')
		.setDescription('Rolls Xd6 with OVA rules')
    .addStringOption(option =>
        option.setName("dice")
        .setDescription("Rolls 'dice' OVA dice")
        .setRequired(true))
        .addStringOption(option =>
            option.setName("comment")
            .setDescription("Displayed below your roll")),
	async execute(interaction) {
    await interaction.deferReply()
    const dice = interaction.options.getString("dice")
    const comment = interaction.options.getString("comment")
		const user = interaction.user.id
		let output = `${interaction.user}` + " rolled " + dice + " OVA dice\n" + ova.OVADice(dice)
		if (user == majorID) {
			output = output + "\nThat's your result. Deal with it. :sunglasses:"
		if (comment > "") {
		output = output + "\n" + comment
		}
		if (output.length > 2000) {
		await interaction.editReply("Message too long to show. Try less dice or a shorter comment.")
		}
		else {
			await interaction.editReply(output)
		}
    await interaction.editReply(output)
	},
};
