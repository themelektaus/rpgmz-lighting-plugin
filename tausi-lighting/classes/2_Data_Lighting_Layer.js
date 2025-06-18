class Data_Lighting_Layer extends Data_Lighting_Object
{
    width = 0
    height = 0
    url = null
    urlContent = null
    urlContentHash = null
    scale = .25
    filterMode = 0
    blendMode = 0
    shaderOverlay = 0
    opacity = 255
    power = 100
    noise = 0
    noiseScale = 100
    noiseSpeedX = 0
    noiseSpeedY = 0
    
    get icon()
    {
        return `map.svg`
    }
    
    serialize()
    {
        const data = super.serialize()
        data.width = this.width
        data.height = this.height
        data.url = this.url
        data.urlContent = this.urlContent
        data.urlContentHash = this.urlContentHash
        data.scale = this.scale
        data.filterMode = this.filterMode
        data.blendMode = this.blendMode
        data.shaderOverlay = this.shaderOverlay
        data.opacity = this.opacity
        data.power = this.power
        data.noise = this.noise
        data.noiseScale = this.noiseScale
        data.noiseSpeedX = this.noiseSpeedX
        data.noiseSpeedY = this.noiseSpeedY
        return data
    }
    
    static deserialize(root, data)
    {
        const result = new Data_Lighting_Layer
        result.width = data.width
        result.height = data.height
        result.url = data.url
        result.urlContent = data.urlContent
        result.urlContentHash = data.urlContentHash
        result.scale = data.scale
        result.filterMode = data.filterMode
        result.blendMode = data.blendMode
        result.shaderOverlay = data.shaderOverlay ?? 0
        result.opacity = data.opacity
        result.power = data.power
        result.noise = data.noise ?? 0
        result.noiseScale = data.noiseScale ?? 100
        result.noiseSpeedX = data.noiseSpeedX ?? 0
        result.noiseSpeedY = data.noiseSpeedY ?? 0
        const layer = Object.assign(result, Data_Lighting_Object.deserialize(root, data))
        layer.loadUrlContent()
        return layer
    }
    
    getProperties(x)
    {
        return {
            filterMode: x.get(`filterMode`),
            blendMode: x.get(`blendMode`),
            shaderOverlay: x.get(`shaderOverlay`),
            opacity: x.get(`opacity`),
            power: x.get(`power`),
            noise: x.get(`noise`),
            noiseScale: x.get(`noiseScale`),
            noiseSpeedX: x.get(`noiseSpeedX`),
            noiseSpeedY: x.get(`noiseSpeedY`)
        }
    }
    
    tausiLighting_createPropertiesEditor($_properties)
    {
        super.tausiLighting_createPropertiesEditor($_properties)
        
        const _default = new Data_Lighting_Layer
        
        const $_filterMode = this.createField($_properties, _default, `filterMode`, {
            type: `dropdown`,
            items: [
                { value: -1, text: `Pre Shader` },
                { value: 0, text: `Blend` },
                { value: 1, text: `Post Shader` }
            ]
        })
        
        const $_blendMode = this.createField($_properties, _default, `blendMode`, {
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
        
        const $_shaderOverlay = this.createField($_properties, _default, `shaderOverlay`, { type: `slider`, min: -100, max: 100 })
        this.createField($_properties, _default, `opacity`, { type: `slider`, max: 255 })
        const $_power = this.createField($_properties, _default, `power`, { type: `slider`, max: 1000 })
        const $_noise = this.createField($_properties, _default, `noise`, { type: `slider`, max: 100 })
        const $_noiseScale = this.createField($_properties, _default, `noiseScale`, { type: `slider`, min: 10, max: 600 })
        const $_noiseSpeedX = this.createField($_properties, _default, `noiseSpeedX`, { type: `slider`, min: -100, max: 100 })
        const $_noiseSpeedY = this.createField($_properties, _default, `noiseSpeedY`, { type: `slider`, min: -100, max: 100 })
        
        const refreshPropertiesVisibility = () =>
        {
            const filterMode = this.get(`filterMode`)
            $_blendMode.classList.toggle(`hidden`, filterMode != 0)
            $_shaderOverlay.classList.toggle(`hidden`, filterMode == 0)
            $_power.classList.toggle(`hidden`, filterMode == 0)
            $_noise.classList.toggle(`hidden`, filterMode == 0)
            $_noiseScale.classList.toggle(`hidden`, filterMode == 0)
            $_noiseSpeedX.classList.toggle(`hidden`, filterMode == 0)
            $_noiseSpeedY.classList.toggle(`hidden`, filterMode == 0)
        }
        
        $_filterMode.querySelector(`select`).addEventListener(`change`, refreshPropertiesVisibility.bind(this))
        refreshPropertiesVisibility()
    }
    
    onCreate()
    {
        this.width = LightingUtils.getMapWidth()
        this.height = LightingUtils.getMapHeight()
        this.url = `data/tausi-lighting-layers/${$gameMap.mapId()}-${this.id}.png`
        this.setUrlContent(new Bitmap(this.width * this.scale, this.height * this.scale))
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
