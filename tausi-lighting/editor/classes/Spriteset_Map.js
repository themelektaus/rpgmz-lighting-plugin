const TausiLighting__Editor__Spriteset_Map__update = Spriteset_Map.prototype.update
Spriteset_Map.prototype.update = function()
{
    TausiLighting__Editor__Spriteset_Map__update.apply(this, arguments)
    
    if (LightingUtils._lightsNeedRefresh)
    {
        LightingUtils._lightsNeedRefresh = false
        this.refreshLightSprites()
        this.refreshCursorSprites()
        this.update()
    }
    
    if (TouchInput.isTriggered())
    {
        if (!TouchInput._lastMapObject)
        {
            if (LightingUtils.getActiveTool() == `select`)
            {
                LightingUtils.setSelectedMapObject(null)
            }
        }
    }
    
    this.updateLayerPainting()
}

Spriteset_Map.prototype.updateLayers = function()
{
    const a = (this._layerSprites ?? []).map(x => [ x.layer.id, x.filterMode ])
    const b = this.getMapLayers().map(x => [ x.id, x.filterMode ])
    
    if (JSON.stringify(a) != JSON.stringify(b))
    {
        LightingUtils.refresh()
        return false
    }
    
    return true
}

Spriteset_Map.prototype.refreshLightSprites = function()
{
    for (const sprite of this._lightSprites ?? [])
    {
        this.removeChild(sprite)
        sprite.destroy()
    }
    
    this._lightSprites = []
    
    const mapId = $gameMap.mapId()
    const map = $dataLighting.getMap(mapId)
    
    for (const light of map.lights ?? [])
    {
        this._lightSprites.push(new Sprite_Light(light))
    }
    
    for (const layer of map.layers ?? [])
    {
        this._lightSprites.push(new Sprite_Light(layer))
    }
    
    const mapInfo = LightingUtils.getMapInfo()
    
    for (const sprite of this._lightSprites)
    {
        sprite.light.x = Math.min(Math.max(0, sprite.light.x), mapInfo.width)
        sprite.light.y = Math.min(Math.max(0, sprite.light.y), mapInfo.height)
        
        sprite.onPress = () =>
        {
            if (LightingUtils.getActiveTool() == `select`)
            {
                LightingUtils.setSelectedMapObject(sprite.light, { stick: true })
            }
        }
        
        this.addChild(sprite)
    }
}

Spriteset_Map.prototype.refreshCursorSprites = function()
{
    if (this._radiusSprite)
    {
        this.removeChild(this._radiusSprite)
        this._radiusSprite.destroy()
    }
    
    this._radiusSprite = new Sprite
    this._radiusSprite.anchor.x = .5
    this._radiusSprite.anchor.y = .5
    
    const bitmap = new Bitmap(128, 128)
    
    const context = bitmap.context
    
    context.strokeStyle = `#000`
    context.lineWidth = 6
    context.beginPath()
    context.arc(64, 64, 60, 0, Math.PI * 2)
    context.stroke()
    
    context.strokeStyle = `#fff`
    context.lineWidth = 4
    context.beginPath()
    context.arc(64, 64, 60, 0, Math.PI * 2)
    context.stroke()
    
    bitmap._baseTexture.update()
    
    this._radiusSprite.bitmap = bitmap
    
    this.addChild(this._radiusSprite)
}

Spriteset_Map.prototype.updateLayerPainting = function()
{
    const tool = LightingUtils.getActiveTool()
    if (tool != `paint` && tool != `erase`)
    {
        this._radiusSprite.visible = false
        return
    }
    
    const mapObject = LightingUtils.getSelectedMapObject()
    if (!mapObject)
    {
        this._radiusSprite.visible = false
        return
    }
    
    const sprite = (this._layerSprites ?? []).find(x => x.layer == mapObject)
    if (!sprite)
    {
        this._radiusSprite.visible = false
        return
    }
    
    this.updateLayerPaint(sprite, tool)
}

Spriteset_Map.prototype.updateLayerPaint = function(sprite, tool)
{
    if (TouchInput._mousePressed || TouchInput._mousePressed2)
    {
        this._radiusSprite.visible = false
        
        if (TouchInput._mousePressed2)
        {
            switch (tool)
            {
                case `paint`:
                    tool = `erase`
                    break
                
                case `erase`:
                    tool = `paint`
                    break
            }
        }
        
        const x = (TouchInput.x - sprite.x) * sprite.layer.scale
        const y = (TouchInput.y - sprite.y) * sprite.layer.scale
        
        const color = LightingUtils.toolSettings.color
        const radius = LightingUtils.toolSettings.radius * sprite.layer.scale
        const smoothness = LightingUtils.toolSettings.smoothness / 100
        
        const paintLayer = () => this.paintLayer(sprite, tool, x, y, color, radius, smoothness)
        
        if (!this._lastLayerSprite)
        {
            paintLayer()
        }
        else
        {
            // a²
            let a = this._lastX - x
            a *= a
            
            // b²
            let b = this._lastY - y
            b *= b
            
            // c² (current)
            const distance = Math.abs(a - b)
            
            // c² (minimum)
            const minDistance = radius * radius / (Math.PI * Math.PI)
            
            if (distance > minDistance)
            {
                paintLayer()
            }
        }
    }
    else
    {
        if (sprite == this._lastLayerSprite)
        {
            LightingUtils.dump()
            
            sprite.layer.setUrlContent(sprite.bitmap)
            
            SceneManager._scene?.invalidate?.call(SceneManager._scene)
        }
        
        this._lastLayerSprite = null
        
        this._radiusSprite.visible = true
        this._radiusSprite.x = TouchInput._lastMoveX
        this._radiusSprite.y = TouchInput._lastMoveY
        this._radiusSprite.scale.x = LightingUtils.toolSettings.radius / (this._radiusSprite.bitmap.width / 2)
        this._radiusSprite.scale.y = LightingUtils.toolSettings.radius / (this._radiusSprite.bitmap.height / 2)
    }
}

Spriteset_Map.prototype.paintLayer = function(sprite, tool, x, y, color, radius, smoothness)
{
    this._lastLayerSprite = sprite
    this._lastX = x
    this._lastY = y
    
    // Use Randomness?
    //const s = 1 / sprite.layer.scale
    //x += Math.random() * s - s / 2
    //y += Math.random() * s - s / 2
    
    const context = sprite.bitmap.context
    
    context.save()
    
    switch (tool)
    {
        case `paint`:
            context.globalCompositeOperation = `source-over`
            break
        
        case `erase`:
            context.globalCompositeOperation = `destination-out`
            break
    }
    
    const r = radius
    const r2 = r * 2
    const gradient = context.createRadialGradient(x, y, (r - .01) * (1 - smoothness), x, y, r)
    
    const c = [...color]
    gradient.addColorStop(0, LightingUtils.colorToHex(c))
    
    c[3] = 0
    gradient.addColorStop(1, LightingUtils.colorToHex(c))
    
    context.fillStyle = gradient
    context.fillRect(x - r, y - r, r2, r2)
    
    context.restore()
    
    sprite.bitmap._baseTexture.update()
    
    sprite._refresh()
}
