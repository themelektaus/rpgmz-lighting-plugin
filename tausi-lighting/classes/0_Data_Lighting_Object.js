class Data_Lighting_Object
{
    root = null
    
    id = 0
    
    serialize()
    {
        return {
            id: this.id,
            typeName: this.constructor.name
        }
    }
    
    static deserialize(root, data)
    {
        const result = new Data_Lighting_Object
        result.root = root
        result.id = data.id
        return result
    }
    
    static getUsage(data, id)
    {
        const usage = []
        
        for (const map of data.maps)
        {
            for (const mapObject of map.objects)
            {
                if (id == mapObject.objectId)
                {
                    usage.push(mapObject)
                }
            }
        }
        
        return usage
    }
    
    get(property)
    {
        return LightingUtils.property(this, property).get()
    }
    
    set(property, value)
    {
        LightingUtils.property(this, property).set(value)
    }
    
    createField($_properties, _default, property, options)
    {
        options.dump ??= true
        return LightingUtils.createField.call(this, $_properties, _default, property, options)
    }
    
    tausiLighting_createPropertiesEditor($_properties)
    {
        const $_input = this
            .createField($_properties, null, `_generateScriptCommand()`, { label: `object` })
            .querySelector(`input`)
        $_input.classList.add(`mono`, `accent`)
    }
    
    generateScriptCommand(property)
    {
        if (!property)
        {
            return this._generateScriptCommand()
        }
        
        return LightingUtils.getSelection().generateScriptCommand(property)
    }
    
    _generateScriptCommand()
    {
        return `$dataLighting.getObject(${this.id})`
    }
}
