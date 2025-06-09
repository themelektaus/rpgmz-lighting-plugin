class Data_Lighting_SpotLight extends Data_Lighting_Light
{
    static shaderType = 3
    
    intensity = 10
    width = 2
    spread = 10
    spreadFade = 100
    direction = 90
    distance = 500
    distanceFadeIn = 25
    distanceFadeOut = 250
    
    constructor()
    {
        super()
        this.color = [ 255, 255, 255, 255 ]
    }
    
    serialize()
    {
        const data = super.serialize()
        data.intensity = this.intensity
        data.width = this.width
        data.spread = this.spread
        data.spreadFade = this.spreadFade
        data.direction = this.direction
        data.distance = this.distance
        data.distanceFadeIn = this.distanceFadeIn
        data.distanceFadeOut = this.distanceFadeOut
        return data
    }
    
    static deserialize(root, data)
    {
        const result = new Data_Lighting_SpotLight
        result.intensity = data.intensity
        result.width = data.width
        result.spread = data.spread
        result.spreadFade = data.spreadFade
        result.direction = data.direction
        result.distance = data.distance
        result.distanceFadeIn = data.distanceFadeIn
        result.distanceFadeOut = data.distanceFadeOut
        return Object.assign(result, Data_Lighting_Light.deserialize(root, data))
    }
    
    createPropertiesEditor($_properties)
    {
        super.createPropertiesEditor($_properties)
        
        const _default = new Data_Lighting_SpotLight
        
        this.createField($_properties, _default, `color`, { type: `color`, max: { a: 1020 } })
        this.createField($_properties, _default, `intensity`, { type: `slider`, max: 40, step: .01 })
        this.createField($_properties, _default, `width`, { type: `slider`, max: 10, step: .01 })
        this.createField($_properties, _default, `spread`, { type: `slider`, max: 100, step: .1 })
        this.createField($_properties, _default, `spreadFade`, { type: `slider`, max: 1000 })
        this.createField($_properties, _default, `direction`, { type: `slider`, max: 360 })
        this.createField($_properties, _default, `distance`, { type: `slider`, max: 5000 })
        this.createField($_properties, _default, `distanceFadeIn`, { type: `slider`, max: 100 })
        this.createField($_properties, _default, `distanceFadeOut`, { type: `slider`, max: 1000 })
    }
}
