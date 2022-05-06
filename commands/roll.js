const { SlashCommandBuilder } = require('@discordjs/builders');
const diceRoll = require('../diceRoller.js');
const comParse = require('../commandParser.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls dice with a variety of potential modifiers.')
    .addStringOption(option =>
        option.setName("dice")
        .setDescription("YdZ. See readme for modifiers.")
        .setRequired(true))
        .addStringOption(option =>
            option.setName("comment")
            .setDescription("Displayed below your roll")),
	async execute(interaction) {
    await interaction.deferReply()
    const dice = interaction.options.getString("dice")
    const comment = interaction.options.getString("comment")
    let output = `${interaction.user}` + " rolled " + dice + "\n" + comParse.commandParser(dice)
    if (comment > "") {
      output = output + "\n" + comment
    }
		await interaction.editReply(output)
	}

};
