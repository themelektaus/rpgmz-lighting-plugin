class Data_Lighting_Light extends Data_Lighting_Object
{
    color = [ 0, 0, 0, 0 ]
    
    get icon()
    {
        return `light.svg`
    }
    
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
    
    getProperties(x)
    {
        return {
            color: [
                x.get(`color[0]`),
                x.get(`color[1]`),
                x.get(`color[2]`),
                x.get(`color[3]`)
            ]
        }
    }
}
