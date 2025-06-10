class Data_Lighting_Map
{
    root = null
    
    id = 0
    objects = []
    events = []
    
    serialize()
    {
        return {
            id: this.id,
            objects: this.objects.map(x => x.serialize()),
            events: this.events.map(x => JSON.parse(JSON.stringify(x)))
        }
    }
    
    static deserialize(root, data)
    {
        const result = new Data_Lighting_Map
        result.root = root
        result.id = data.id
        result.objects = [ ...(data.objects ?? []).map(x => Data_Lighting_MapObject.deserialize(result, x)) ]
        result.events = [ ...(data.events ?? []).map(x => JSON.parse(JSON.stringify(x))) ]
        return result
    }
    
    createObject(object)
    {
        object = object.id ? object : this.root.createObject(object)
        object.root = this.root
        
        const mapObject = new Data_Lighting_MapObject
        mapObject.map = this
        mapObject.id = this.root.generateMapObjectId()
        mapObject.objectId = object.id
        
        this.objects.push(mapObject)
        
        return mapObject
    }
    
    getMapObjectsOfType(type)
    {
        return this.objects.filter(x => x.object instanceof type)
    }
    
    hasEventOffset(id)
    {
        return this.events.some(x => x.id == id)
    }
    
    getEventOffset(id)
    {
        const event = this.events.find(x => x.id == id)
        return event
            ? { x: event.offsetX, y: event.offsetY }
            : { x: 0, y: 0 }
    }
    
    setEventOffset(id, x, y)
    {
        let event = this.events.find(x => x.id == id)
        
        if (!event)
        {
            event = { id: id }
            this.events.push(event)
        }
        
        event.offsetX = x
        event.offsetY = y
    }
    
    removeEventOffset(id)
    {
        const index = this.events.findIndex(x => x.id == id)
        if (index > -1)
        {
            this.events.splice(index, 1)
        }
    }
}
