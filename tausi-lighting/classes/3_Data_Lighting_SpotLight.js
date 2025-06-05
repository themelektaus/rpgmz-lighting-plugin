class Data_Lighting_SpotLight extends Data_Lighting_Light
{
    static type = 3
    
    type = Data_Lighting_SpotLight.type
    color = [ 255, 255, 255, 255 ]
    intensity = 10
    width = 2
    spread = 10
    spreadFade = 100
    direction = 90
    distance = 500
    distanceFadeIn = 25
    distanceFadeOut = 250
    followEventId = 0
    
    createPropertiesEditor($_properties)
    {
        super.createPropertiesEditor($_properties)
        
        const _default = new Data_Lighting_SpotLight
        
        this.createField($_properties, _default, `color`, { type: `color`, max: { a: 1020 } } )
        this.createField($_properties, _default, `intensity`, { type: `slider`, max: 40, step: .01 })
        this.createField($_properties, _default, `width`, { type: `slider`, max: 10, step: .01 })
        this.createField($_properties, _default, `spread`, { type: `slider`, max: 100, step: .1 })
        this.createField($_properties, _default, `spreadFade`, { type: `slider`, max: 1000 })
        this.createField($_properties, _default, `direction`, { type: `slider`, max: 360 })
        this.createField($_properties, _default, `distance`, { type: `slider`, max: 5000 })
        this.createField($_properties, _default, `distanceFadeIn`, { type: `slider`, max: 100 })
        this.createField($_properties, _default, `distanceFadeOut`, { type: `slider`, max: 1000 })
        this.createField($_properties, null, `followEventId`, { type: `number`, min: 0 })
    }
}
