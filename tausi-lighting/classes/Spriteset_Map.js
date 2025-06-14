const TausiLighting__Spriteset_Map__initialize = Spriteset_Map.prototype.initialize
Spriteset_Map.prototype.initialize = function()
{
    TausiLighting__Spriteset_Map__initialize.apply(this, arguments)
    
    this._tausiLighting_layerSprites = []
    this._tausiLighting_lightingFilters = []
}

const TausiLighting__Spriteset_Map__update = Spriteset_Map.prototype.update
Spriteset_Map.prototype.update = function()
{
    TausiLighting__Spriteset_Map__update.apply(this, arguments)
    
    if (LightingUtils._needsRefresh)
    {
        LightingUtils._needsRefresh = false
        
        this._tausiLighting_refreshLayers()
        this._tausiLighting_refreshFilters()
    }
    
    this._tausiLighting_updateLayers()
    
    for (const filter of this._tausiLighting_lightingFilters)
    {
        filter.update()
    }
}

Spriteset_Map.prototype._tausiLighting_getLayerMapObjects = function()
{
    const map = $dataLighting.getCurrentMap()
    const mapObjects = [ ...(map.getMapObjectsOfType(Data_Lighting_Layer)) ]
    mapObjects.sort((a, b) => a.y - b.y)
    return mapObjects
}

Spriteset_Map.prototype._tausiLighting_refreshLayers = function()
{
    for (const sprite of this._tausiLighting_layerSprites)
    {
        this._baseSprite.removeChild(sprite)
        sprite.bitmap.destroy()
        sprite.destroy()
    }
    
    this._tausiLighting_layerSprites = []
    
    for (const mapObject of this._tausiLighting_getLayerMapObjects())
    {
        const object = mapObject.getObject()
        
        const sprite = new Sprite
        sprite.mapObject = mapObject
        sprite.filterMode = mapObject.get(`filterMode`)
        sprite.bitmap = Bitmap.load(
            object.urlContent
                ? `data:image/png;base64,${object.urlContent}`
                : `${object.url}?t=${(new Date()).getTime()}`
        )
        sprite.scale.x = 1 / object.scale
        sprite.scale.y = 1 / object.scale
        this._tausiLighting_layerSprites.push(sprite)
    }
    
    for (const sprite of this._tausiLighting_layerSprites)
    {
        this._baseSprite.addChild(sprite)
    }
}

const TausiLighting__Spriteset_Map__updateLayers = Spriteset_Map.prototype._tausiLighting_updateLayers
Spriteset_Map.prototype._tausiLighting_updateLayers = function()
{
    if (!(TausiLighting__Spriteset_Map__updateLayers?.apply(this, arguments) ?? true))
    {
        return false
    }
    
    for (const sprite of this._tausiLighting_layerSprites)
    {
        this._tausiLighting_updateLayer(sprite)
    }
    
    return true
}

Spriteset_Map.prototype._tausiLighting_updateLayer = function(sprite)
{
    sprite.visible = sprite.mapObject.enabled && sprite.mapObject.get(`filterMode`) == 0
    
    if (sprite.visible)
    {
        sprite.blendMode = sprite.mapObject.get(`blendMode`)
        sprite.opacity = sprite.mapObject.get(`opacity`)
    }
    
    sprite.x = -this._tilemap.origin.x
    sprite.y = -this._tilemap.origin.y
}

Spriteset_Map.prototype._tausiLighting_refreshFilters = function()
{
    const filters = this._baseSprite.filters
    
    for (const filter of this._tausiLighting_lightingFilters)
    {
        filters.splice(filters.indexOf(filter), 1)
    }
    
    this._tausiLighting_lightingFilters = []
    
    for (const sprite of this._tausiLighting_layerSprites.filter(x => x.mapObject.get(`filterMode`) < 0))
    {
        const filter = new LayerFilter(sprite)
        this._tausiLighting_lightingFilters.push(filter)
    }
    
    this._tausiLighting_lightingFilters.push(new LightingFilter())
    
    for (const sprite of this._tausiLighting_layerSprites.filter(x => x.mapObject.get(`filterMode`) > 0))
    {
        const filter = new LayerFilter(sprite)
        this._tausiLighting_lightingFilters.push(filter)
    }
    
    filters.push(...this._tausiLighting_lightingFilters)
}
