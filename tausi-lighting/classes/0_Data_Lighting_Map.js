class Data_Lighting_Map
{
    id = 0
    lights = []
    layers = []
    
    generateLightId()
    {
        return this._generateId(this.lights)
    }
    
    generateLayerId()
    {
        return this._generateId(this.layers)
    }
    
    _generateId(array)
    {
        const ids = array.filter(x => x.id).map(x => x.id)
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
            light.id = this.generateLightId()
            this.lights.push(light)
        }
        
        return light
    }
    
    copyLight(light)
    {
        light = Object.assign(Object.create(Object.getPrototypeOf(light)), light)
        
        if (light.id)
        {
            light.id = this.generateLightId()
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
        return this._getById(this.lights, id)
    }
    
    getLightByType(type)
    {
        return this.lights.find(x => x.type == type)
    }
    
    createLayer()
    {
        const layer = new Data_Lighting_Layer
        
        const mapInfo = LightingUtils.getMapInfo()
        
        layer.id = this.generateLayerId()
        layer.init(mapInfo.width, mapInfo.height)
        
        this.layers.push(layer)
        
        return layer
    }
    
    getLayerById(id)
    {
        return this._getById(this.layers, id)
    }
    
    _getById(array, id)
    {
        return array.find(x => x.id == id)
    }
}
