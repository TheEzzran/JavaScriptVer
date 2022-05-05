const { SlashCommandBuilder } = require('@discordjs/builders');
const Fudge = require('../FudgeDice.js');

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
            .setDescription("Added to the final total")),
	async execute(interaction) {
    await interaction.deferReply()
    const dice = interaction.options.getString("dice")
    const modifier = interaction.options.getString("modifier")
    let output = ""
    if (modifier > "") {
      output = `${interaction.user}` + " rolled " + dice + " Fudge dice + " + parseInt(modifier) + "\n" + Fudge.FudgeDice(dice, modifier)
    }
    else {
      output = `${interaction.user}` + " rolled " + dice + " Fudge dice\n" + Fudge.FudgeDice(dice, modifier)
    }
    await interaction.editReply(output)
	},
};
