class Data_Lighting_Layer extends Data_Lighting_Instance
{
    width = 0
    height = 0
    url = null
    scale = .25
    
    filterMode = 0
    blendMode = 0
    opacity = 255
    power = 100
    
    createPropertiesEditor($_properties)
    {
        super.createPropertiesEditor($_properties)
        
        const _default = new Data_Lighting_Layer
        
        this.createField($_properties, _default, `filterMode`, {
            type: `dropdown`,
            items: [
                { value: -1, text: `Pre Overlay` },
                { value: 0, text: `Default Blend` },
                { value: 1, text: `Post Overlay` }
            ]
        })
        
        this.createField($_properties, _default, `blendMode`, {
            type: `dropdown`,
            items: [
                { value: 0, text: `Normal` },
                { value: 1, text: `Add` },
                { value: 2, text: `Multiply` },
                { value: 3, text: `Screen` },
                //{ value: 4, text: `Overlay` },
                //{ value: 5, text: `Darken` },
                //{ value: 6, text: `Lighten` },
                //{ value: 7, text: `Color Dodge` },
                //{ value: 8, text: `Color Burn` },
                //{ value: 9, text: `Hard Light` },
                //{ value: 10, text: `Soft Light` },
                //{ value: 11, text: `Difference` },
                //{ value: 12, text: `Exclusion` },
                //{ value: 13, text: `Hue` },
                //{ value: 14, text: `Saturation` },
                //{ value: 15, text: `Color` },
                //{ value: 16, text: `Luminosity` },
                //{ value: 17, text: `Normal (NPM)` },
                //{ value: 18, text: `Add (NPM)` },
                //{ value: 19, text: `Screen (NPM)` },
                //{ value: 20, text: `None` },
                //{ value: 21, text: `Source In` },
                //{ value: 22, text: `Source Out` },
                //{ value: 23, text: `Source Atop` },
                //{ value: 24, text: `Destination Over` },
                //{ value: 25, text: `Destination In` },
                //{ value: 26, text: `Erase` },
                //{ value: 27, text: `Destination Atop` },
                { value: 28, text: `Substract` },
                { value: 29, text: `Xor` }
            ]
        })
        
        this.createField($_properties, _default, `opacity`, { type: `slider`, max: 255 })
        this.createField($_properties, _default, `power`, { type: `slider`, max: 1000 })
    }
    
    init(width, height)
    {
        this.width = width
        this.height = height
        this.url = `data/tausi-lighting-layers/${$gameMap.mapId()}-${this.id}.png`
        this.write(new Bitmap(width * this.scale, height * this.scale))
    }
    
    write(bitmap)
    {
        const data = bitmap.canvas.toDataURL(`png`).substring(22)
        
        const fs = require(`fs`)
        const path = require(`path`)
        
        fs.mkdirSync(path.dirname(this.url), { recursive: true })
        fs.writeFileSync(this.url, data, `base64`)
    }
}
