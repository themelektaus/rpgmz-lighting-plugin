class Data_Lighting_MapEvent
{
    eventId = 0
    offsetX = 0
    offsetY = 0
    
    static create(eventId)
    {
        const event = new Data_Lighting_MapEvent
        event.eventId = eventId
        return event
    }
    
    serialize()
    {
        return {
            eventId: this.eventId,
            offsetX: this.offsetX,
            offsetY: this.offsetY
        }
    }
    
    static deserialize(data)
    {
        const result = new Data_Lighting_MapEvent
        result.eventId = data.eventId
        result.offsetX = data.offsetX
        result.offsetY = data.offsetY
        return result
    }
}
