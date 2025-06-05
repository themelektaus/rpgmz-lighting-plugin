const TausiLighting__Game_Event__locate = Game_Event.prototype.locate
Game_Event.prototype.locate = function()
{
    TausiLighting__Game_Event__locate.apply(this, arguments)
    
    this._originalRealX = this._realX
    this._originalRealY = this._realY
}
