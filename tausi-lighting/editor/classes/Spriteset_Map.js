const TausiLighting__Editor__Spriteset_Map__initialize = Spriteset_Map.prototype.initialize
Spriteset_Map.prototype.initialize = function()
{
    TausiLighting__Editor__Spriteset_Map__initialize.apply(this, arguments)
    
    this._tausiLighting_mapObjectSprites = []
}

const TausiLighting__Editor__Spriteset_Map__update = Spriteset_Map.prototype.update
Spriteset_Map.prototype.update = function()
{
    TausiLighting__Editor__Spriteset_Map__update.apply(this, arguments)
    
    if (LightingUtils._editorNeedsRefresh)
    {
        LightingUtils._editorNeedsRefresh = false
        
        this._tausiLighting_refreshMapObjectSprites()
        this._tausiLighting_refreshCursorSprites()
        
        this.update()
    }
    
    if (TouchInput.isTriggered())
    {
        if (!TouchInput.tausiLighting_lastSelection)
        {
            const tool = LightingUtils.getActiveTool()
            if (tool == `select`)
            {
                LightingUtils.setSelection(null)
            }
            else if (tool == `selectEvent`)
            {
                const action = LightingUtils.getActiveToolData()
                if (action)
                {
                    action(0)
                }
            }
        }
    }
    
    this._tausiLighting_updateLayerPainting()
}

Spriteset_Map.prototype._tausiLighting_updateLayers = function()
{
    const a = this._tausiLighting_layerSprites.map(x =>
    {
        return [ x.mapObject.objectId, x.filterMode ]
    })
    
    const b = this._tausiLighting_getLayerMapObjects().map(x =>
    {
        const object = x.getObject()
        return [ object.id, object.filterMode ]
    })
    
    if (JSON.stringify(a) != JSON.stringify(b))
    {
        LightingUtils.refresh()
        return false
    }
    
    return true
}

Spriteset_Map.prototype._tausiLighting_refreshMapObjectSprites = function()
{
    for (const sprite of this._tausiLighting_mapObjectSprites)
    {
        this.removeChild(sprite)
        sprite.destroy()
    }
    
    this._tausiLighting_mapObjectSprites = []
    
    for (const event of $gameMap.events())
    {
        const sprite = new Sprite_MapObject(event)
        
        sprite.onPress = () =>
        {
            const tool = LightingUtils.getActiveTool()
            if (tool == `select`)
            {
                LightingUtils.setSelection(sprite.reference, { stick: true })
            }
            else if (tool == `selectEvent`)
            {
                const action = LightingUtils.getActiveToolData()
                action(event.eventId())
            }
        }
        
        this._tausiLighting_mapObjectSprites.push(sprite)
    }
    
    const map = $dataLighting.getCurrentMap()
    
    for (const mapObject of map.objects)
    {
        const sprite = new Sprite_MapObject(mapObject)
        
        sprite.reference.x = Math.min(Math.max(0, mapObject.x), LightingUtils.getMapWidth())
        sprite.reference.y = Math.min(Math.max(0, mapObject.y), LightingUtils.getMapHeight())
        
        sprite.onPress = () =>
        {
            if (LightingUtils.getActiveTool() == `select`)
            {
                LightingUtils.setSelection(sprite.reference, { stick: true })
            }
        }
        
        this._tausiLighting_mapObjectSprites.push(sprite)
    }
    
    for (const sprite of this._tausiLighting_mapObjectSprites)
    {
        this.addChild(sprite)
    }
}

Spriteset_Map.prototype._tausiLighting_refreshCursorSprites = function()
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

Spriteset_Map.prototype._tausiLighting_updateLayerPainting = function()
{
    const tool = LightingUtils.getActiveTool()
    if (tool != `paint` && tool != `erase`)
    {
        this._radiusSprite.visible = false
        return
    }
    
    const selection = LightingUtils.getSelection()
    if (!selection)
    {
        this._radiusSprite.visible = false
        return
    }
    
    const sprite = this._tausiLighting_layerSprites.find(x => x.mapObject == selection)
    if (!sprite)
    {
        this._radiusSprite.visible = false
        return
    }
    
    this._tausiLighting_updateLayerPaint(sprite, tool)
}

Spriteset_Map.prototype._tausiLighting_updateLayerPaint = function(sprite, tool)
{
    if (TouchInput._mousePressed || TouchInput._tausiLighting_mousePressed)
    {
        this._radiusSprite.visible = false
        
        if (TouchInput._tausiLighting_mousePressed)
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
        
        const scale = sprite.mapObject.getObject().scale
        const x = (TouchInput.x - sprite.x) * scale
        const y = (TouchInput.y - sprite.y) * scale
        
        const color = LightingUtils.toolSettings.color
        const radius = LightingUtils.toolSettings.radius * scale
        const smoothness = LightingUtils.toolSettings.smoothness / 100
        
        const paintLayer = () => this._tausiLighting_paintLayer(sprite, tool, x, y, color, radius, smoothness)
        
        if (!this._tausiLighting_lastLayerSprite)
        {
            paintLayer()
        }
        else
        {
            // a²
            let a = this._tausiLighting_lastX - x
            a *= a
            
            // b²
            let b = this._tausiLighting_lastY - y
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
        if (sprite == this._tausiLighting_lastLayerSprite)
        {
            sprite.mapObject.getObject().setUrlContent(sprite.bitmap)
            
            LightingUtils.dump()
            
            SceneManager._scene?.invalidate?.call(SceneManager._scene)
        }
        
        this._tausiLighting_lastLayerSprite = null
        
        this._radiusSprite.visible = true
        this._radiusSprite.x = TouchInput.tausiLighting_lastMoveX
        this._radiusSprite.y = TouchInput.tausiLighting_lastMoveY
        this._radiusSprite.scale.x = LightingUtils.toolSettings.radius / (this._radiusSprite.bitmap.width / 2)
        this._radiusSprite.scale.y = LightingUtils.toolSettings.radius / (this._radiusSprite.bitmap.height / 2)
    }
}

Spriteset_Map.prototype._tausiLighting_paintLayer = function(sprite, tool, x, y, color, radius, smoothness)
{
    this._tausiLighting_lastLayerSprite = sprite
    this._tausiLighting_lastX = x
    this._tausiLighting_lastY = y
    
    // Use Randomness?
    //const s = 1 / sprite.mapObject.getObject().scale
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
