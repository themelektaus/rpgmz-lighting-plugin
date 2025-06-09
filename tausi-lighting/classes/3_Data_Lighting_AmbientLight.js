class Data_Lighting_AmbientLight extends Data_Lighting_Light
{
    static shaderType = 1
    
    weight = 100
    exposure = 0
    saturation = 0
    power = [ 255, 255, 255, 255 ]
    
    constructor()
    {
        super()
        this.color = [ 50, 50, 50, 255 ]
    }
    
    serialize()
    {
        const data = super.serialize()
        data.weight = this.weight
        data.exposure = this.exposure
        data.saturation = this.saturation
        data.power = [ ...this.power ]
        return data
    }
    
    static deserialize(root, data)
    {
        const result = new Data_Lighting_AmbientLight
        result.weight = data.weight
        result.exposure = data.exposure
        result.saturation = data.saturation
        result.power = [ ...data.power ]
        return Object.assign(result, Data_Lighting_Light.deserialize(root, data))
    }
    
    createPropertiesEditor($_properties)
    {
        super.createPropertiesEditor($_properties)
        
        const _default = new Data_Lighting_AmbientLight
        
        this.createField($_properties, _default, `color`, { type: `color`, max: { a: 1020 } })
        this.createField($_properties, _default, `weight`, { type: `slider`, max: 200 })
        this.createField($_properties, _default, `exposure`, { type: `slider`, min: -100, max: 400 })
        this.createField($_properties, _default, `saturation`, { type: `slider`, min: -100, max: 400 })
        this.createField($_properties, _default, `power`, { type: `color`, max: { a: 1020 } })
    }
}
