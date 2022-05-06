const { SlashCommandBuilder } = require('@discordjs/builders');
const ova = require('../OVADice.js');

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
    let output = `${interaction.user}` + " rolled " + dice + " OVA dice\n" + ova.OVADice(dice)
    if (comment > "") {
      output = output + "\n" + comment
    }
    if (output.length > 2000) {
      await interaction.editReply("Message too long to show. Try less dice or a shorter comment.")
    }
    await interaction.editReply(output)
	},
};
