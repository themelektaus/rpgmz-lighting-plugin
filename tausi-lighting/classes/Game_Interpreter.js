Game_Interpreter.prototype.bindSwitch = function(options)
{
    $gameMap.bindSwitch(this, options)
}

Game_Interpreter.prototype.bindVariable = function(options)
{
    $gameMap.bindVariable(this, options)
}

Game_Interpreter.prototype.interpolate = function(options)
{
    $gameMap.startInterpolation(this, options)
}
