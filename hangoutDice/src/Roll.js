function Roll(inputString)
{
	this.rolls = new Array();
	this.value = 0;
	this.MakeRoll = Roll_MakeRoll;
	this.RollsString = Roll_RollsString;
	
	var patt = /[+-]/;
	var split = inputString.split( patt);	// break it up into individual dice groups
	var cursor = 0;
	while( split != null && split.length > 0) {
		// for each dice group
		var innerString = split.shift();

		if( innerString != null && innerString.length > 0) {
			// determine the sign of the addend
			var sign = (inputString.charAt(cursor) == "-") ? -1 : 1;

			var innerSplit = innerString.split( "d", 2);
			var val;
			if( innerSplit.length == 2 ) {
				// format: xdy
				//	x = number of dice
				//	y = size of dice
				var numDice = innerSplit[0];
				var size = innerSplit[1];

				val = this.MakeRoll( numDice, size, this.rolls);
			} else if( innerSplit.length == 1) {
				// format: [+-]k
				val = parseInt( innerSplit[0]);
			}
			
			this.value += val * sign;
			cursor += innerString.length + (cursor == 0 ? 0 : 1);
		}
	}
}

function Roll_MakeRoll(diceNum,diceSize,rolls)
{
	var result = 0;
	var negate = diceNum < 0;

	diceNum = Math.abs( diceNum);
	while( diceNum--) {
		var roll = Math.floor( Math.random() * diceSize) + 1;
		result += roll;
		rolls.push( roll);
	}

	if( negate)
		result = result * -1;

	return result;
}

function Roll_RollsString()
{
	var result = "{";
	var i = 0;
	while( i < this.rolls.length)
		result += (i == 0 ? "" : ", ") + this.rolls[i++]
	result += "}";

	return result;
}
