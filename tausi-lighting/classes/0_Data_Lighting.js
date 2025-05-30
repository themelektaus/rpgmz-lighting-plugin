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
}
