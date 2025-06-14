class Data_Lighting_MapObject
{
    map = null
    
    id = 0
    
    objectId = 0
    
    getObject()
    {
        return this.map.root.getObject(this.objectId)
    }
    
    objectOverrides = { }
    
    enabled = true
    
    x = 0
    y = 0
    
    referenceEventId = 0
    
    getReferenceEvent()
    {
        return this.referenceEventId ? $gameMap.event(this.referenceEventId) : null
    }
    
    serialize()
    {
        return {
            id: this.id,
            objectId: this.objectId,
            enabled: this.enabled,
            x: this.x,
            y: this.y,
            referenceEventId: this.referenceEventId
        }
    }
    
    static deserialize(map, data)
    {
        const result = new Data_Lighting_MapObject
        result.map = map
        result.id = data.id
        result.objectId = data.objectId
        result.enabled = data.enabled
        result.x = data.x
        result.y = data.y
        result.referenceEventId = data.referenceEventId
        return result
    }
    
    get(property)
    {
        if (this.objectOverrides[property] !== undefined)
        {
            return this.objectOverrides[property]
        }
        
        let result = LightingUtils.property(this, property).get()
        
        if (result === undefined)
        {
            result = LightingUtils.property(this.getObject(), property).get()
        }
        
        return result
    }
    
    set(property, value)
    {
        if (this[property] !== undefined)
        {
            this[property] = value
        }
        else
        {
            this.objectOverrides[property] = value
        }
    }
    
    createField($_properties, _default, property, options)
    {
        options.dump ??= true
        return LightingUtils.createField.call(this, $_properties, _default, property, options)
    }
    
    tausiLighting_createPropertiesEditor($_properties)
    {
        const $_input = this
            .createField($_properties, null, `generateScriptCommand()`, { label: `mapObject` })
            .querySelector(`input`)
        $_input.classList.add(`mono`, `accent`)
        
        this.createField($_properties, null, `enabled`, { type: `toggle` })
        this.createField($_properties, null, `referenceEventId`, { type: `event` })
        
        this.getObject().tausiLighting_createPropertiesEditor($_properties)
    }
    
    generateScriptCommand(property)
    {
        const result = `$dataLighting.getMapObject(${this.id})`
        return property
            ? `${result}.set("${property}", ${JSON.stringify(this.get(property))})`
            : result
    }
    
    tausiLighting_EditorMove(x, y)
    {
        this.x = x + LightingUtils.getMapOffsetX()
        this.y = y + LightingUtils.getMapOffsetY()
    }
}
