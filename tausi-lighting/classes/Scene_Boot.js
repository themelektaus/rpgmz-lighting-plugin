const TausiLighting__Scene_Boot__create = Scene_Boot.prototype.create
Scene_Boot.prototype.create = function()
{
    TausiLighting__Scene_Boot__create.apply(this, arguments)
    
    const propertyInfo = property =>
    {
        switch (property)
        {
            case `Enabled`: return [ `enabled`, true ]
            case `X`: return [ `x`, null ]
            case `Y`: return [ `y`, null ]
            case `Reference Event ID`: return [ `referenceEventId`, null ]
            case `Light: Color (R)`: return [ `color[0]`, null ]
            case `Light: Color (G)`: return [ `color[1]`, null ]
            case `Light: Color (B)`: return [ `color[2]`, null ]
            case `Light: Color (A)`: return [ `color[3]`, null ]
            case `Ambient Light: Weight`: return [ `weight`, null ]
            case `Ambient Light: Exposure`: return [ `exposure`, null ]
            case `Ambient Light: Saturation`: return [ `saturation`, null ]
            case `Ambient Light: Contrast`: return [ `contrast`, null ]
            case `Ambient Light: Power (R)`: return [ `power[0]`, null ]
            case `Ambient Light: Power (G)`: return [ `power[1]`, null ]
            case `Ambient Light: Power (B)`: return [ `power[2]`, null ]
            case `Ambient Light: Power (A)`: return [ `power[3]`, null ]
            case `Point/Spot Light: Intensity`: return [ `intensity`, null ]
            case `Point Light: Radius`: return [ `radius`, null ]
            case `Point Light: Smoothness`: return [ `smoothness`, null ]
            case `Point Light: Flicker Strength`: return [ `flickerStrength`, null ]
            case `Point Light: Flicker Speed`: return [ `flickerSpeed`, null ]
            case `Spot Light: Width`: return [ `width`, null ]
            case `Spot Light: Spread`: return [ `spread`, null ]
            case `Spot Light: Spread Fade`: return [ `spreadFade`, null ]
            case `Spot Light: Direction`: return [ `direction`, null ]
            case `Spot Light: Distance`: return [ `distance`, null ]
            case `Spot Light: Distance Fade In`: return [ `distanceFadeIn`, null ]
            case `Spot Light: Distance Fade Out`: return [ `distanceFadeOut`, null ]
            case `Layer: Filter Mode`: return [ `filterMode`, null ]
            case `Layer: Blend Mode`: return [ `blendMode`, null ]
            case `Layer: Opacity`: return [ `opacity`, null ]
            case `Layer: Power`: return [ `power`, null ]
            default: return [ property, null ]
        }
    }
    
    PluginManager.registerCommand(`TausiLighting`, `bindSwitch`, function(args)
    {
        const objects = JSON.parse(args.objects)
        const _switch = JSON.parse(args.switch)
        
        for (const i in objects)
        {
            objects[i] = JSON.parse(objects[i])
            objects[i].target = eval(objects[i].target)
            const info = propertyInfo(objects[i].property)
            objects[i].property = info[0]
            objects[i].isBoolean = !!info[1]
            objects[i].off = Number(objects[i].off)
            objects[i].on = Number(objects[i].on)
        }
        
        const options = {
            objects: objects,
            switch: _switch
        }
        
        $gameMap.tausiLighting_bindSwitch(this, options)
    })
    
    PluginManager.registerCommand(`TausiLighting`, `bindVariable`, function(args)
    {
        const objects = JSON.parse(args.objects)
        const variable = JSON.parse(args.variable)
        const min = JSON.parse(args.min)
        const max = JSON.parse(args.max)
        
        for (const i in objects)
        {
            objects[i] = JSON.parse(objects[i])
            objects[i].target = eval(objects[i].target)
            const info = propertyInfo(objects[i].property)
            objects[i].property = info[0]
            objects[i].isBoolean = !!info[1]
            objects[i].min = Number(objects[i].min)
            objects[i].max = Number(objects[i].max)
        }
        
        const options = {
            objects: objects,
            variable: variable,
            min: min,
            max: max
        }
        
        $gameMap.tausiLighting_bindVariable(this, options)
    })
    
    PluginManager.registerCommand(`TausiLighting`, `interpolate`, function(args)
    {
        const eventId = this.eventId()
        const objects = JSON.parse(args.objects)
        const duration = JSON.parse(args.duration)
        const wait = JSON.parse(args.wait)
        
        for (const i in objects)
        {
            objects[i] = JSON.parse(objects[i])
            objects[i].target = objects[i].target
                ? eval(objects[i].target)
                : objects[i].target = $dataLighting.getCurrentMap().objects.find(x => x.referenceEventId && x.referenceEventId == eventId)
            const info = propertyInfo(objects[i].property)
            objects[i].property = info[0]
            objects[i].isBoolean = !!info[1]
            objects[i].to = Number(objects[i].to)
        }
        
        const options = {
            objects: objects,
            duration: duration,
            wait: wait
        }
        
        $gameMap.tausiLighting_interpolate(this, options)
    })
    
    if (LightingUtils.getPluginParameterBoolean(`Show Overlay`))
    {
        if (Utils.isOptionValid(`test`) && !location.pathname.endsWith(`/tausi-lighting/editor/index.html`))
        {
            const $_panel = document.createElement(`div`)
            $_panel.id = `lightingEditorOverlayPanel`
            
            const createButton = (icon, text) =>
            {
                const result = { }
                
                result.$_button = document.createElement(`div`)
                result.$_button.classList.add(`button`)
                
                result.$_icon = document.createElement(`div`)
                result.$_icon.classList.add(`icon`)
                result.$_icon.style.backgroundImage = `url(${LightingUtils.getResUrl(`${icon}.svg`)})`
                result.$_button.appendChild(result.$_icon)
                
                result.$_text = document.createElement(`div`)
                result.$_text.classList.add(`text`)
                result.$_text.innerHTML = text
                result.$_button.appendChild(result.$_text)
                
                $_panel.appendChild(result.$_button)
                
                return result
            }
            
            const _lightingEditor = createButton(`edit`, `Lighting Editor`)
            _lightingEditor.$_button.addEventListener(`click`, () =>
            {
                let id = Number($gameMap?.mapId() || 0)
                location.href = `tausi-lighting/editor/index.html${id ? `#${id}` : ``}`
            })
            
            let _update
            
            if (!TAUSI_LIGHTING_PUBLISHER_MODE)
            {
                _update = createButton(`download`, `Checking for updates...`)
                _update.$_button.classList.add(`disabled`)
            }
            
            const _help = createButton(`help`, `Help`)
            _help.$_button.addEventListener(`click`, () =>
            {
                location.href = `tausi-lighting/editor/index.html#help`
            })
            
            if (TAUSI_LIGHTING_PUBLISHER_MODE)
            {
                createButton(`info`, `Publisher Mode`).$_button.classList.add(`disabled`)
            }
            
            new Promise(async () =>
            {
                const $_style = document.createElement(`style`)
                $_style.innerHTML = await fetch(`tausi-lighting/overlay.css`).then(x => x.text())
                document.body.appendChild($_style)
                
                document.body.appendChild($_panel)
                
                if (TAUSI_LIGHTING_PUBLISHER_MODE)
                {
                    return
                }
                
                try { require } catch { return }
                
                const localVersion = TAUSI_LIGHTING_LOCAL_VERSION
                
                const remoteVersion = await fetch(LightingUtils.getPluginParameterString(`Remote Version URL`))
                    .catch(() => { })
                    .then(x => x?.text()) || ``
                
                if (remoteVersion.length != 5 || localVersion == remoteVersion)
                {
                    _update.$_text.innerHTML = `No Update available`
                }
                else
                {
                    _update.$_text.innerHTML = `Update available`
                    
                    _update.$_button.classList.remove(`disabled`)
                    _update.$_button.addEventListener(`click`, async () =>
                    {
                        _update.$_button.classList.add(`disabled`)
                        
                        _update.$_text.innerHTML = `Updating...`
                        
                        const data = await fetch(LightingUtils.getPluginParameterString(`Remote Plugin URL`))
                            .catch(() => { })
                            .then(x => x?.arrayBuffer())
                        
                        if (!data)
                        {
                            _update.$_text.innerHTML = `Update failed`
                            return
                        }
                        
                        const fs = require(`fs`)
                        const path = require(`path`)
                        
                        fs.writeFileSync(`js/plugins/TausiLighting.js`, Buffer.from(data))
                        
                        await new Promise(x => setTimeout(x, 1000))
                        
                        const rmSync = function(folder)
                        {
                            fs.readdirSync(folder).forEach((file, _) =>
                            {
                                const _path = path.join(folder, file)
                                if (fs.lstatSync(_path).isDirectory())
                                {
                                    rmSync(_path)
                                }
                                else
                                {
                                    fs.unlinkSync(_path)
                                }
                            })
                            
                            fs.rmdirSync(folder)
                        }
                        
                        rmSync(`tausi-lighting`)
                        
                        await new Promise(x => setTimeout(x, 1000))
                        
                        _update.$_text.innerHTML = `Update OK, closing...`
                        
                        await new Promise(x => setTimeout(x, 1000))
                        
                        SceneManager.terminate()
                    })
                }
            })
        }
    }
}

const TausiLighting__Scene_Boot__isReady = Scene_Boot.prototype.isReady
Scene_Boot.prototype.isReady = function()
{
    if (window.$dataMapInfos)
    {
        if (window.$dataMapEvents === undefined)
        {
            window.$dataMapEvents = null
            
            const mapIds = JSON.parse(JSON.stringify($dataMapInfos)).filter(x => x).map(x => x?.id)
            const mapInfos = []
            
            for (const mapId of mapIds)
            {
                fetch(`data/Map${mapId.padZero(3)}.json`)
                    .then(x => x.json())
                    .then(x =>
                    {
                        x.id = mapId
                        mapInfos.push(x)
                        
                        if (mapInfos.length == mapIds.length)
                        {
                            const mapEvents = []
                            for (const mapInfo of mapInfos)
                            {
                                mapEvents[mapInfo.id] = mapInfo.events
                            }
                            window.$dataMapEvents = mapEvents
                        }
                    })
            }
            
            return false
        }
        else if (window.$dataMapEvents === null)
        {
            return false
        }
    }
    
    return TausiLighting__Scene_Boot__isReady.apply(this, arguments)
}

const TausiLighting__Scene_Boot__onDatabaseLoaded = Scene_Boot.prototype.onDatabaseLoaded
Scene_Boot.prototype.onDatabaseLoaded = function()
{
    TausiLighting__Scene_Boot__onDatabaseLoaded.apply(this, arguments)
    
    $dataLighting = Data_Lighting.migrate($dataLighting)
    $dataLighting = Data_Lighting.deserialize($dataLighting)
}
