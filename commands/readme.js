const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('readme')
		.setDescription('Link to Readme on github'),
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
