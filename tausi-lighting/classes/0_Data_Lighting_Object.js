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
        return LightingUtils.get(this, property)
    }
    
    set(property, value)
    {
        LightingUtils.set(this, property, value)
    }
    
    createField($_properties, _default, property, options)
    {
        options.dump ??= true
        return LightingUtils.createField.call(this, $_properties, _default, property, options)
    }
    
    createPropertiesEditor($_properties)
    {
        const $input = this
            .createField($_properties, null, `generateScriptCommand()`, { label: `object` })
            .querySelector(`input`)
        $input.classList.add(`mono`)
        $input.style.color = `#9cf`
    }
    
    generateScriptCommand(property)
    {
        const result = `$dataLighting.getObject(${this.id})`
        return property
            ? `${result}.${property} = ${JSON.stringify(this[property])}`
            : result
    }
}
