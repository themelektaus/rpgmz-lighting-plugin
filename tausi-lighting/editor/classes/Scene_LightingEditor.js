function Scene_LightingEditor()
{
    this.initialize(...arguments)
}

Scene_LightingEditor.prototype = Object.create(Scene_Base.prototype)
Scene_LightingEditor.prototype.constructor = Scene_LightingEditor

Scene_LightingEditor.prototype.initialize = function()
{
    LightingUtils.dump()
    
    LightingUtils.preloadBitmaps().then(() =>
    {
        document.querySelectorAll(`[data-icon]`).forEach($_ =>
        {
            $_.style.backgroundImage = `url(${LightingUtils.getResUrl($_.dataset.icon)}.svg?css)`
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
    
    let nullInList = false
    
    for (const mapInfo of mapInfos)
    {
        if (!mapInfo)
        {
            if (nullInList)
            {
                continue
            }
            else
            {
                nullInList = true
            }
        }
        
        const mapId = Number(mapInfo?.id || 0)
        const mapName = String(mapInfo?.name ?? `<span style="color:#999">Empty</span>`)
        
        const $_li = document.createElement(`li`)
        $_li.dataset.id = mapId
        $_li.innerHTML = mapName
        $_li.addEventListener(`click`, () =>
        {
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
    
    document.querySelectorAll(`[data-action]`).forEach($_ =>
    {
        this._validations.push(() => $_.disabled = !(this[$_.dataset.action].call(this, true)))
        $_.addEventListener(`click`, () => this[$_.dataset.action].call(this, false))
    })
    
    const $_addMenu = document.querySelector(`#addMenu`)
        
    let $_title = null
    
    const fs = require(`fs`)
    fs.readdirSync(`tausi-lighting/editor/presets`).forEach((file, _) =>
    {
        if (file.endsWith(`.json`) && file != `Event.json`)
        {
            if (!$_title)
            {
                $_title = document.createElement(`div`)
                $_title.classList.add(`title`)
                $_title.innerHTML = `Presets / Examples`
                $_addMenu.appendChild($_title)
            }
            
            const presetName = file.substring(0, file.length - 5)
            const preset = LightingUtils.loadPreset(presetName)
            
            const $_button = document.createElement(`button`)
            $_button.classList.add(`positive`)
            $_button.innerHTML = preset.name
            $_button.dataset.icon = preset.icon
            $_button.addEventListener(`click`, () => this._addPreset(presetName))
            $_addMenu.appendChild($_button)
        }
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
            //return
        }
        
        if (this._loading)
        {
            return
        }
        
        this._loading = options?.loadingPower || 1
    }
    
    document.querySelectorAll(`#maps li`).forEach($_ =>
    {
        $_.classList.toggle(`active`, $_.dataset.id == mapId)
    })
    
    if (this._spriteset)
    {
        this.removeChild(this._spriteset)
        this._spriteset.destroy()
        this._spriteset = null
    }
    
    this.setSelection(null)

    this._mapId = mapId
    
    DataManager.loadMapData(this._mapId)
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
            
            Graphics.resize(
                Math.min($_gameCanvasContainer.clientWidth - 10, LightingUtils.getMapWidth()),
                Math.min($_gameCanvasContainer.clientHeight - 10, LightingUtils.getMapHeight())
            )
            
            LightingUtils.patchEvents()
            
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
                Graphics.hideGameCanvasScreenshot()
                
                if (this.onMapLoaded)
                {
                    this.onMapLoaded()
                    this.onMapLoaded = null
                }
                
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

Scene_LightingEditor.prototype.setSelection = function(selection, options)
{
    this.selection = selection
    this.setActiveTool(`select`)
    
    this.invalidate()
    
    const $_properties = LightingUtils.clearPropertiesEditor()
    
    if (selection)
    {
        if (options?.stick)
        {
            TouchInput.tausiLighting_lastSelection = selection
        }
    }
    else
    {
        TouchInput.tausiLighting_lastSelection = null
        return
    }
    
    if (selection.tausiLighting_createPropertiesEditor)
    {
        selection.tausiLighting_createPropertiesEditor($_properties)
    }
}

Scene_LightingEditor.prototype.setActiveTool = function(tool, data)
{
    this.activeTool = tool
    this.activeToolData = data
    
    const $_tools = document.querySelector(`#tools`)
    
    $_tools.querySelectorAll(`[data-action]`).forEach($_ => $_.classList.remove(`active`))
    $_tools.querySelectorAll(`[data-action="setTool_${tool}"]`).forEach($_ => $_.classList.add(`active`))
}

Scene_LightingEditor.prototype.add = function(validation)
{
    const map = $dataLighting.getMap(this._mapId)
    if (!map)
    {
        return validation ? false : null
    }
    
    if (!validation)
    {
        requestAnimationFrame(() =>
        {
            const $_button = document.querySelector(`#toolbar button[data-action="add"]`)
            const rect = $_button.getBoundingClientRect()
            
            const $_addMenu = document.querySelector(`#addMenu`)
            
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
    return this._add(Data_Lighting_AmbientLight, validation)
}

Scene_LightingEditor.prototype.addPointLight = function(validation)
{
    return this._add(Data_Lighting_PointLight, validation)
}

Scene_LightingEditor.prototype.addSpotLight = function(validation)
{
    return this._add(Data_Lighting_SpotLight, validation)
}

Scene_LightingEditor.prototype.addLayer = function(validation)
{
    return this._add(Data_Lighting_Layer, validation)
}

Scene_LightingEditor.prototype._add = function(type, validation)
{
    const map = $dataLighting.getMap(this._mapId)
    if (!map)
    {
        return validation ? false : null
    }
    
    if (validation)
    {
        return true
    }
    
    const mapObject = map.createObject(type)
    
    this.setSelection(mapObject, { stick: true })
    TouchInput._moved = true
    
    LightingUtils.refresh()
    
    return mapObject
}

Scene_LightingEditor.prototype._addPreset = function(name)
{
    const preset = LightingUtils.loadPreset(name)
    delete preset.icon
    
    const mapData = this._loadMapData(this._mapId)
    
    preset.id = Math.max(...mapData.events.map(x => x?.id ?? 0)) + 1
    preset.x = 1
    preset.y = 1
    
    const additionalLights = preset.lights ?? []
    delete preset.lights
    
    const eventId = preset.id
    mapData.events[eventId] = preset
    
    this._saveMapData(this._mapId, mapData)
    
    Graphics.showGameCanvasScreenshot()
    
    this.onMapLoaded = () =>
    {
        for (const additionalLight of additionalLights)
        {
            const offsetX = additionalLight.offsetX ?? 0
            const offsetY = additionalLight.offsetY ?? 0
            
            delete additionalLight.offsetX
            delete additionalLight.offsetY
            
            const object = $dataLighting.copyObject(additionalLight)
            
            const mapObject = $dataLighting.getMap(this._mapId).createObject(object)
            mapObject.x = $gameMap.tileWidth() * (1.5 + offsetX)
            mapObject.y = $gameMap.tileHeight() * (1.5 + offsetY)
            mapObject.referenceEventId = eventId
        }
        
        this.setSelection($gameMap.event(eventId), { stick: true })
        TouchInput._moved = true
        
        LightingUtils.refresh()
    }
    
    this.loadMap(this._mapId, { loadingPower: 3 })
}

Scene_LightingEditor.prototype.cloneSelectedLight = function(validation)
{
    if (!this.selection)
    {
        return false
    }
    
    if (this.selection instanceof Data_Lighting_MapObject)
    {
        const selectedObject = this.selection.getObject()
        
        if (!selectedObject)
        {
            return false
        }
        
        if (selectedObject instanceof Data_Lighting_AmbientLight)
        {
            return false
        }
        
        if (selectedObject instanceof Data_Lighting_Layer)
        {
            return false
        }
        
        if (!validation)
        {
            const map = $dataLighting.getMap(this._mapId)
            const mapObject = map.createObject(selectedObject)
            
            this.setSelection(mapObject, { stick: true })
            TouchInput._moved = true
            
            LightingUtils.refresh()
        }
        
        return true
    }
    
    if (this.selection instanceof Game_Event)
    {
        if (LightingUtils.isPatched(this.selection._eventId))
        {
            return false
        }
        
        if (!validation)
        {
            const mapData = this._loadMapData(this._mapId)
            
            const event = LightingUtils.loadPreset(`Event`, x => x
                .replaceAll(`<sourceMapId>`, `0`)
                .replaceAll(`<sourceEventId>`, this.selection._eventId.toString())
            )
            
            const sourceEvent = this.selection.event()
            
            const eventId = Math.max(...mapData.events.map(x => x?.id ?? 0)) + 1
            
            event.id = eventId
            event.name = "Clone of " + sourceEvent.name
            event.x = 0
            event.y = 0
            event.pages[0].image = sourceEvent.pages[0].image
            
            mapData.events[eventId] = event
            
            this._saveMapData(this._mapId, mapData)
            
            Graphics.showGameCanvasScreenshot()
            
            this.onMapLoaded = () =>
            {
                this.setSelection($gameMap.event(eventId), { stick: true })
                TouchInput._moved = true
            }
            
            this.loadMap(this._mapId, { loadingPower: 3 })
        }
        
        return true
    }
    
    return false
}

Scene_LightingEditor.prototype.duplicateSelectedLight = function(validation)
{
    if (!this.selection)
    {
        return false
    }
    
    if (!(this.selection instanceof Data_Lighting_MapObject))
    {
        return false
    }
    
    const selectedObject = this.selection.getObject()
    
    if (!selectedObject)
    {
        return false
    }
    
    if (selectedObject instanceof Data_Lighting_Layer)
    {
        return false
    }
    
    if (!validation)
    {
        const map = $dataLighting.getMap(this._mapId)
        const mapObject = map.createObject(map.root.copyObject(selectedObject))
        
        this.setSelection(mapObject, { stick: true })
        TouchInput._moved = true
        
        LightingUtils.refresh()
    }
    
    return true
}

Scene_LightingEditor.prototype.removeSelectedLight = function(validation)
{
    if (!this.selection)
    {
        return false
    }
    
    if (this.selection instanceof Data_Lighting_MapObject)
    {
        if (!validation)
        {
            const map = $dataLighting.getMap(this._mapId)
            if (map)
            {
                map.objects = map.objects.filter(x => x != this.selection)
                
                LightingUtils.dump()
                
                this.setSelection(null)
                
                LightingUtils.refresh()
            }
        }
        
        return true
    }
    
    if (this.selection instanceof Game_Event)
    {
        if (!validation)
        {
            const mapData = this._loadMapData(this._mapId)
            
            const eventId = this.selection._eventId
            
            mapData.events[eventId] = null
            
            this._saveMapData(this._mapId, mapData)
            
            const map = $dataLighting.getMap(this._mapId)
            if (map)
            {
                map.events = map.events.filter(x => x.eventId != eventId)
            }
            
            Graphics.showGameCanvasScreenshot()
            
            this.loadMap(this._mapId, { loadingPower: 3 })
        }
        
        return true
    }
    
    return false
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
    if (!this.selection)
    {
        return
    }
    
    if (!this.selection.objectId)
    {
        return
    }
    
    const map = $dataLighting.getMap(this._mapId)
    const mapObject = map.objects.find(x => x.objectId == this.selection.objectId)
    
    this.setSelection(mapObject)
    
    if (mapObject && mapObject instanceof Data_Lighting_MapObject && mapObject.getObject() instanceof Data_Lighting_Layer)
    {
        this.setActiveTool(tool)
    }
}

Scene_LightingEditor.prototype.isDirty = function(data, debug)
{
    const fs = require(`fs`)
    const a = fs.readFileSync(`data/Lighting.json`, `utf8`)
    const b = JSON.stringify(data)
    
    if (LightingUtils.hashCode(a) == LightingUtils.hashCode(b))
    {
        return false
    }
    
    return true
}

Scene_LightingEditor.prototype.save = function(validation)
{
    if (!$dataLighting)
    {
        return false
    }
    
    let data = $dataLighting.serialize()
    
    if (!this.isDirty(data))
    {
        return false
    }
    
    if (!validation)
    {
        const fs = require(`fs`)
        
        let dirty = false
        
        for (const map of $dataLighting.maps)
        {
            const mapData = this._loadMapData(map.id)
            if (!mapData)
            {
                continue
            }
            
            let mapDirty = false
            
            for (const event of map.events)
            {
                const mapDataEvent = mapData.events[event.eventId]
                
                if (!mapDataEvent)
                {
                    continue
                }
                
                let eventDirty = false
                
                const offset = (x, y) =>
                {
                    event.offsetX += x
                    event.offsetY += y
                    
                    for (const item of LightingUtils.history)
                    {
                        const historyEvent = item.maps?.find(x => x.id == map.id)?.events?.find(x => x.eventId == event.eventId)
                        
                        if (historyEvent)
                        {
                            historyEvent.offsetX += x
                            historyEvent.offsetY += y
                        }
                    }
                    
                    mapDataEvent.x -= x
                    mapDataEvent.y -= y
                    
                    eventDirty = true
                }
                
                if (Math.abs(event.offsetX) > .5 || Math.abs(event.offsetY) > .5)
                {
                    while (event.offsetX < .5)
                    {
                        offset(1, 0)
                    }
                    
                    while (event.offsetX > .5)
                    {
                        offset(-1, 0)
                    }
                    
                    while (event.offsetY < .5)
                    {
                        offset(0, 1)
                    }
                    
                    while (event.offsetY > .5)
                    {
                        offset(0, -1)
                    }
                    
                    mapDirty = true
                    
                    if ($gameMap._mapId == map.id)
                    {
                        const gameMapEvent = $gameMap.event(event.eventId)
                        gameMapEvent.setPosition(mapDataEvent.x, mapDataEvent.y)
                        gameMapEvent._tausiLighting_originalRealX = gameMapEvent._realX
                        gameMapEvent._tausiLighting_originalRealY = gameMapEvent._realY
                    }
                }
            }
            
            if (mapDirty)
            {
                this._saveMapData(map.id, mapData)
                
                dirty = true
            }
        }
        
        if (dirty)
        {
            this.setSelection(null)
            
            LightingUtils.dump()
            
            data = $dataLighting.serialize()
        }
        
        this._writeToDataFile(`Lighting.json`, data)
        
        for (const map of $dataLighting.maps)
        {
            for (const mapObject of map.objects)
            {
                if (mapObject instanceof Data_Lighting_MapObject)
                {
                    const object = mapObject.getObject()
                    
                    if (object instanceof Data_Lighting_Layer)
                    {
                        Data_Lighting_Layer.saveUrlContent(object.url, object.urlContent)
                    }
                }
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

Scene_LightingEditor.prototype._loadMapData = function(mapId)
{
    const fs = require(`fs`)
    const path = `data/Map${mapId.padZero(3)}.json`
    if (fs.existsSync(path))
    {
        const mapDataJson = fs.readFileSync(path, `utf8`)
        return JsonEx.parse(mapDataJson)
    }
    return null
}

Scene_LightingEditor.prototype._saveMapData = function(mapId, data)
{
    const fs = require(`fs`)
    const path = `data/Map${mapId.padZero(3)}.json`
    fs.writeFileSync(path, JsonEx.stringify(data))
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
    if (this.activeTool == `selectEvent`)
    {
        return validation ? false : null
    }
    
    if (!validation)
    {
        this.setActiveTool(`select`)
    }
    
    return true
}

Scene_LightingEditor.prototype.setTool_paint = function(validation)
{
    if (this.activeTool == `selectEvent`)
    {
        return validation ? false : null
    }
    
    if (this.selection instanceof Data_Lighting_MapObject)
    {
        if (this.selection.getObject() instanceof Data_Lighting_Layer)
        {
            if (!validation)
            {
                this.setActiveTool(`paint`)
            }
            
            return true
        }
    }
    
    return false
}

Scene_LightingEditor.prototype.setTool_erase = function(validation)
{
    if (this.activeTool == `selectEvent`)
    {
        return validation ? false : null
    }
    
    if (this.selection instanceof Data_Lighting_MapObject)
    {
        if (this.selection.getObject() instanceof Data_Lighting_Layer)
        {
            if (!validation)
            {
                this.setActiveTool(`erase`)
            }
            
            return true
        }
    }
    
    return false
}
