function RollLogEntry( request, roll, userName)
{
	this.rollString = request;
	this.roll = roll;
	this.userName = userName;
	
	this.toString = RollLogEntry_toString;
}

function RollLogEntry_toString()
{
	var result = (this.userName != null) ? this.userName : "anon";
	result +=  ">" + this.rollString + "\r\n" + this.roll.RollsString() + "  " + this.roll.value + "\r\n";
	return result;
}
