function Scene_LightingEditor()
{
    this.initialize(...arguments)
}

Scene_LightingEditor.prototype = Object.create(Scene_Base.prototype)
Scene_LightingEditor.prototype.constructor = Scene_LightingEditor

Scene_LightingEditor.prototype.initialize = function()
{
    document.querySelectorAll(`.markdown`).forEach($ =>
    {
        $.innerHTML = (new showdown.Converter()).makeHtml($.innerHTML)
    })
    
    const $_maps = document.querySelector(`#maps`)
    
    for (const $mapInfo of $dataMapInfos)
    {
        const mapId = Number($mapInfo?.id || 0)
        const mapName = String($mapInfo?.name ?? `[Map ID ${mapId}]`)
        
        const $_li = document.createElement(`li`)
        $_li.dataset.id = mapId
        $_li.innerHTML = mapName
        $_li.addEventListener(`click`, () => this.loadMap(mapId))
        $_maps.appendChild($_li)
    }
    
    this._validations = []
    
    document.querySelectorAll(`[data-action]`).forEach($ =>
    {
        this._validations.push(() => $.disabled = !(this[$.dataset.action].call(this, true)))
        $.addEventListener(`click`, () => this[$.dataset.action].call(this, false))
    })
    
    document.querySelectorAll(`[data-icon]`).forEach($ =>
    {
        $.style.backgroundImage = `url(${LightingUtils.getResUrl($.dataset.icon)}.svg)`
    })
    
    Scene_Base.prototype.initialize.call(this)
    
    const pluginParameters = PluginManager.parameters(`TausiLighting`)
    
    this._mapId = -1
    this._loading = false
    this._updateMapInterpreter = eval(pluginParameters[`Update Map Interpreter in Editor`] || `true`)
}

Scene_LightingEditor.prototype.create = function()
{
    Scene_Base.prototype.create.call(this)
    
    if (location.hash == `#help`)
    {
        this.help(false)
    }
    
    this.loadMap(Number((location.hash || `#`).substring(1) || 0) || $dataSystem.editMapId)
}

Scene_LightingEditor.prototype.loadMap = function(mapId)
{
    if (this._mapId == mapId)
    {
        return
    }
    
    document.querySelectorAll(`#maps li`).forEach($ =>
    {
        $.classList.toggle(`active`, $.dataset.id == mapId)
    })
    
    if (this._spriteset)
    {
        this.removeChild(this._spriteset)
        this._spriteset.destroy()
        this._spriteset = null
    }
    
    this._mapId = mapId
    this._loading = true
    
    DataManager.loadMapData(this._mapId)
    
    this.selectLight(null)
}

Scene_LightingEditor.prototype.getMap = function()
{
    return $dataLighting.getMap(this._mapId)
}

Scene_LightingEditor.prototype.update = function()
{
    Scene_Base.prototype.update.call(this)
    
    if (this._loading)
    {
        if (DataManager.isMapLoaded())
        {
            this._loading = false
            
            const $_gameCanvasContainer = document.querySelector(`#gameCanvasContainer`)
            
            const mapInfo = LightingUtils.getMapInfo()
            Graphics.resize(
                Math.min($_gameCanvasContainer.clientWidth - 10, mapInfo.width),
                Math.min($_gameCanvasContainer.clientHeight - 10, mapInfo.height)
            )
            
            $gameMap.setup(this._mapId)
            
            if (this._mapId)
            {
                this._spriteset = new Spriteset_Map()
                this.addChild(this._spriteset)
                this._spriteset.update()
            }
        }
    }
    else
    {
        $gameMap.update(this._updateMapInterpreter)
    }
}

Scene_LightingEditor.prototype.invalidate = function()
{
    for (const validation of this._validations)
    {
        validation()
    }
}

Scene_LightingEditor.prototype.selectLight = function(light, options)
{
    this.selectedLight = light
    
    this.invalidate()
    
    const $_properties = document.querySelector(`#properties`)
    $_properties.innerHTML = ``
    
    if (light)
    {
        if (options?.stick)
        {
            TouchInput._lastLight = light
        }
    }
    else
    {
        TouchInput._lastLight = null
        return
    }
    
    light.createPropertiesEditor($_properties)
}

Scene_LightingEditor.prototype.selectReferenceLight = function(validation)
{
    const targetId = this.selectedLight?.targetId
    
    if (targetId)
    {
        if (!validation)
        {
            this.selectLight(this.getMap().getLightById(targetId))
        }
        
        return true
    }
    
    return false
}

Scene_LightingEditor.prototype.addAmbientLight = function(validation)
{
    return this.addLight(Data_Lighting_AmbientLight.type, validation)
}

Scene_LightingEditor.prototype.addPointLight = function(validation)
{
    return this.addLight(Data_Lighting_PointLight.type, validation)
}

Scene_LightingEditor.prototype.addSpotLight = function(validation)
{
    return this.addLight(Data_Lighting_SpotLight.type, validation)
}

Scene_LightingEditor.prototype.addLight = function(type, validation)
{
    const map = this.getMap()
    if (!map)
    {
        return validation ? false : null
    }
    
    if (validation)
    {
        return type == Data_Lighting_AmbientLight.type
            || type == Data_Lighting_PointLight.type
            || type == Data_Lighting_SpotLight.type
    }
    
    let light
    
    if (type == Data_Lighting_AmbientLight.type)
    {
        light = map.getLightByType(type)
        
        if (light)
        {
            this.selectLight(light)
            return light
        }
    }
    
    light = map.createLight(type)
    
    if (light)
    {
        this.selectLight(light, { stick: true })
        
        LightingUtils.refresh()
    }
    
    return light
}

Scene_LightingEditor.prototype.cloneSelectedLight = function(validation)
{
    if (!this.selectedLight)
    {
        return false
    }
    
    if (this.selectedLight.type == Data_Lighting_AmbientLight.type)
    {
        return false
    }
    
    if (this.selectedLight.targetId)
    {
        return this.duplicateSelectedLight(validation)
    }
    
    if (!validation)
    {
        const reference = this.getMap().createReference(this.selectedLight)
        
        this.selectLight(reference, { stick: true })
        
        LightingUtils.refresh()
    }
    
    return true
}

Scene_LightingEditor.prototype.duplicateSelectedLight = function(validation)
{
    if (!this.selectedLight)
    {
        return false
    }
    
    if (this.selectedLight.type == Data_Lighting_AmbientLight.type)
    {
        return false
    }
    
    if (!validation)
    {
        const light = this.getMap().copyLight(this.selectedLight)
        
        this.selectLight(light, { stick: true })
        
        LightingUtils.refresh()
    }
    
    return true
}

Scene_LightingEditor.prototype.removeSelectedLight = function(validation)
{
    if (!this.selectedLight)
    {
        return false
    }
    
    if (validation)
    {
        return true
    }
    
    const map = this.getMap()
    
    if (this.selectedLight.id)
    {
        map.lights = map.lights.filter(x => !(x.id == this.selectedLight.id || x.targetId == this.selectedLight.id))
    }
    else
    {
        map.lights = map.lights.filter(x => x != this.selectedLight)
    }
    
    this.selectLight(null)
    
    LightingUtils.refresh()
}

Scene_LightingEditor.prototype.save = function(validation)
{
    if (!$dataLighting)
    {
        return false
    }
    
    const fs = require(`fs`)
    
    const a = fs.readFileSync(`data/Lighting.json`, `utf8`)
    const b = JSON.stringify($dataLighting)
    
    if (LightingUtils.hashCode(a) == LightingUtils.hashCode(b))
    {
        return false
    }
    
    if (!validation)
    {
        this._writeToDataFile(`Lighting.json`, $dataLighting)
        this.invalidate()
    }
    
    return true
}

Scene_LightingEditor.prototype._writeToDataFile = function(name, data)
{
    const fs = require(`fs`)
    const json = JSON.stringify(data)
    fs.writeFileSync(this._getDataFilePath(name), json)
}

Scene_LightingEditor.prototype._getDataFilePath = function(name)
{
    const path = require(`path`)
    const base = path.dirname(process.mainModule.filename)
    return path.join(base, `data`, name)
}

Scene_LightingEditor.prototype.saveAndClose = function(validation)
{
    if (!this.save(validation))
    {
        return false
    }
    
    if (!validation)
    {
        if (!this.closeEditor(validation))
        {
            return false
        }
    }
    
    return true
}

Scene_LightingEditor.prototype.closeEditor = function(validation)
{
    if (!validation)
    {
        SceneManager.reloadGame()
    }
    
    return true
}

Scene_LightingEditor.prototype.hideOverlay = function(validation)
{
    if (!validation)
    {
        LightingUtils.hideOverlay()
    }
    
    return true
}

Scene_LightingEditor.prototype.help = function(validation)
{
    if (!validation)
    {
        LightingUtils.showOverlay(`help-window`)
    }
    
    return true
}
