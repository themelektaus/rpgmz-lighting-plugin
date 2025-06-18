const TausiLighting__Game_Event__locate = Game_Event.prototype.locate
Game_Event.prototype.locate = function()
{
    TausiLighting__Game_Event__locate.apply(this, arguments)
    
    this._tausiLighting_originalRealX = this._realX
    this._tausiLighting_originalRealY = this._realY
}

Game_Event.prototype.tausiLighting_EditorMove = function(x, y)
{
    $dataLighting.getMap(this._mapId)
        .setEventOffset(
            this._eventId,
            (x - $gameMap.tileWidth() / 2 + LightingUtils.getMapOffsetX()) / $gameMap.tileWidth() - this._tausiLighting_originalRealX,
            (y - $gameMap.tileHeight() / 2 + LightingUtils.getMapOffsetY()) / $gameMap.tileHeight() - this._tausiLighting_originalRealY
        )
}

Game_Event.prototype.screenX = function()
{
    const map = $dataLighting.getMap(this._mapId)
    const offsetX = map.getEvent(this._eventId)?.offsetX || 0
    
    let screenX = Game_CharacterBase.prototype.screenX.apply(this, arguments)
    screenX += offsetX * $gameMap.tileWidth()
    return screenX
}

Game_Event.prototype.screenY = function()
{
    const map = $dataLighting.getMap(this._mapId)
    const offsetY = map.getEvent(this._eventId)?.offsetY || 0
    
    let screenY = Game_CharacterBase.prototype.screenY.apply(this, arguments)
    screenY += offsetY * $gameMap.tileHeight()
    return screenY
}

Game_Event.prototype.tausiLighting_createPropertiesEditor = function($_properties)
{
    const map = $dataLighting.getMap(this._mapId)
    const event = map.getEvent(this._eventId)
    
    LightingUtils.createField.call(event, $_properties, null, `offsetX`)
    LightingUtils.createField.call(event, $_properties, null, `offsetY`)
    
    const $_round = document.createElement(`button`)
    $_round.innerHTML = `Round`
    
    $_round.addEventListener(`click`, () =>
    {
        const event = map.getEvent(this._eventId)
        map.setEventOffset(this._eventId, Math.round(event.offsetX), Math.round(event.offsetY))
        
        LightingUtils.dump()
        LightingUtils.invalidate()
        
        LightingUtils.clearPropertiesEditor($_properties)
        this.tausiLighting_createPropertiesEditor.call(this, $_properties)
    })
    
    if (!map.hasEvent(this._eventId))
    {
        $_round.disabled = true
    }
    
    $_properties.appendChild($_round)
}
