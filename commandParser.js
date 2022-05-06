const random = require('random');
const diceRoll = require('./diceRoller.js');
const isnum = require('./isNumeric.js');
const diceParse = require('./diceParse.js');
//const dicePool = require('./dicePool.js');

class dicePool {
  constructor(dice) {
    this.quant = ""
    this.size = ""; //size of dice to roll
    this.dropLow = ""; //drop this many dice off the bottom before adding the results up
    this.keepLow = ""; //keep this many dice from the bottom before adding results up. Drop the rest.
    this.reroll = ""; //The reroll threshhold.
    this.explode = ""; //The result required for a die to "explode" and roll another one. Defaults to size ff no value is defined.
    this.success = ""; //sets the success threshhold. Sets to 0 if not using success counting.
    this.cancels = ""; //sets threshold for success cancelling. Anything this number or lower will negate a success. Successes can be negative. Ignored if success is 0.
    this.successBonus = ""; //threshold for bonus successes. Set to die size if bonus successes are enabled but no number is given.
    this.rollUnder = false; //set to true with certain modifiers to change how successes are counted.
    this.add = false;
    this.subtract = false;
    this.multiply = false;
    this.divide = false;

    this.error = false;
    this.errorText = "";

    if (dice.indexOf("d") > -1) { //searching for the actual dice count and size, then stores those for later use by the roller.
      //console.log("Core Mechanic");
      let pos = dice.indexOf("d");
      let i = pos - 1;

      while (isnum.isNumeric(dice[i])) {
      this.quant = dice[i] + this.quant;
        i--;
      }
      i = pos + 1;
      while (isnum.isNumeric(dice[i])) {
        this.size = this.size + dice[i];
        i++;
      }
      this.quant = parseInt(this.quant);
      if (this.size == "") {
        this.error=true;
        this.errorText="I didn't catch that. What size dice did you want?\n";
      }
      this.size = parseInt(this.size); }
      //console.log("pre-mult");
    if (dice.indexOf("v") > -1) { //checks for the drop lowest stuff, and sets the this.dropLow variable accordingly.
      //console.log("dropLowest");
      let pos = dice.indexOf("v");
      let i = pos + 1;
      while (isnum.isNumeric(dice[i])) {
        this.dropLow = this.dropLow + dice[i];
        i++;
      }
      this.dropLow = parseInt(this.dropLow);
    }

    //console.log(this.dropLow);
    if (dice.indexOf("^") > -1 && this.dropLow == "") { //Checks for keeping the highest however many results, then sets this.dropLow to the quantity of results minus the value given for this. Keeping the highest X and dropping the lowest (quantity - X) are functionally identical anyway.
      //console.log("keepHigh");
      let pos = dice.indexOf("^");
      let i = pos + 1;
      while (isnum.isNumeric(dice[i])) {
        this.dropLow = this.dropLow + dice[i];
        i++;
      }
      this.dropLow = this.quant - parseInt(this.dropLow);
    }
    else if (dice.indexOf("^") > -1 && this.dropLow > "") {
      this.errorText = "Keeping highest and dropping the lowest are the same! Pick one!\n";
      this.error = true;
    }
    if (this.dropLow == "") { this.droplow = 0; }

    if (dice.indexOf("k") > -1 && this.dropLow == 0) { //checks for keep lowest and sets this.keepLow accordingly. Throws an error if it would both keep and drop the lowest.
      //console.log("this.keepLow");
      let pos = dice.indexOf("k");
      let i = pos + 1;
      while (isnum.isNumeric(dice[i])) {
        this.keepLow = this.keepLow + dice[i];
        i++;
      }
      this.keepLow = parseInt(this.keepLow);
    }
    else {
      this.keepLow = this.quant;
    }
    if (dice.indexOf("k") > -1 && this.dropLow > 0) {
      this.errorText = "Wanna eat your cake and have it too, huh? I can't keep *and* drop the lowest results!\n";
      this.error = true;
    }
    if (dice.indexOf("r") > -1) { //Sets the reroll threshold, throws an error if the this.reroll is greater than the size of the die (to prevent infinite rerolling), and sets the reroll threshold to 0 if the reroll modifier isn't present.
      //console.log("this.reroll");
      let pos = dice.indexOf("r");
      let i = pos + 1;
      while (isnum.isNumeric(dice[i])) {
        this.reroll = this.reroll + dice[i];
        i++;
      }
      if (this.reroll == "") {
        this.reroll = 1;
      }
      else {
        this.reroll = parseInt(this.reroll);
      }
      if (this.reroll >= this.size) {
        this.errorText = "How am I supposed to get higher than " + this.size.toString() + " on a " + this.size.toString() + " sided die?\n";
        this.error = true;
      }
    }
    else {
      this.reroll = 0
      }


    if (dice.indexOf("e") > -1) { //checks for exploding dice, sets the value accordingly, throws an error if the explode threshold is 1 or less, and sets the threshold to greater than the die .size if the phrase isn't there
      //console.log("this.explode");
      let pos = dice.indexOf("e");
      let i = pos + 1;
      while (isnum.isNumeric(dice[i])) {
        this.explode = this.explode + dice[i];
        i++;
      }
      if (this.explode == "") {
        this.explode = this.size;
      }
      else {
        this.explode = parseInt(this.explode);
      }
    }
    if (this.explode == "") {
      this.explode = this.size + 1;
    }
    else if (this.explode <= 1) {
      this.errorText = "Infinite explosions? COOL! But I'm not crashing today, thanks.\n";
      this.error = true;
    }
    //console.log("before successes");
    if (dice.indexOf("s") > -1) { //sets the threshold for success counting. Is set to 0 if it's not active, and set to die size if the modifier is there but no number.
      //console.log("successCount");
      let pos = dice.indexOf("s");
      let i = pos + 1;
      while (isnum.isNumeric(dice[i])) {
        this.success = this.success + dice[i];
        i++;
      }
      if (this.success == "") {
        this.success = this.size;
      }
      else {
        this.success = parseInt(this.success);
      }
    }
    else {
      this.success = 0;
    }
    //console.log('before this.cancels');
    if (dice.indexOf("c") > -1) { //sets the threshold for success canceling. Totally ignored if success counting isn't active. Set to 1 if cancel is enabled but no value is given.
      //console.log("this.cancels");
      if (this.success != 0) {
        let pos = dice.indexOf("c");
        let i = pos + 1;
        while (isnum.isNumeric(dice[i])) {
          this.cancels = this.cancels + dice[i];
          i++;
        }
        if (this.cancels == "") {
          this.cancels = 1;
        }
        else {
          this.cancels = parseInt(this.cancels);
        }
      }
    else {
      this.cancels = 0;
      }
    }
    //console.log("this.successBonus");
    if (dice.indexOf("a") > -1) { //sets the threshold for bonus successes. Totally ignored if this.success counting isn't active. Set to die this.size if bonus successes are enabled but no value is given.
      //console.log("additionalSuccess");
      if (this.success != 0) {
        let pos = dice.indexOf("a");
        let i = pos + 1;
        while (isnum.isNumeric(dice[i])) {
          this.successBonus = this.successBonus + dice[i];
          i = i + 1;
        }
        if (this.successBonus == "") {
          this.successBonus = this.size;
        }
        else {
          this.successBonus = parseInt(this.successBonus);
        }
      }
    }
    else {
      this.successBonus = this.size + 1;
    }

    if (dice.indexOf("u") > -1) { //sets this.rollUnder if that modifier is present
      this.rollUnder = true;
      this.successBonus = 0;
    }
    if (dice.indexOf("+") > -1) { //sets this.add if that modifier is present
      this.add = true;
    }
    if (dice.indexOf("-") > -1) { //sets this.subtract if that modifier is present
      this.subtract = true;
    }
    if (dice.indexOf("x") > -1) { //sets this.multiply if that modifier is present
      this.multiply = true;
    }
    if (dice.indexOf("/") > -1) { //sets this.rollUnder if that modifier is present
      this.divide = true;
    }
    this.results = "";
    this.total = 0;
  }
  roll() {
     this.toal = 0;
     this.results = "";
     let result = diceParse.diceParse(this.quant, this.size, this.dropLow, this.keepLow, this.reroll, this.explode, this.success, this.cancels, this.successBonus, this.rollUnder);
     let textResult = "[";
     for (let i = 0; i<result[0].length; ++i) {
       textResult = textResult + result[0][i] + ", ";
     }
     textResult = textResult.slice(0,-2) + "]";
     this.results = textResult;
     this.total = result[1];
  }
};

module.exports = {


    commandParser: function(dice) {
      if (!isnum.isNumeric(dice[0]) && dice[0] != "d") {
        return "What does that even mean? Gotta be a positive number of dice, chief.\n";
      }
      else if (dice[0] == "d") {
        dice = "1" + dice;
      }
      dice = dice + " ";
      let mult = 1;
      let diceCom = [];
      let doMath = true;

      let temp = "";

      console.log("Initializing...")
      for (let i = 0; i<dice.length; ++i) { //this loop breaks apart the input into constituent parts to process individually
        if (dice[i] == 'm') {
          temp = temp + dice[i];
          diceCom.push(temp);
          console.log("diceCom [" + diceCom + "]");
          temp = ""
        }
        else if (dice[i] == 'x' || dice[i] == '+' || dice[i] == '/' || dice[i] == '-') {
          diceCom.push(temp)
          console.log("diceCom [" + diceCom + "]");
          temp = "" + dice[i]
        }
        else if (dice[i] == ' ')
        {
          diceCom.push(temp);
          console.log("diceCom [" + diceCom + "]");
        }
        else {
          temp = temp + dice[i];
        }
      }

      for (let i = 0; i<diceCom.length; ++i) {
        if (diceCom[i].indexOf('m') > -1) {
          mult = parseInt(diceCom[i]);
          console.log("mult parse: " + parseInt(diceCom[i]));
          console.log("Mult: " + mult);
          diceCom.shift();
          console.log("diceCom [" + diceCom + "]");

        }
        if (diceCom[i].indexOf('d') > -1) {
          diceCom[i] = new dicePool(diceCom[i]);
          doMath = false;
        }
      }
      let results = [];
      let output = "";
      let diceQuant = 0;
      for (const x of diceCom) {
        if (typeof (x) == 'object') {
          if (x.error == true) {
            output = x.errorText;
            return output;
          }
          else {
            diceQuant = diceQuant+x.quant;
          }
        }
      }
      if (mult * diceQuant <= 1000) {
        for (let i = 0; i < mult; ++i) {
          results.push(diceCom);
        }
      }
      else {
        output = "How do I hold all these dice!? 1000 is the max for me.\n";
        return output;
      }
      if (mult * diceQuant <= 300 && mult <= 20) {
        if (doMath == false) {
          for (var x of results) {
            let tempOut = "";
            let total = 0
            for (var y of x) {
              console.log(typeof (y));
              if (typeof (y) == 'object') {
                y.roll();
                if (y.add) {
                  tempOut = tempOut + " + " + y.results;
                  total = total + y.total;
                }
                else if (y.subtract) {
                  tempOut = tempOut + " - " + y.results;
                  total = total - y.total;
                }
                else if (y.multiply) {
                  tempOut = tempOut + " x " + y.results;
                  total = total * y.total;
                }
                else if (y.divide) {
                  tempOut = tempOut + " / " + y.results;
                  total = total / y.total;
                }
                else {
                  tempOut = tempOut + y.results;
                  total = total + y.total;
                }
              }
              else if (y.indexOf('+') > -1) {
                if (!isNaN(parseInt(y))) {
                  total = total + parseInt(y);
                  tempOut = tempOut+ y;
                }
                else {
                  output = "Sorry, I can only do math to dice and numbers. Check your formatting!\n"
                  return output;
                }
              }
              else if (y.indexOf('-') > -1) {
                if (!isNaN(parseInt(y))) {
                  total = total + parseInt(y);
                  tempOut = tempOut+ y;
                }
                else {
                  output = "Sorry, I can only do math to dice and numbers. Check your formatting!\n"
                  return output;
                }
              }
              else if (y.indexOf('x') > -1) {
                if (!isNaN(parseInt(y.slice(1)))) {
                  total = total * parseInt(y.slice(1));
                  tempOut = tempOut+ y;
                }
                else {
                  output = "Sorry, I can only do math to dice and numbers. Check your formatting!\n"
                  return output;
                }
              }
              else if (y.indexOf('/') > -1) {
                if (y.indexOf('/0') > -1 ) {
                  output = "Not imploding the universe today, thanks.\n";
                  return output;
                }
                if (!isNaN(parseInt(y.slice(1)))) {
                  total = total / parseInt(y.slice(1));
                  tempOut = tempOut + y;
                }
                else {
                  output = "Sorry, I can only do math to dice and numbers. Check your formatting!\n"
                  return output;
                }
              }
            }
            output = output + tempOut + " = " + total.toString() + "\n";
            tempOut = "";
          }
        }
        else {
          let temp = 0;
          for (var x of diceCom) {
            if (x.indexOf('+') > -1 && !isNaN(parseInt(x))) {
              temp = temp + parseInt(x.slice(1));
            }
            else if (x.indexOf('-') > -1 && !isNaN(parseInt(x))) {
              temp = temp - parseInt(x.slice(1));
            }
            else if (x.indexOf('x') > -1 && !isNaN(parseInt(x.slice(1)))) {
              temp = temp * parseInt(x.slice(1));
            }
            else if (x.indexOf('/') > -1 && !isNaN(parseInt(x.slice(1)))) {
              if (x.indexOf('/0') > -1) {
                output = "Not imploding the universe today, thanks\n";
                return output;
              }
              temp = temp / parseInt(x.slice(1));
            }
            else if (!isNaN(x)) {
              temp = temp + parseInt(x);
            }
            else {
              output = "Sorry, I can only do math to dice and numbers. Check your formatting!\n"
              return output;
            }
          }
          diceCom.push(temp);
          output = "";
          for (let i = 0; i < diceCom.length; ++i) {
            if (i == 0) {
              output = "[" + diceCom[i];
            }
            else if (i < diceCom.length-1) {
              output = output + diceCom[i];
            }
            else {
              output = output + "]" + " = " + diceCom[i].toString() + "\n";
            }
          }
        }
      }
      else {
        output = "Too many dice to display! Here are the totals!\n"
        for (var x of results) {
          total = 0;
          for (var y of x) {
            if (typeof (y) === 'object') {
              y.roll();
              if (y.add) {
                total = total + y.total;
              }
              else if (y.subtract) {
                total = total - y.total;
              }
              else if (y.multiply) {
                total = total * y.total;
              }
              else if (y.divide) {
                total = total / y.total;
              }
              else {
                total = total + y.total;
              }
            }
            else {
              let temp = "";
              if (y.indexOf("-") > -1) {
                let pos = y.indexOf("-");
                let i = pos + 1;
                while (i < y.length && !isNan(parseInt(y[i]))) {
                  temp = temp + y[i];
                  ++i;
                }
                if (temp = "") {
                  temp = "0"
                }
                temp = parseInt(temp);
                total = total - temp;
              }
              if (y.indexOf("+") > -1) {
                let pos = y.indexOf("+");
                let i = pos + 1;
                while (i < y.length && !isNan(parseInt(y[i]))) {
                  temp = temp + y[i];
                  ++i;
                }
                if (temp = "") {
                  temp = "0"
                }
                temp = parseInt(temp);
                total = total + temp;
              }
              if (y.indexOf("x") > -1) {
                let pos = y.indexOf("x");
                let i = pos + 1;
                while (i < y.length && !isNan(parseInt(y[i]))) {
                  temp = temp + y[i];
                  ++i;
                }
                if (temp = "") {
                  temp = "0"
                }
                temp = parseInt(temp);
                total = total * temp;
              }
              if (y.indexOf("/") > -1) {
                if (y.indexOf("/0") > -1) {
                  output = "Not imploding the universe today, thanks.\n";
                  return output;
                }
                let pos = y.indexOf("/");
                let i = pos + 1;
                while (i < y.length && !isNan(parseInt(y[i]))) {
                  temp = temp + y[i];
                  ++i;
                }
                if (temp = "") {
                  temp = "0"
                }
                temp = parseInt(temp);
                total = total / temp;
              }
            }
          }
          output = output + total.toString() + ", ";
        }
        output = output.slice(0,-2) + "\n";
      }
      if (output[output.length-2] == "[") {
        output = output.slice(0,-2);
      }
      if (output.length > 1200) {
        output = "I think people will get mad if I show that many numbers. Try fewer, or smaller, dice.\n";
      }
      return output;
    }
      /*let quant = ""; //number of the dice to roll
      let size = ""; //size of dice to roll
      let mult = "1"; //number of times to roll the dice pool defined by previous two variables
      let dropLow = ""; //drop this many dice off the bottom before adding the results up
      let keepLow = ""; //keep this many dice from the bottom before adding results up. Drop the rest.
      let reroll = ""; //The reroll threshhold.
      let explode = ""; //The result required for a die to "explode" and roll another one. Defaults to size ff no value is defined.
      let success = ""; //sets the success threshhold. Sets to 0 if not using success counting.
      let cancels = ""; //sets threshold for success cancelling. Anything this number or lower will negate a success. Successes can be negative. Ignored if success is 0.
      let successBonus = ""; //threshold for bonus successes. Set to die size if bonus successes are enabled but no number is given.
      let rollUnder = false; //set to true with certain modifiers to change how successes are counted.
      //all the various modifiers are below.
      let add = 0;
      let addStr = "";
      let subtract = 0;
      let subtractStr = "";
      let multiply = 1;
      let multiplyStr = "";
      let divide = 1;
      let divideStr = "";


      if (dice.indexOf("d") > -1) { //searching for the actual dice count and size, then stores those for later use by the roller. Also checks for Fudge dice and sets a flag for it.
        //console.log("Core Mechanic");
        let pos = dice.indexOf("d");
        let i = pos - 1;

        while (isnum.isNumeric(dice[i])) {
          quant = dice[i] + quant;
          i--;
        }
        i = pos + 1;
        while (isnum.isNumeric(dice[i])) {
          size = size + dice[i];
          i++;
        }
        quant = parseInt(quant);
        if (size == "") {
          return "I didn't catch that. What size dice did you want?";
        }
        size = parseInt(size); }
        //console.log("pre-mult");
      if (dice.indexOf("m") > -1) {//checks for the multiple rolls variable and stores how many. If the m variable isn't included, sets mult to 1.
        //console.log("mult Handler");
        let pos = dice.indexOf("m");
        let i = pos - 1;
        mult = "";
        while (isnum.isNumeric(dice[i])) {
          mult = dice[i] + mult;
          i--; }
        }
        mult = parseInt(mult);
      if (mult == "") { mult = 1; }
      //console.log("post-mult");
      if (dice.indexOf("v") > -1) { //checks for the drop lowest stuff, and sets the dropLow variable accordingly.
        //console.log("dropLowest");
        let pos = dice.indexOf("v");
        let i = pos + 1;
        while (isnum.isNumeric(dice[i])) {
          dropLow = dropLow + dice[i];
          i++;
        }
        dropLow = parseInt(dropLow);
      }

      //console.log(dropLow);
      if (dice.indexOf("^") > -1 && dropLow == "") { //Checks for keeping the highest however many results, then sets dropLow to the quantity of results minus the value given for this. Keeping the highest X and dropping the lowest (quantity - X) are functionally identical anyway.
        //console.log("keepHigh");
        let pos = dice.indexOf("^");
        let i = pos + 1;
        while (isnum.isNumeric(dice[i])) {
          dropLow = dropLow + dice[i];
          i++;
        }
        dropLow = quant - parseInt(dropLow);
      }
      else if (dice.indexOf("^") > -1 && dropLow > "") {
        return "Keeping highest and dropping the lowest are the same! Pick one!";
      }
      if (dropLow == "") { droplow = 0; }

      if (dice.indexOf("k") > -1 && dropLow == 0) { //checks for keep lowest and sets keepLow accordingly. Throws an error if it would both keep and drop the lowest.
        //console.log("keepLow");
        let pos = dice.indexOf("k");
        let i = pos + 1;
        while (isnum.isNumeric(dice[i])) {
          keepLow = keepLow + dice[i];
          i++;
        }
        keepLow = parseInt(keepLow);
      }
      else {
        keepLow = quant;
      }
      if (dice.indexOf("k") > -1 && dropLow > 0) {
        return "Wanna eat your cake and have it too, huh? I can't keep *and* drop the lowest results!";
      }
      if (dice.indexOf("r") > -1) { //Sets the reroll threshold, throws an error if the reroll is greater than the size of the die (to prevent infinite rerolling), and sets the reroll threshold to 0 if the reroll modifier isn't present.
        //console.log("reroll");
        let pos = dice.indexOf("r");
        let i = pos + 1;
        while (isnum.isNumeric(dice[i])) {
          reroll = reroll + dice[i];
          i++;
        }
        if (reroll == "") {
          reroll = 1;
        }
        else {
          reroll = parseInt(reroll);
        }
        if (reroll >= size) {
          error = "How am I supposed to get higher than " + size.toString() + " on a " + size.toString() + " sided die?";
          return error;
        }
      }
      else {
        reroll = 0
        }


      if (dice.indexOf("e") > -1) { //checks for exploding dice, sets the value accordingly, throws an error if the explode threshold is 1 or less, and sets the threshold to greater than the die size if the phrase isn't there
        //console.log("explode");
        let pos = dice.indexOf("e");
        let i = pos + 1;
        while (isnum.isNumeric(dice[i])) {
          explode = explode + dice[i];
          i++;
        }
        if (explode == "") {
          explode = size;
        }
        else {
          explode = parseInt(explode);
        }
      }
      if (explode == "") {
        explode = size + 1;
      }
      else if (explode <= 1) {
        return "Infinite explosions? COOL! But I'm not crashing today, thanks.";
      }
      //console.log("before successes");
      if (dice.indexOf("s") > -1) { //sets the threshold for success counting. Is set to 0 if it's not active, and set to die size if the modifier is there but no number.
        //console.log("successCount");
        let pos = dice.indexOf("s");
        let i = pos + 1;
        while (isnum.isNumeric(dice[i])) {
          success = success + dice[i];
          i++;
        }
        if (success == "") {
          success = size;
        }
        else {
          success = parseInt(success);
        }
      }
      else {
        success = 0;
      }
      //console.log('before cancels');
      if (dice.indexOf("c") > -1) { //sets the threshold for success canceling. Totally ignored if success counting isn't active. Set to 1 if cancel is enabled but no value is given.
        //console.log("cancels");
        if (success != 0) {
          let pos = dice.indexOf("c");
          let i = pos + 1;
          while (isnum.isNumeric(dice[i])) {
            cancels = cancels + dice[i];
            i++;
          }
          if (cancels == "") {
            cancels = 1;
          }
          else {
            cancels = parseInt(cancels);
          }
        }
      else {
        cancels = 0;
        }
      }
      //console.log("successBonus");
      if (dice.indexOf("a") > -1) { //sets the threshold for bonus successes. Totally ignored if success counting isn't active. Set to die size if bonus successes are enabled but no value is given.
        //console.log("additionalSuccess");
        if (success != 0) {
          let pos = dice.indexOf("a");
          let i = pos + 1;
          while (isnum.isNumeric(dice[i])) {
            successBonus = successBonus + dice[i];
            i = i + 1;
          }
          if (successBonus == "") {
            successBonus = size;
          }
          else {
            successBonus = parseInt(successBonus);
          }
        }
      }
      else {
        successBonus = size + 1;
      }

      if (dice.indexOf("u") > -1) { //sets rollUnder if that modifier is present
        rollUnder = true;
        successBonus = 0;
      }


    //next few bits just handle all the modifier math
      console.log("modifiers");
      if (dice.indexOf("x") > -1) {
        let pos = dice.indexOf("x");
        let value = "";
        while (pos > -1) {
          let i = pos + 1;
          while (isnum.isNumeric(dice[i])) {
            value = value + dice[i];
            i++;
          }
          multiply = multiply * parseInt(value);
          pos = dice.indexOf("x", pos + 1);
          multiplyStr = multiplyStr + " x " + value;
          value = "";
        }
      }
      if (multiply == 0) {
        multiply = 1;
      }
      if (dice.indexOf("/") > -1) {
        let pos = dice.indexOf("/");
        let value = "";
        while (pos > -1) {
          let i = pos + 1;
          while (isnum.isNumeric(dice[i])) {
            value = value + dice[i];
            i++;
          }
          divide = divide * parseInt(value);
          pos = dice.indexOf("/", pos + 1);
          divideStr = divideStr + " / " + value;
          value = "";
        }
      }
      if (divide == 0) {
        divide = 1;
      }
      if (dice.indexOf("+") > -1) {
        let pos = dice.indexOf("+");
        let value = "";
        while (pos > -1) {
          let i = pos + 1;
          while (isnum.isNumeric(dice[i])) {
            value = value + dice[i];
            i++;
          }
          add = add + parseInt(value);
          pos = dice.indexOf("+", pos + 1);
          addStr = addStr + " + " + value;
          value = "";
        }
      }
      if (dice.indexOf("-") > -1) {
        let pos = dice.indexOf("-");
        let value = "";
        while (pos > -1) {
          let i = pos + 1;
          while (isnum.isNumeric(dice[i])) {
            value = value + dice[i];
            i++;
          }
          subtract = subtract + parseInt(value);
          pos = dice.indexOf("-", pos + 1);
          subtractStr = subtractStr + " - " + value;
          value = "";
        }
      }

      console.log("after init");
      let result = [];
      let output = "[";
      let i = 0;
      console.log("mult: " + mult + " , quant: " + quant);
      if (mult * quant <= 1000) {
        while (i < mult) {
          result.push(diceParse.diceParse(quant, size, dropLow, keepLow, reroll, explode, success, cancels, successBonus, rollUnder, add, subtract, multiply, divide));
          i++;
        }
      }
      else {
        output = "How do I hold all these dice!? 1000 is the max for me.";
        return output;
      }

      if (mult * quant <= 300 && mult <= 20) {
        for (const x of result) {
          for (const y of x[0]) {
            output = output + y.toString() + ", ";
            console.log(output);
          }
          output = output.slice(0, -2);
          //print("OutputCheck")
          //print(output)
          output = output + "] ";
          if (multiply > 1) {
            output = output + multiplyStr;
          }
          if (divide > 1) {
            output = output + divideStr;
          }
          if (add > 0) {
            output = output + addStr;
          }
          if (subtract > 0) {
            output = output + subtractStr;
          }
          //print(x[1])
          //print("TotalCheck")
          output = output + " = " + x[1] + "\n" + "[";
        }
        console.log(output);
        if (output[output.length-1] == "[") {
          output = output.slice(0, -1);
        }
        if (output.length > 1850) {
          output = "Woah, that's too many numbers for discord to display, even when I try and shorten it. Try splitting up your dice rolling!";
        }
        return output;
      }
      else {
        output = "Too many dice to display! Here are the totals!\n";
        for (const x of result) {
          output = output + x[1] + ", ";
        }
        output = output.slice(0, -2);
        if (output.length > 1850) {
          output = "Woah! That's a bit too many numbers for discord to display, even when I try and shorten it. Try splitting up your dice rolling!";
        }
        return output;
      }
    },*/
};
