class Data_Lighting_PointLight extends Data_Lighting_Light
{
    static shaderType = 2
    
    intensity = 10
    radius = 300
    smoothness = 100
    flickerStrength = 0
    flickerSpeed = 10
    
    constructor()
    {
        super()
        this.color = [ 255, 255, 255, 255 ]
    }
    
    serialize()
    {
        const data = super.serialize()
        data.intensity = this.intensity
        data.radius = this.radius
        data.smoothness = this.smoothness
        data.flickerStrength = this.flickerStrength
        data.flickerSpeed = this.flickerSpeed
        return data
    }
    
    static deserialize(root, data)
    {
        const result = new Data_Lighting_PointLight
        result.intensity = data.intensity
        result.radius = data.radius
        result.smoothness = data.smoothness
        result.flickerStrength = data.flickerStrength
        result.flickerSpeed = data.flickerSpeed
        return Object.assign(result, Data_Lighting_Light.deserialize(root, data))
    }
    
    getProperties(x)
    {
        const properties = super.getProperties(x)
        properties.shaderType = this.constructor.shaderType
        properties.intensity = x.get(`intensity`)
        properties.radius = x.get(`radius`)
        properties.smoothness = x.get(`smoothness`)
        properties.flickerStrength = x.get(`flickerStrength`)
        properties.flickerSpeed = x.get(`flickerSpeed`)
        return properties
    }
    
    tausiLighting_createPropertiesEditor($_properties)
    {
        super.tausiLighting_createPropertiesEditor($_properties)
        
        const _default = new Data_Lighting_PointLight
        
        this.createField($_properties, _default, `color`, { type: `color`, max: { a: 1020 } })
        this.createField($_properties, _default, `intensity`, { type: `slider`, max: 40, step: .01 })
        this.createField($_properties, _default, `radius`, { type: `slider`, max: 4000, step: 1 })
        this.createField($_properties, _default, `smoothness`, { type: `slider`, max: 2000 })
        this.createField($_properties, _default, `flickerStrength`, { type: `slider`, max: 200 })
        this.createField($_properties, _default, `flickerSpeed`, { type: `slider`, max: 200 })
    }
}
