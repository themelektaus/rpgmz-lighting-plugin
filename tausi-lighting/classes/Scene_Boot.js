const Scene_Boot__onDatabaseLoaded = Scene_Boot.prototype.onDatabaseLoaded
Scene_Boot.prototype.onDatabaseLoaded = function()
{
    Scene_Boot__onDatabaseLoaded.apply(this, arguments)
    
    $dataLighting = Object.assign(new Data_Lighting, $dataLighting)
    
    for (const i in $dataLighting.maps)
    {
        $dataLighting.maps[i] = Object.assign(new Data_Lighting_Map, $dataLighting.maps[i])
        
        const map = $dataLighting.maps[i]
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
    }
}
