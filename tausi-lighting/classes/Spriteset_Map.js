const TausiLighting__Spriteset_Map__update = Spriteset_Map.prototype.update
Spriteset_Map.prototype.update = function()
{
    TausiLighting__Spriteset_Map__update.apply(this, arguments)
    
    if (LightingUtils._filterNeedsRefresh)
    {
        LightingUtils._filterNeedsRefresh = false
        this.refreshLightingFilter()
    }
    
    this._lightingFilter.update()
}

Spriteset_Map.prototype.refreshLightingFilter = function()
{
    const filters = this._baseSprite.filters
    
    if (this._lightingFilter)
    {
        const index = filters.indexOf(this._lightingFilter)
        filters.splice(index, 1)
    }
    
    this._lightingFilter = new LightingFilter()
    filters.push(this._lightingFilter)
}
