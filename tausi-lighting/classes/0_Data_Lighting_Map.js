class Data_Lighting_Map
{
    root = null
    
    id = 0
    objects = []
    events = []
    
    serialize()
    {
        const data = {
            id: this.id,
            objects: this.objects.map(x => x.serialize()).filter(x => x),
            events: this.events.map(x => x.serialize()).filter(x => x)
        }
        
        if (data.objects.length || data.events.length)
        {
            return data
        }
        
        return null
    }
    
    static deserialize(root, data)
    {
        const result = new Data_Lighting_Map
        result.root = root
        result.id = data.id
        result.objects = [ ...(data.objects ?? []).map(x => Data_Lighting_MapObject.deserialize(result, x)) ]
        result.events = [ ...(data.events ?? []).map(x => Data_Lighting_MapEvent.deserialize(result, x)) ]
        return result
    }
    
    createObject(object)
    {
        object = object.id ? object : this.root.addObject(new object)
        object.root = this.root
        
        const mapObject = new Data_Lighting_MapObject
        mapObject.map = this
        mapObject.id = this.root._generateMapObjectId()
        mapObject.objectId = object.id
        
        this.objects.push(mapObject)
        
        return mapObject
    }
    
    getMapObjectsOfType(type)
    {
        return this.objects.filter(x => x.objectId && x.getObject() instanceof type)
    }
    
    hasEvent(eventId)
    {
        return this.events.some(x => x.eventId == eventId)
    }
    
    getEvent(eventId)
    {
        return this.events.find(x => x.eventId == eventId)
            || Data_Lighting_MapEvent.create(this, eventId)
    }
    
    setEventOffset(eventId, x, y)
    {
        let event = this.events.find(x => x.eventId == eventId)
        
        if (!event)
        {
            event = Data_Lighting_MapEvent.create(this, eventId)
            this.events.push(event)
        }
        
        const xDiff = x - event.offsetX
        const yDiff = y - event.offsetY
        
        event.offsetX += xDiff
        event.offsetY += yDiff
        
        const mapObjects = this.objects.filter(x => x.referenceEventId == eventId)
        for (const mapObject of mapObjects)
        {
            mapObject.x += xDiff * $gameMap.tileWidth()
            mapObject.y += yDiff * $gameMap.tileHeight()
        }
    }
}
