Spriteset_Map.prototype.refreshLights = function()
{
    for (const sprite of this._lightSprites ?? [])
    {
        this.removeChild(sprite)
        sprite.destroy()
    }
    
    this._lightSprites = []
    
    const mapId = $gameMap.mapId()
    const lights = $dataLighting.getMap(mapId).lights ?? []
    
    const mapInfo = LightingUtils.getMapInfo()
    
    for (const light of lights)
    {
        const sprite = new Sprite_Light(light)
        
        light.x = Math.min(Math.max(0, light.x), mapInfo.width)
        light.y = Math.min(Math.max(0, light.y), mapInfo.height)
        
        sprite.onPress = () =>
        {
            LightingUtils.selectLight(light, { stick: true })
        }
        
        this._lightSprites.push(sprite)
    }
    
    for (const sprite of this._lightSprites)
    {
        this.addChild(sprite)
    }
}

const Spriteset_Map__update = Spriteset_Map.prototype.update
Spriteset_Map.prototype.update = function()
{
    Spriteset_Map__update.apply(this, arguments)
    
    if (LightingUtils._lightsNeedRefresh)
    {
        LightingUtils._lightsNeedRefresh = false
        this.refreshLights()
        this.update()
    }
    
    if (TouchInput.isTriggered())
    {
        if (!TouchInput._lastLight)
        {
            LightingUtils.selectLight(null)
        }
    }
}
