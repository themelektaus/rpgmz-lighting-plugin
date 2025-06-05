class Data_Lighting_MapObject
{
    enabled = true
    x = 0
    y = 0
    
    createPropertiesEditor($_properties)
    {
        this.createField($_properties, null, `enabled`, { type: `toggle` })
    }
    
    createField()
    {
        LightingUtils.createField.apply(this, arguments)
    }
}
