class Data_Lighting
{
    version = 3
    
    objects = []
    maps = []
    
    serialize(includeUrlContent)
    {
        const data = {
            version: this.version,
            objects: this.objects.map(x => x.serialize()),
            maps: this.maps.map(x => x.serialize()).filter(x => x)
        }
        
        data.objects = data.objects.filter(x => Data_Lighting_Object.getUsage(data, x.id).length)
        
        if (!includeUrlContent)
        {
            for (const object of data.objects)
            {
                if (object.urlContent)
                {
                    delete object.urlContent
                }
            }
        }
        
        return data
    }
    
    static deserialize(data)
    {
        const result = new Data_Lighting
        result.version = data.version
        result.objects = [ ...data.objects.map(x => eval(x.typeName).deserialize(result, x)) ]
        result.maps = [ ...data.maps.map(x => Data_Lighting_Map.deserialize(result, x)) ]
        return result
    }
    
    getObject(id)
    {
        return this.objects.find(x => x.id == id)
    }
    
    getCurrentMap()
    {
        return this.getMap($gameMap.mapId())
    }
    
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
            map.root = this
            map.id = id
            this.maps.push(map)
        }
        
        return map
    }
    
    getMapObject(id)
    {
        for (const map of this.maps)
        {
            const mapObject = map.objects.find(x => x.id == id)
            
            if (mapObject)
            {
                return mapObject
            }
        }
        
        return null
    }
    
    _generateObjectId()
    {
        return Math.max(0, ...(this.objects.map(x => x.id))) + 1
    }
    
    _generateMapObjectId()
    {
        return Math.max(0, ...(this.maps.map(x => x.objects).flat().map(x => x.id))) + 1
    }
    
    addObject(object)
    {
        object.id = this._generateObjectId()
        object.onCreate?.call(object)
        this.objects.push(object)
        
        return object
    }
    
    copyObject(object)
    {
        const data = object.serialize ? object.serialize() : object
        object = eval(data.typeName).deserialize(this, data)
        object.id = this._generateObjectId()
        object.onCopy?.apply(this)
        this.objects.push(object)
        
        return object
    }
    
    static migrate(data)
    {
        for (;;)
        {
            switch (data.version)
            {
                case 1:
                    const _data = {
                        version: 2,
                        objects: [],
                        maps: []
                    }
                    
                    let objectId = 0
                    let mapObjectId = 0
                    
                    for (const map of data.maps)
                    {
                        const _map = {
                            id: map.id,
                            objects: []
                        }
                        _data.maps.push(_map)
                        
                        for (const light of map.lights ?? [])
                        {
                            light.mapId = map.id
                            
                            if (light.id)
                            {
                                const _object = {
                                    _origin: light,
                                    id: ++objectId
                                }
                                
                                switch (light.type)
                                {
                                    case 1:
                                        _object.typeName = `Data_Lighting_AmbientLight`
                                        _object.color = [ ...light.color ]
                                        _object.weight = light.weight,
                                        _object.exposure = light.exposure,
                                        _object.saturation = light.saturation
                                        _object.power = [ ...light.power ],
                                        _object.strength = light.strength
                                        _data.objects.push(_object)
                                        break
                                    
                                    case 2:
                                        _object.typeName = `Data_Lighting_PointLight`
                                        _object.color = [ ...light.color ]
                                        _object.intensity = light.intensity,
                                        _object.radius = light.radius,
                                        _object.smoothness = light.smoothness,
                                        _object.flickerStrength = light.flickerStrength,
                                        _object.flickerSpeed = light.flickerSpeed,
                                        _data.objects.push(_object)
                                        break
                                    
                                    case 3:
                                        _object.typeName = `Data_Lighting_SpotLight`
                                        _object.color = [ ...light.color ]
                                        _object.intensity = light.intensity,
                                        _object.width = light.width,
                                        _object.spread = light.spread,
                                        _object.spreadFade = light.spreadFade,
                                        _object.direction = light.direction,
                                        _object.distance = light.distance
                                        _object.distanceFadeIn = light.distanceFadeIn
                                        _object.distanceFadeOut = light.distanceFadeOut
                                        _data.objects.push(_object)
                                        break
                                }
                            }
                        }
                        
                        for (const light of map.lights ?? [])
                        {
                            if (light.targetId)
                            {
                                const _map = _data.maps.find(x => x.id == light.mapId)
                                
                                _map.objects.push({
                                    id: ++mapObjectId,
                                    objectId: _data.objects.find(x => x._origin.mapId == light.mapId && x._origin.id == light.targetId).id,
                                    enabled: light.enabled,
                                    x: light.x,
                                    y: light.y,
                                    followEventId: light.followEventId || 0
                                })
                            }
                        }
                        
                        for (const layer of map.layers ?? [])
                        {
                            layer.mapId = map.id
                            
                            if (layer.id)
                            {
                                _data.objects.push({
                                    _origin: layer,
                                    id: ++objectId,
                                    typeName: `Data_Lighting_Layer`,
                                    width: layer.width,
                                    height: layer.height,
                                    url: layer.url,
                                    urlContentHash: layer.urlContentHash,
                                    scale: layer.scale,
                                    filterMode: layer.filterMode,
                                    blendMode: layer.blendMode,
                                    opacity: layer.opacity,
                                    power: layer.power
                                })
                            }
                        }
                    }
                    
                    for (const object of _data.objects)
                    {
                        const _map = _data.maps
                            .find(x => x.id == object._origin.mapId)
                        
                        _map.objects.push({
                            id: ++mapObjectId,
                            objectId: object.id,
                            enabled: object._origin.enabled,
                            x: object._origin.x,
                            y: object._origin.y,
                            followEventId: object._origin.followEventId || 0,
                        })
                    }
                    
                    data = _data
                    break
                
                case 2:
                    data.version = 3
                    for (const map of data.maps)
                    {
                        for (const mapObject of map.objects)
                        {
                            mapObject.referenceEventId = mapObject.followEventId
                        }
                    }
                    break
                
                default:
                    return data
            }
        }
    }
}
