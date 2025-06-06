class Data_Lighting_AmbientLight extends Data_Lighting_Light
{
    static type = 1
    
    type = Data_Lighting_AmbientLight.type
    weight = 100
    color = [ 50, 50, 50, 255 ]
    exposure = 0
    saturation = 0
    power = [ 255, 255, 255, 255 ]
    
    createPropertiesEditor($_properties)
    {
        super.createPropertiesEditor($_properties)
        
        const _default = new Data_Lighting_AmbientLight
        
        this.createField($_properties, _default, `weight`, { type: `slider`, max: 200 })
        this.createField($_properties, _default, `color`, { type: `color`, max: { a: 1020 } })
        this.createField($_properties, _default, `exposure`, { type: `slider`, min: -100, max: 400 })
        this.createField($_properties, _default, `saturation`, { type: `slider`, min: -100, max: 400 })
        this.createField($_properties, _default, `power`, { type: `color`, max: { a: 1020 } })
    }
}
