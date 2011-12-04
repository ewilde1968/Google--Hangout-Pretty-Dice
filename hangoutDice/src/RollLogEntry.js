function RollLogEntry( request, roll)
{
	this.rollString = request;
	this.roll = roll;
	
	this.toString = RollLogEntry_toString;
}

function RollLogEntry_toString()
{
	var result =  ">" + this.rollString + "\r\n" + this.roll.RollsString() + "  " + this.roll.value + "\r\n";
	return result;
}
