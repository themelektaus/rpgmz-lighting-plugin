class Data_Lighting_Light extends Data_Lighting_Object
{
    color = [ 0, 0, 0, 0 ]
    
    serialize()
    {
        const data = super.serialize()
        data.color = [ ...this.color ]
        return data
    }
    
    static deserialize(root, data)
    {
        const result = new Data_Lighting_Light
        result.color = [ ...data.color ]
        return Object.assign(result, Data_Lighting_Object.deserialize(root, data))
    }
}
