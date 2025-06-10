const TausiLighting__Game_Event__locate = Game_Event.prototype.locate
Game_Event.prototype.locate = function()
{
    TausiLighting__Game_Event__locate.apply(this, arguments)
    
    this._originalRealX = this._realX
    this._originalRealY = this._realY
}

Game_Event.prototype.editorMove = function(x, y)
{
    const map = $dataLighting.getMap(this._mapId)
    const mapInfo = LightingUtils.getMapInfo()
    map.setEventOffset(
        this._eventId,
        (x - mapInfo.tileWidth / 2 + mapInfo.offsetX) / mapInfo.tileWidth - this._originalRealX,
        (y - mapInfo.tileHeight / 2 + mapInfo.offsetY) / mapInfo.tileHeight - this._originalRealY
    )
}

Game_Event.prototype.screenX = function()
{
    const map = $dataLighting.getMap(this._mapId)
    const offset = map.getEventOffset(this._eventId)
    return Game_CharacterBase.prototype.screenX.apply(this, arguments) + (offset.x || 0) * $gameMap.tileWidth()
}

Game_Event.prototype.screenY = function()
{
    const map = $dataLighting.getMap(this._mapId)
    const offset = map.getEventOffset(this._eventId)
    return Game_CharacterBase.prototype.screenY.apply(this, arguments) + (offset.y || 0) * $gameMap.tileHeight()
}

Game_Event.prototype.createPropertiesEditor = function($_properties)
{
    const $resetButton = document.createElement(`button`)
    $resetButton.innerHTML = `Reset`
    $resetButton.addEventListener(`click`, () =>
    {
        $resetButton.disabled = true
        $dataLighting.getMap(this._mapId).removeEventOffset(this._eventId)
    })
    if (!$dataLighting.getMap(this._mapId).hasEventOffset(this._eventId))
    {
        $resetButton.disabled = true
    }
    $_properties.appendChild($resetButton)
}
