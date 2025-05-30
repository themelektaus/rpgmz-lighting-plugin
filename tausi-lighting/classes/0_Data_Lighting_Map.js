class Data_Lighting_Map
{
    id = 0
    lights = []
    
    generateId()
    {
        const ids = this.lights.filter(x => x.id).map(x => x.id)
        return Math.max(0, ...ids) + 1
    }
    
    createReference(light)
    {
        const reference = new Data_Lighting_Reference
        reference.targetId = light.id
        reference.x = light.x
        reference.y = light.y
        this.lights.push(reference)
        
        return reference
    }
    
    createLight(type)
    {
        let light
        
        switch (type)
        {
            case Data_Lighting_AmbientLight.type:
                light = new Data_Lighting_AmbientLight
                break
            
            case Data_Lighting_PointLight.type:
                light = new Data_Lighting_PointLight
                break
            
            case Data_Lighting_SpotLight.type:
                light = new Data_Lighting_SpotLight
                break
            
            default:
                light = null
                break
        }
        
        if (light)
        {
            light.id = this.generateId()
            this.lights.push(light)
        }
        
        return light
    }
    
    copyLight(light)
    {
        light = Object.assign(Object.create(Object.getPrototypeOf(light)), light)
        
        if (light.id)
        {
            light.id = this.generateId()
        }
        
        if (light.color)
        {
            light.color = [...light.color]
        }
        
        if (light.power)
        {
            light.power = [...light.power]
        }
        
        this.lights.push(light)
        
        return light
    }
    
    getLightById(id)
    {
        return this.lights.find(x => x.id == id)
    }
    
    getLightByType(type)
    {
        return this.lights.find(x => x.type == type)
    }
}
