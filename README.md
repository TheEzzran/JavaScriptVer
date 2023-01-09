# Readme
## Install
https://discord.com/api/oauth2/authorize?client_id=810323207810187296&permissions=431912922176&scope=bot

## /roll
/roll rolls normal dice, with a bunch of potential ways to process them.

XdY -- X is the number of dice, Y is the number of faces. 4d6 rolls four six-sided dice.

Ym -- should always be at the start of the dice command, or it might interpret things weirdly. Runs everything after the m Y times, and displays the results separately. Ym4d6 rolls 4 six-sided dice, 6 times, displaying each result separately.

+Y -- add Y to the total at the end

-Y -- subtracts Y from the total at the end

xY -- multiplies the final total by Y

/Y -- divides the final total by Y

vY -- drops the lowest Y results before adding the rest together. 4d6v1 is 4d6 drop lowest. 5d6v2 would drop the lowest two results.

^Y -- opposite of drop lowest, keeps the highest Y results and discards the rest, before adding the rest to gether. 4d6^3 is the same as 4d6v1.

kY -- keep the lowest Y dice, discarding the results. Useful for Disadvantage in D&D. 2d20k1 would roll 2d20 and keep only the worse result.

rY -- sets a threshold, Y, at or below which that die gets rerolled. Instead rerolls dice at or above that threshold if the roll under modifier is present (see below)

eY -- results at or above Y will "explode," adding an additional die to the pool. Recursive.

sY -- Toggles success counting, with the threshold for a success being set at Y or above. When this modifier is present, the bot will not add the results of the dice together, and will instead count the number of dice with a result of Y or higher. If Roll Under is active, will instead flip to count results Y or lower.

cY -- Cancels successes on a result of Y or lower. Can go negative. Does nothing if s is not active. If roll under is active, will cancel on results Y or higher instead.

aY -- Results of Y or higher will give two successes instead of one. Does nothing if s is not active. If roll under is active, will apply to results Y or lower instead.

u -- Inverts the rerolls and success counting. Useful for Roll Under systems like GURPS or Warhammer 40k.

## /ova
/ova Rolls dice using OVA's dice system, which has unique dice mechanics.

## /fudge
/fudge Rolls dice Fudge dice, with a blank face represented by a 0. Allows for modifiers to the end result, for games like Fate.
