const Spriteset_Base__update = Spriteset_Base.prototype.update
Spriteset_Base.prototype.update = function()
{
    Spriteset_Base__update.apply(this, arguments)
    
    if (LightingUtils._filterNeedsRefresh)
    {
        LightingUtils._filterNeedsRefresh = false
        this.refreshLightingFilter()
    }
    
    this._lightingFilter.update()
}

Spriteset_Base.prototype.refreshLightingFilter = function()
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
