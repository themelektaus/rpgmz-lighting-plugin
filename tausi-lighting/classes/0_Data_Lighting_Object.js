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
    
    createPropertiesEditor($_properties)
    {
        const $input = this
            .createField($_properties, null, `_generateScriptCommand()`, { label: `object` })
            .querySelector(`input`)
        $input.classList.add(`mono`)
        $input.style.color = `#9cf`
    }
    
    generateScriptCommand(property)
    {
        return LightingUtils.getSelectedMapObject().generateScriptCommand(property)
    }
    
    _generateScriptCommand()
    {
        return `$dataLighting.getObject(${this.id})`
    }
}
