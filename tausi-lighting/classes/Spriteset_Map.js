const TausiLighting__Spriteset_Map__update = Spriteset_Map.prototype.update
Spriteset_Map.prototype.update = function()
{
    TausiLighting__Spriteset_Map__update.apply(this, arguments)
    
    if (LightingUtils._needsRefresh)
    {
        LightingUtils._needsRefresh = false
        this.refreshLayers()
        this.refreshFilters()
    }
    
    this.updateLayers()
    
    for (const filter of this._lightingFilters ?? [])
    {
        filter.update()
    }
}

Spriteset_Map.prototype.getMapLayers = function()
{
    const layers = [...$dataLighting.getMap($gameMap.mapId())?.layers ?? []]
    layers.sort((a, b) => a.y - b.y)
    return layers
}

Spriteset_Map.prototype.refreshLayers = function()
{
    for (const sprite of this._layerSprites ?? [])
    {
        this._baseSprite.removeChild(sprite)
        sprite.bitmap.destroy()
        sprite.destroy()
    }
    
    this._layerSprites = []
    
    for (const layer of this.getMapLayers())
    {
        const sprite = new Sprite
        
        sprite.layer = layer
        sprite.filterMode = layer.filterMode
        sprite.bitmap = Bitmap.load(layer.url + `?t=${(new Date()).getTime()}`)
        sprite.scale.x = 1 / layer.scale
        sprite.scale.y = 1 / layer.scale
        this._layerSprites.push(sprite)
    }
    
    for (const sprite of this._layerSprites)
    {
        this._baseSprite.addChild(sprite)
    }
}

const TausiLighting__Spriteset_Map__updateLayers = Spriteset_Map.prototype.updateLayers
Spriteset_Map.prototype.updateLayers = function()
{
    if (!(TausiLighting__Spriteset_Map__updateLayers?.apply(this, arguments) ?? true))
    {
        return false
    }
    
    for (const sprite of this._layerSprites)
    {
        this.updateLayer(sprite)
    }
    
    return true
}

Spriteset_Map.prototype.updateLayer = function(sprite)
{
    sprite.visible = sprite.layer.enabled && sprite.layer.filterMode == 0
    
    if (sprite.visible)
    {
        sprite.blendMode = sprite.layer.blendMode
        sprite.opacity = sprite.layer.opacity
    }
    
    sprite.x = -this._tilemap.origin.x
    sprite.y = -this._tilemap.origin.y
}

Spriteset_Map.prototype.refreshFilters = function()
{
    const filters = this._baseSprite.filters
    
    for (const filter of this._lightingFilters ?? [])
    {
        filters.splice(filters.indexOf(filter), 1)
    }
    
    this._lightingFilters = []
    
    for (const sprite of this._layerSprites.filter(x => x.layer.filterMode < 0))
    {
        const filter = new LayerFilter(sprite)
        this._lightingFilters.push(filter)
    }
    
    this._lightingFilters.push(new LightingFilter())
    
    for (const sprite of this._layerSprites.filter(x => x.layer.filterMode > 0))
    {
        const filter = new LayerFilter(sprite)
        this._lightingFilters.push(filter)
    }
    
    filters.push(...this._lightingFilters)
}
