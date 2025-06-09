class Data_Lighting_Map
{
    root = null
    
    id = 0
    objects = []
    
    serialize()
    {
        return {
            id: this.id,
            objects: this.objects.map(x => x.serialize())
        }
    }
    
    static deserialize(root, data)
    {
        const result = new Data_Lighting_Map
        result.root = root
        result.id = data.id
        result.objects = [ ...data.objects.map(x => Data_Lighting_MapObject.deserialize(result, x)) ]
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
}
