class Data_Lighting_AmbientLight extends Data_Lighting_Light
{
    static shaderType = 1
    
    weight = 100
    exposure = 0
    saturation = 0
    contrast = 0
    power = [ 255, 255, 255, 255 ]
    brightness = 0
    
    constructor()
    {
        super()
        this.color = [ 50, 50, 50, 255 ]
    }
    
    get icon()
    {
        return `globelight.svg`
    }
    
    serialize()
    {
        const data = super.serialize()
        data.weight = this.weight
        data.exposure = this.exposure
        data.saturation = this.saturation
        data.contrast = this.contrast
        data.power = [ ...this.power ]
        data.brightness = this.brightness
        return data
    }
    
    static deserialize(root, data)
    {
        const result = new Data_Lighting_AmbientLight
        result.weight = data.weight
        result.exposure = data.exposure
        result.saturation = data.saturation
        result.contrast = data.contrast ?? 0
        result.power = [ ...data.power ]
        result.brightness = data.brightness ?? 0
        return Object.assign(result, Data_Lighting_Light.deserialize(root, data))
    }
    
    getProperties(x)
    {
        const properties = super.getProperties(x)
        properties.shaderType = this.constructor.shaderType
        properties.weight = x.get(`weight`)
        properties.exposure = x.get(`exposure`)
        properties.saturation = x.get(`saturation`)
        properties.contrast = x.get(`contrast`)
        properties.power = [
            x.get(`power[0]`),
            x.get(`power[1]`),
            x.get(`power[2]`),
            x.get(`power[3]`)
        ]
        properties.brightness = x.get(`brightness`)
        return properties
    }
    
    tausiLighting_createPropertiesEditor($_properties)
    {
        super.tausiLighting_createPropertiesEditor($_properties)
        
        const _default = new Data_Lighting_AmbientLight
        
        this.createField($_properties, _default, `color`, { type: `color`, max: { a: 1020 } })
        this.createField($_properties, _default, `weight`, { type: `slider`, max: 200 })
        this.createField($_properties, _default, `exposure`, { type: `slider`, min: -100, max: 400 })
        this.createField($_properties, _default, `saturation`, { type: `slider`, min: -100, max: 400 })
        this.createField($_properties, _default, `contrast`, { type: `slider`, min: -100, max: 400 })
        this.createField($_properties, _default, `power`, { type: `color`, max: { a: 1020 } })
        this.createField($_properties, _default, `brightness`, { type: `slider`, min: -100, max: 100 })
    }
}
