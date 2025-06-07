function Scene_LightingEditor()
{
    this.initialize(...arguments)
}

Scene_LightingEditor.prototype = Object.create(Scene_Base.prototype)
Scene_LightingEditor.prototype.constructor = Scene_LightingEditor

Scene_LightingEditor.prototype.initialize = function()
{
    LightingUtils.preloadBitmaps().then(() =>
    {
        document.querySelectorAll(`[data-icon]`).forEach($ =>
        {
            $.style.backgroundImage = `url(${LightingUtils.getResUrl($.dataset.icon)}.svg?css)`
        })
    })
    
    document.querySelector(`#help-window .content`)
        .innerHTML = (new showdown.Converter()).makeHtml(
            atob(TAUSI_LIGHTING_README)
        )
    
    const settings = LightingUtils.toolSettings
    const $_toolsSettings = document.querySelector(`#tools-settings`)
    const _default = JSON.parse(JSON.stringify(settings))
    
    LightingUtils.createField.call(settings, $_toolsSettings, _default, `color`, { type: `color` })
    LightingUtils.createField.call(settings, $_toolsSettings, _default, `radius`, { type: `slider`, min: 5, max: 200 })
    LightingUtils.createField.call(settings, $_toolsSettings, _default, `smoothness`, { type: `slider` })
    
    const $_maps = document.querySelector(`#maps`)
    
    const mapInfos = [...$dataMapInfos]
    mapInfos.sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
    
    for (const $mapInfo of mapInfos)
    {
        const mapId = Number($mapInfo?.id || 0)
        const mapName = String($mapInfo?.name ?? `<span style="color:#999">Empty</span>`)
        
        const $_li = document.createElement(`li`)
        $_li.dataset.id = mapId
        $_li.innerHTML = mapName
        $_li.addEventListener(`click`, () =>
        {
            if (this._mapId == mapId)
            {
                return
            }
            
            const $_gameCanvasContainer = document.querySelector(`#gameCanvasContainer`)
            if (!$_gameCanvasContainer.classList.contains(`loading`))
            {
                $_gameCanvasContainer.classList.add(`loading`)
                setTimeout(() => this.loadMap(mapId, { loadingPower: 3 }), 155)
            }
        })
        $_maps.appendChild($_li)
    }
    
    this._validations = []
    
    document.querySelectorAll(`[data-action]`).forEach($ =>
    {
        this._validations.push(() => $.disabled = !(this[$.dataset.action].call(this, true)))
        $.addEventListener(`click`, () => this[$.dataset.action].call(this, false))
    })
    
    Scene_Base.prototype.initialize.call(this)
    
    const pluginParameters = PluginManager.parameters(`TausiLighting`)
    
    this._mapId = -1
    this._loading = 0
    this._updateMapInterpreter = eval(pluginParameters[`Update Map Interpreter in Editor`] || `true`)
    
    addEventListener(`keypress`, e =>
    {
        if (e.ctrlKey && e.code == `KeyS`)
        {
            this.save()
            return
        }
        
        if (e.ctrlKey && e.code == `KeyY`)
        {
            this.redo()
            return
        }
        
        if (e.ctrlKey && e.code == `KeyZ`)
        {
            this.undo()
            return
        }
    })
}

Scene_LightingEditor.prototype.create = function()
{
    Scene_Base.prototype.create.call(this)
    
    if (location.hash == `#help`)
    {
        this.help(false)
    }
    
    const mapId = Number((location.hash || `#`).substring(1) || 0) || $dataSystem.editMapId
    this.loadMap(mapId, { loadingPower: 5 })
}

Scene_LightingEditor.prototype.loadMap = function(mapId, options)
{
    if (!(options?.force ?? false))
    {
        if (this._mapId == mapId)
        {
            return
        }
        
        if (this._loading)
        {
            return
        }
        
        this._loading = options?.loadingPower || 1
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
    
    this.setSelectedMapObject(null)

    this._mapId = mapId
    
    DataManager.loadMapData(this._mapId)
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
            this._loading--
            
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
            
            if (this._loading)
            {
                this.loadMap(this._mapId, { force: true })
            }
            else
            {
                setTimeout(() => $_gameCanvasContainer.classList.remove(`loading`), 195)
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

Scene_LightingEditor.prototype.setSelectedMapObject = function(mapObject, options)
{
    this.selectedMapObject = mapObject
    this.setActiveTool(`select`)
    
    this.invalidate()
    
    const $_properties = document.querySelector(`#properties`)
    $_properties.innerHTML = ``
    
    if (mapObject)
    {
        if (options?.stick)
        {
            TouchInput._lastMapObject = mapObject
            TouchInput._lastMapObjectMoved = false
        }
    }
    else
    {
        TouchInput._lastMapObject = null
        TouchInput._lastMapObjectMoved = false
        return
    }
    
    mapObject.createPropertiesEditor($_properties)
}

Scene_LightingEditor.prototype.setActiveTool = function(tool)
{
    this.activeTool = tool
    
    const $_tools = document.querySelector(`#tools`)
    
    $_tools.querySelectorAll(`[data-action]`).forEach($ => $.classList.remove(`active`))
    $_tools.querySelector(`[data-action="setTool_${tool}"]`).classList.add(`active`)
}

Scene_LightingEditor.prototype.selectReferenceLight = function(validation)
{
    const targetId = this.selectedMapObject?.targetId
    
    if (targetId)
    {
        if (!validation)
        {
            this.setSelectedMapObject(this.getMap().getLightById(targetId))
        }
        
        return true
    }
    
    return false
}

Scene_LightingEditor.prototype.add = function(validation)
{
    const map = this.getMap()
    if (!map)
    {
        return validation ? false : null
    }
    
    if (!validation)
    {
        requestAnimationFrame(() =>
        {
            const $_addMenu = document.querySelector(`#addMenu`)
            
            const $_button = document.querySelector(`#toolbar button[data-action="add"]`)
            const rect = $_button.getBoundingClientRect()
            
            $_addMenu.style.top = `calc(${rect.bottom}px + .5em)`
            $_addMenu.style.left = `${rect.left}px`
            $_addMenu.classList.add(`visible`)
            
            requestAnimationFrame(() =>
            {
                addEventListener(`click`, () =>
                {
                    $_addMenu.classList.remove(`visible`), { once: true }
                })
            })
        })
    }
    
    return true
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
            this.setSelectedMapObject(light)
            return light
        }
    }
    
    LightingUtils.dump()
    
    light = map.createLight(type)
    
    if (light)
    {
        this.setSelectedMapObject(light, { stick: true })
        TouchInput._lastMapObjectMoved = true
        
        LightingUtils.refresh()
    }
    
    return light
}

Scene_LightingEditor.prototype.addLayer = function(validation)
{
    const map = this.getMap()
    if (!map)
    {
        return validation ? false : null
    }
    
    if (validation)
    {
        return true
    }
    
    LightingUtils.dump()
    
    const layer = map.createLayer()
    
    this.setSelectedMapObject(layer, { stick: true })
    TouchInput._lastMapObjectMoved = true
    
    LightingUtils.refresh()
    
    return layer
}

Scene_LightingEditor.prototype.cloneSelectedLight = function(validation)
{
    if (!this.selectedMapObject)
    {
        return false
    }
    
    if (this.selectedMapObject instanceof Data_Lighting_Layer)
    {
        return false
    }
    
    if (this.selectedMapObject.type == Data_Lighting_AmbientLight.type)
    {
        return false
    }
    
    if (this.selectedMapObject.targetId)
    {
        return this.duplicateSelectedLight(validation)
    }
    
    if (!validation)
    {
        const reference = this.getMap().createReference(this.selectedMapObject)
        
        this.setSelectedMapObject(reference, { stick: true })
        
        LightingUtils.refresh()
    }
    
    return true
}

Scene_LightingEditor.prototype.duplicateSelectedLight = function(validation)
{
    if (!this.selectedMapObject)
    {
        return false
    }
    
    if (this.selectedMapObject instanceof Data_Lighting_Layer)
    {
        return false
    }
    
    if (this.selectedMapObject.type == Data_Lighting_AmbientLight.type)
    {
        return false
    }
    
    if (!validation)
    {
        const light = this.getMap().copyLight(this.selectedMapObject)
        
        this.setSelectedMapObject(light, { stick: true })
        
        LightingUtils.refresh()
    }
    
    return true
}

Scene_LightingEditor.prototype.removeSelectedLight = function(validation)
{
    if (!this.selectedMapObject)
    {
        return false
    }
    
    if (validation)
    {
        return true
    }
    
    LightingUtils.dump()
    
    const map = this.getMap()
    
    if (this.selectedMapObject instanceof Data_Lighting_Layer)
    {
        map.layers = map.layers.filter(x => x != this.selectedMapObject)
    }
    else
    {
        if (this.selectedMapObject.id)
        {
            map.lights = map.lights.filter(x => !(x.id == this.selectedMapObject.id || x.targetId == this.selectedMapObject.id))
        }
        else
        {
            map.lights = map.lights.filter(x => x != this.selectedMapObject)
        }
    }
    
    this.setSelectedMapObject(null)
    
    LightingUtils.refresh()
}

Scene_LightingEditor.prototype.undo = function(validation)
{
    if (!$dataLighting)
    {
        return false
    }
    
    if (!LightingUtils.undo(validation))
    {
        return false
    }
    
    if (!validation)
    {
        this.reselectMapObject(this.activeTool)
        this.invalidate()
    }
    
    return true
}

Scene_LightingEditor.prototype.redo = function(validation)
{
    if (!$dataLighting)
    {
        return false
    }
    
    if (!LightingUtils.redo(validation))
    {
        return false
    }
    
    if (!validation)
    {
        this.reselectMapObject(this.activeTool)
        this.invalidate()
    }
    
    return true
}

Scene_LightingEditor.prototype.reselectMapObject = function(tool)
{
    if (!this.selectedMapObject)
    {
        return
    }
    
    if (this.selectedMapObject instanceof Data_Lighting_Reference)
    {
        const light = this.getMap().lights.find(x => x.targetId == this.selectedMapObject.targetId)
        if (light)
        {
            this.setSelectedMapObject(light)
        }
        else
        {
            this.setSelectedMapObject(null)
        }
        return
    }
    
    if (this.selectedMapObject instanceof Data_Lighting_Light)
    {
        const light = this.getMap().lights.find(x => x.id == this.selectedMapObject.id)
        if (light)
        {
            this.setSelectedMapObject(light)
        }
        else
        {
            this.setSelectedMapObject(null)
        }
        return
    }
    
    if (this.selectedMapObject instanceof Data_Lighting_Layer)
    {
        const layer = this.getMap().layers.find(x => x.id == this.selectedMapObject.id)
        if (layer)
        {
            this.setSelectedMapObject(layer)
            this.setActiveTool(tool)
        }
        else
        {
            this.setSelectedMapObject(null)
        }
        return
    }
}

Scene_LightingEditor.prototype.save = function(validation)
{
    if (!$dataLighting)
    {
        return false
    }
    
    const data = JSON.parse(JSON.stringify($dataLighting))
    for (const map of data.maps)
    {
        for (const layer of map.layers)
        {
            delete layer.urlContent
        }
    }
    
    const fs = require(`fs`)
    
    const a = fs.readFileSync(`data/Lighting.json`, `utf8`)
    const b = JSON.stringify(data)
    
    if (LightingUtils.hashCode(a) == LightingUtils.hashCode(b))
    {
        return false
    }
    
    if (!validation)
    {
        this._writeToDataFile(`Lighting.json`, data)
        
        for (const map of $dataLighting.maps)
        {
            for (const layer of map.layers)
            {
                Data_Lighting_Layer.saveUrlContent(layer.url, layer.urlContent)
            }
        }
        
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

Scene_LightingEditor.prototype.setTool_select = function(validation)
{
    if (!validation)
    {
        this.setActiveTool(`select`)
    }
    
    return true
}

Scene_LightingEditor.prototype.setTool_paint = function(validation)
{
    if (this.selectedMapObject instanceof Data_Lighting_Layer)
    {
        if (!validation)
        {
            this.setActiveTool(`paint`)
        }
        
        return true
    }
    
    return false
}

Scene_LightingEditor.prototype.setTool_erase = function(validation)
{
    if (this.selectedMapObject instanceof Data_Lighting_Layer)
    {
        if (!validation)
        {
            this.setActiveTool(`erase`)
        }
        
        return true
    }
    
    return false
}
