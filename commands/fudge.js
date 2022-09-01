const { SlashCommandBuilder } = require('@discordjs/builders');
const Fudge = require('../FudgeDice.js');
const { majorID } = require('./config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fudge')
		.setDescription('Roll Fudge dice')
    .addStringOption(option =>
        option.setName("dice")
        .setDescription("Rolls 'dice' Fudge dice")
        .setRequired(true))
    .addStringOption(option =>
            option.setName("modifier")
            .setDescription("Added to the final total"))
    .addStringOption(option =>
            option.setName("comment")
            .setDescription("Displayed below your roll")),
	async execute(interaction) {
    await interaction.deferReply()
    const dice = interaction.options.getString("dice")
    const modifier = interaction.options.getString("modifier")
    const comment = interaction.options.getString("comment")
		const user = interaction.user.id
    let output = ""
    if (modifier > "") {
      output = `${interaction.user}` + " rolled " + dice + " Fudge dice + " + parseInt(modifier) + "\n" + Fudge.FudgeDice(dice, modifier)
    }
    else {
      output = `${interaction.user}` + " rolled " + dice + " Fudge dice\n" + Fudge.FudgeDice(dice, 0)
    }
		if (user == majorID) {
			output = output + "\nThat's your result. Deal with it. :sunglasses:"
		}
    if (comment > "") {
      output = output + "\n" + comment
    }
    if (output.length > 2000) {
      await interaction.editReply("Message too long to show. Try less dice or a shorter comment.")
    }
    await interaction.editReply(output)
	},
};
