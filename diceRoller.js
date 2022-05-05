//const random = require('random');

module.exports = {
  diceRoller: function(number, size) {
    console.log("diceRoller");
    let results = [];
    for (let i = 0; i < number; ++i) {
      results.push(Math.floor(Math.random() * size) + 1);
    }
    return results;
  }
};
