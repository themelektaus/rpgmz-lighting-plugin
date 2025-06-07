class Data_Lighting
{
    version = 1
    maps = []
    
    getMap(id)
    {
        if (id <= 0)
        {
            return null
        }
        
        let map = this.maps.find(x => x.id == id)
        
        if (!map)
        {
            map = new Data_Lighting_Map
            map.id = id
            this.maps.push(map)
        }
        
        return map
    }
    
    static load(data, loadUrlContent)
    {
        const result = Object.assign(new Data_Lighting, data)
        
        for (const i in result.maps)
        {
            result.maps[i] = Object.assign(new Data_Lighting_Map, result.maps[i])
            
            const map = result.maps[i]
            
            map.lights ??= []
            
            for (const j in map.lights)
            {
                if (map.lights[j].targetId)
                {
                    map.lights[j] = Object.assign(new Data_Lighting_Reference, map.lights[j])
                }
                else if (map.lights[j].type == Data_Lighting_AmbientLight.type)
                {
                    map.lights[j] = Object.assign(new Data_Lighting_AmbientLight, map.lights[j])
                }
                else if (map.lights[j].type == Data_Lighting_PointLight.type)
                {
                    map.lights[j] = Object.assign(new Data_Lighting_PointLight, map.lights[j])
                }
                else if (map.lights[j].type == Data_Lighting_SpotLight.type)
                {
                    map.lights[j] = Object.assign(new Data_Lighting_SpotLight, map.lights[j])
                }
                else
                {
                    map.lights[j] = Object.assign(new Data_Lighting_MapObject, map.lights[j])
                }
            }
            
            map.layers ??= []
            
            for (const j in map.layers)
            {
                const layer = Object.assign(new Data_Lighting_Layer, map.layers[j])
                layer.loadUrlContent()
                map.layers[j] = layer
            }
        }
        
        return result
    }
}
