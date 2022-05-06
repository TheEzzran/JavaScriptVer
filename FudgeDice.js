const diceRoll = require('./diceRoller.js');
const isnum = require('./isNumeric.js');

module.exports = {
  FudgeDice: function(number, modifier) {
    if (parseInt(number) > 10000) {
      return "Too many dice!";
    }
    if (!isnum.isNumeric(number[0])) {
      return "What does that even mean? Gotta be a positive number of dice, chief.";
    }
    let results = diceRoll.diceRoller(number, 3);
    let total = 0;
    for (let i = 0; i<results.length; ++i) {
      if (results[i] == 1) {
        results[i] = "-";
        total--;
      }
      else if (results[i] == 2) {
        results[i] = "0";
      }
      else {
        results[i] = "+";
        total++;
      }
    }
    let textResults = "[";
    for (let i = 0; i<results.length; ++i) {
      textResults = textResults + results[i] + ", "
    }
    total = total + parseInt(modifier);
    textResults = textResults.slice(0, -2) + "] = " + total.toString();
    if (textResults.length > 1000) {
      textResults = "Woah that's too much for Discord to show. Here's the final result though: " + total.toString();
    }
    return textResults;
  }
};
