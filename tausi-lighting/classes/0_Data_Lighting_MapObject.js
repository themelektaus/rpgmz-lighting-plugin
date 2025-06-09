class Data_Lighting_MapObject
{
    map = null
    
    id = 0
    
    objectId = 0
    
    get object()
    {
        return this.map.root.getObject(this.objectId)
    }
    
    enabled = true
    
    x = 0
    y = 0
    followEventId = 0
    
    serialize()
    {
        return {
            id: this.id,
            objectId: this.objectId,
            enabled: this.enabled,
            x: this.x,
            y: this.y,
            followEventId: this.followEventId
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
        result.followEventId = data.followEventId
        return result
    }
    
    get(property)
    {
        if (this[property] !== undefined)
        {
            return LightingUtils.get(this, property)
        }
        else
        {
            return this.object.get(property)
        }
    }
    
    set(property, value)
    {
        if (this[property] !== undefined)
        {
            LightingUtils.set(this, property, value)
        }
        else
        {
            this.object.set(property, value)
        }
    }
    
    createField($_properties, _default, property, options)
    {
        options.dump ??= true
        return LightingUtils.createField.call(this, $_properties, _default, property, options)
    }
    
    createPropertiesEditor($_properties)
    {
        const $input = this
            .createField($_properties, null, `generateScriptCommand()`, { label: `mapObject` })
            .querySelector(`input`)
        $input.classList.add(`mono`)
        $input.style.color = `#9cf`
        
        this.createField($_properties, null, `enabled`, { type: `toggle` })
        this.createField($_properties, null, `followEventId`, { type: `number` })
        
        this.object.createPropertiesEditor($_properties)
    }
    
    generateScriptCommand(property)
    {
        const result = `$dataLighting.getMapObject(${this.id})`
        return property
            ? `${result}.set("${property}", ${JSON.stringify(this[property])})`
            : result
    }
}
