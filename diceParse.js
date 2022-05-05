const diceRoll = require('./diceRoller.js');

module.exports = {
  diceParse: function(quant, size, dropLow, keepLow, reroll, explode, success, cancels, successBonus, rollUnder, add, subtract, multiply, divide) {
    console.log("diceParser");
    let rolls = diceRoll.diceRoller(quant,size);
    let results = []; //by the end, [0] should be an array of strings (which is the output results) and [1] is a numeric string with the final totals
    let total = 0; //this is the value that'll get fed into results[1] once the math is done.
    let rollSort = rolls;
    for (let i=0; i<rolls.length; i++) {
      if (rolls[i] <= reroll) {
        rolls.push(diceRoll.diceRoller(1, size)[0]);
        rolls[i] = "~~" + rolls[i].toString() + "~~";
      }
    }
    if (success > 0 && rollUnder == false) {
      for (let i=0;i<rolls.length;++i){
        if (rolls[i] >= successBonus) {
          total = total+2;
          rolls[i] = "**" + rolls[i].toString() + "!**";
        }
        else if (rolls[i] >= success) {
          total++;
          rolls[i] = "**" + rolls[i].toString() + "**";
        }
        else if (rolls[i] <= cancels) {
          total--;
          rolls[i] = "*" + rolls[i].toString() + "*";
        }
        else {
          rolls[i] = rolls[i].toString();
        }
      }
      results = [rolls, total.toString()];
    }
    else if (success > 0 && rollUnder == true) {
      for (let i=0;i<rolls.length;++i){
        if (rolls[i] <= successBonus) {
          total = total+2;
          rolls[i] = "**" + rolls[i].toString() + "!**";
        }
        else if (rolls[i] <= success) {
          total++;
          rolls[i] = "**" + rolls[i].toString() + "**";
        }
        else if (rolls[i] >= cancels) {
          total--;
          rolls[i] = "*" + rolls[i].toString() + "*";
        }
        else {
          rolls[i] = rolls[i].toString();
        }
      }
      results = [rolls, total.toString()];
    }

    else {
      for (let i = 0; i < rolls.length; ++i) {
        if (Number.isInteger(rolls[i])) {
          if (rolls[i] >= explode) {
            rolls.push(diceRoll.diceRoller(1, size)[0]);
          }
        }
      }

      for (let i=0; i<dropLow; i++) {
        let lowRollIndex=0;
        while (!Number.isInteger(rolls[lowRollIndex])) {
          lowRollIndex++;
        }
        for (let j=0; j<rolls.length; j++) {
          if (Number.isInteger(rolls[i]) && Number.isInteger(rolls[lowRollIndex])) {
            if (rolls[i] < rolls[lowRollIndex]) {
              lowRollIndex = i;
            }
          }
        }
        rolls[lowRollIndex] = "~~" + rolls[lowRollIndex].toString() + "~~";
      }
      console.log(quant + ", " + keepLow);
      for (let i=0; i < quant - keepLow; i++) {
        let highRollIndex = 0;
        while (!Number.isInteger(rolls[highRollIndex])){
          highRollIndex++;
        }
        for (let j=0; j<rolls.length; j++) {
          if (Number.isInteger(rolls[i]) && Number.isInteger(rolls[highRollIndex])) {
            if (rolls[i] > rolls[highRollIndex]) {
              highRollIndex = i;
            }
          }
        }
        rolls[highRollIndex] = "~~" + rolls[highRollIndex].toString() + "~~";
      }
      for (const x of rolls) {
        if (Number.isInteger(x)) {
          total = total + x;
        }
      }
    }

    total = total * multiply;
    console.log("divide: " + divide);
    total = total / divide;
    total = total + add;
    total = total - subtract;
    results.push(rolls);
    results.push(total.toString());
    return results;
  },
}
