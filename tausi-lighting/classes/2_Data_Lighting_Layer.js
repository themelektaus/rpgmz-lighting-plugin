class Data_Lighting_Layer extends Data_Lighting_Instance
{
    width = 0
    height = 0
    url = null
    urlContent = null
    urlContentHash = null
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
        this.setUrlContent(new Bitmap(width * this.scale, height * this.scale))
    }
    
    setUrlContent(bitmap)
    {
        this.urlContent = bitmap.canvas.toDataURL(`png`).substring(22)
        this.urlContentHash = LightingUtils.hashCode(this.urlContent)
    }
    
    loadUrlContent()
    {
        if (this.urlContent)
        {
            return
        }
        
        try
        {
            const fs = require(`fs`)
            this.urlContent = fs.readFileSync(this.url).toString(`base64`)
            this.urlContentHash = LightingUtils.hashCode(this.urlContent)
            return true
        }
        catch
        {
            this.urlContent = null
            this.urlContentHash = null
            return false
        }
    }
    
    static saveUrlContent(url, urlContent)
    {
        if (!urlContent)
        {
            return false
        }
        
        const fs = require(`fs`)
        const path = require(`path`)
        
        fs.mkdirSync(path.dirname(url), { recursive: true })
        fs.writeFileSync(url, urlContent, `base64`)
        
        return true
    }
}
