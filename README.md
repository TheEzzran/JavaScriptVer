# Jahara Farolla JavaScriptVer

## Install on Your Server
https://discord.com/api/oauth2/authorize?client_id=810323207810187296&permissions=2416167936&scope=bot%20applications.commands

## Commands
### /readme
  Pulls up a link to this document. This one. Here. That you are reading. This is most likely how you got here, but it's gotta be included here for completeness, y'know?
### /roll
  Has one required input. Uses a series of shorthand "codes" to tell the dice roller how to handle its dice, because having 19 different options would be a pain for everyone. The various "codes" are explained below. Please note all codes are case sensitive.
#### Main Dice Code -- XdY
   Rolls X number of Y-sided dice. X and Y both need to be positive numbers or it will give an error. If you leave off X it will roll a single Y-sided die.
#### Roll the Same Dice Pool Multiple Times -- Xm
   m is unique in that it goes before the dice, and the number comes before the code. All other codes go after, with the number after the letter. 
   XmYdZ rolls Y number of Z-sided dice, X times. 4m3d6 would be a traditional AD&D stat line generation, for example. Displays the results of each dice pool on separate lines. Other modifiers will be applied to *each* pool.
#### Drop Lowest -- vX
   Drops the lowest X results off the result pool before adding up the total. 4d6v1 would roll 4d6, ignore the lowest result, and add up the remaining three. 10d10v3 would roll 10d10, ignore the lowest three results, then add up the remaining 7, etc.
#### Keep Highest -- ^X
   Keeps the highest X results off the top of the pool, and ignores the rest. This is essentially does the same thing as Drop Lowest, but inverted. 4d6^3 would be the same as 4d6v1. Rolls 4d6, keeps the top 3 results, ignores the last one, adds up the three. This is mostly here because some people think of Keep Highest before Drop Lowest.
   If Drop Lowest and Keep Highest are both detected in the code, the bot will give an error, as they are the same thing and would conflict with each other.
#### Keep Lowest -- kX
   Keeps the lowest X results, and ignores the rest. Useful for Disadvantage in D&D 5e (2d20k1) or for systems with roll under mechanics. Not too common in my experience but it's here if you need it.
   Will give an error if you try to both Keep and Drop your lowest results.
#### Reroll -- rX
   Rerolls any die that comes up X or lower. That's X or lower, not lower than X. This does not take modifiers into account. Just for clarity, it does show the original die, crossed out, in the results, and adds another die on the end. If Roll Under is toggled (see below), rerolls anything X or higher instead. X defaults to 1 if no value is given but 'r' is present.
#### Exploding Dice -- eX
   If the face value of a die is X or higher, rolls another die and adds that to the result. This is recursive, so if the new die comes up X or higher it will add yet another one. If 'e' is present but no value is specified, it will default to the maximum value on the die.
   Throws an error if X is 1 or less, to prevent infinite explosions.
#### Success Counting -- sX
   For systems that use successes rather than adding dice totals, such as World of Darkness or Exalted. Anything X or higher is counted as a success, and the bot will tally up the successes, rather than total the results from the dice. If 's' is present but doesn't have a number, X defaults to the maximum value on the die.
#### Success Cancelling -- cX
   Ignored if Success Counting isn't active. Enables the cancelling of successes. Removes 1 success for each die that comes up X or lower. Defaults to 1 if no value specified but 'c' is present.
#### Bonus Successes -- aX
   AKA 'Additional Successes.' Ignored completely if Success Counting isn't active. Results X or higher will increase the success count by 2 rather than by 1. Defaults to the maximum value on the die if 'a' is present but doesn't have a number.
#### Roll Under -- u
   Doesn't have a number. Just sets a toggle for that roll. Only matters for certain codes, notably Reroll and the various success codes. Success Counting and Bonus Successes will now count anything X or lower. Success Cancelling will trigger on anything X or higher. Rerolls will trigger on anything X or higher.
#### Modifiers -- +X, -X, xX, and /X
   Does not do order of operations. Always applied in whatever order they're typed in the codes. X can be any number, but can also be a dice code, including modifiers. 2d10v1+5d8v2 is will do fine. `x` is used for multiply because `*` is used for discord's markdown formatting.
   These are always applied to the total, not any individual dice rolls. These can still be used when counting successes.
### /ova
  Rolls "dice" number of dice, following the dice processing rules of OVA, the Anime Roleplaying Game. Displays total according to those rules.
### /fudge
  Rolls "dice" fudge dice, with or without modifiers, and adds up the result.
