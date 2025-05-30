class Data_Lighting_PointLight extends Data_Lighting_Light
{
    static type = 2
    
    type = Data_Lighting_PointLight.type
    color = [ 255, 255, 255, 255 ]
    intensity = 10
    radius = 300
    smoothness = 100
    flickerStrength = 0
    flickerSpeed = 10
    
    createPropertiesEditor($_properties)
    {
        super.createPropertiesEditor($_properties)
        
        const _default = new Data_Lighting_PointLight
        
        this.createField($_properties, _default, `color`, { type: `color` })
        this.createField($_properties, _default, `intensity`, { type: `slider`, max: 40, step: .01 })
        this.createField($_properties, _default, `radius`, { type: `slider`, max: 4000, step: 1 })
        this.createField($_properties, _default, `smoothness`, { type: `slider`, max: 2000 })
        this.createField($_properties, _default, `flickerStrength`, { type: `slider`, max: 200 })
        this.createField($_properties, _default, `flickerSpeed`, { type: `slider`, max: 200 })
    }
}
