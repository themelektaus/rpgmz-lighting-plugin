class Data_Lighting_MapEvent
{
    map = null
    
    eventId = 0
    offsetX = 0
    offsetY = 0
    
    static create(map, eventId)
    {
        const event = new Data_Lighting_MapEvent
        event.map = map
        event.eventId = eventId
        return event
    }
    
    serialize()
    {
        if (!this.eventId || (!this.offsetX && !this.offsetY))
        {
            return null
        }
        
        if (!$dataMapEvents[this.map.id][this.eventId])
        {
            return null
        }
        
        return {
            eventId: this.eventId,
            offsetX: this.offsetX,
            offsetY: this.offsetY
        }
    }
    
    static deserialize(map, data)
    {
        const result = new Data_Lighting_MapEvent
        result.map = map
        result.eventId = data.eventId
        result.offsetX = data.offsetX
        result.offsetY = data.offsetY
        return result
    }
}
