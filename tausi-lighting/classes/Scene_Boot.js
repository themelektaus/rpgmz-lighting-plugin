const TausiLighting__Scene_Boot__create = Scene_Boot.prototype.create
Scene_Boot.prototype.create = function()
{
    TausiLighting__Scene_Boot__create.apply(this, arguments)
    
    PluginManager.registerCommand(`TausiLighting`, `interpolate`, function(args)
    {
        const objects = JSON.parse(args.objects)
        const duration = JSON.parse(args.duration)
        const wait = JSON.parse(args.wait)
        
        for (const i in objects)
        {
            objects[i] = JSON.parse(objects[i])
            
            const convertProperty = property =>
            {
                switch (property)
                {
                    case `Enabled`: return `enabled`
                    case `X`: return `x`
                    case `Y`: return `y`
                    case `Follow Event ID`: return `followEventId`
                    case `Light: Color (R)`: return `color[0]`
                    case `Light: Color (G)`: return `color[1]`
                    case `Light: Color (B)`: return `color[2]`
                    case `Light: Color (A)`: return `color[3]`
                    case `Ambient Light: Weight`: return `weight`
                    case `Ambient Light: Exposure`: return `exposure`
                    case `Ambient Light: Saturation`: return `saturation`
                    case `Ambient Light: Power (R)`: return `power[0]`
                    case `Ambient Light: Power (G)`: return `power[1]`
                    case `Ambient Light: Power (B)`: return `power[2]`
                    case `Ambient Light: Power (A)`: return `power[3]`
                    case `Point/Spot Light: Intensity`: return `intensity`
                    case `Point Light: Radius`: return `radius`
                    case `Point Light: Smoothness`: return `smoothness`
                    case `Point Light: Flicker Strength`: return `flickerStrength`
                    case `Point Light: Flicker Speed`: return `flickerSpeed`
                    case `Spot Light: Width`: return `width`
                    case `Spot Light: Spread`: return `spread`
                    case `Spot Light: Spread Fade`: return `spreadFade`
                    case `Spot Light: Direction`: return `direction`
                    case `Spot Light: Distance`: return `distance`
                    case `Spot Light: Distance Fade In`: return `distanceFadeIn`
                    case `Spot Light: Distance Fade Out`: return `distanceFadeOut`
                    case `Layer: Filter Mode`: return `filterMode`
                    case `Layer: Blend Mode`: return `blendMode`
                    case `Layer: Opacity`: return `opacity`
                    case `Layer: Power`: return `power`
                    default: return property
                }
            }
            
            objects[i].target = eval(objects[i].target)
            objects[i].property = convertProperty(objects[i].property)
            objects[i].to = Number(objects[i].to)
        }
        
        const options = {
            objects: objects,
            duration: duration,
            wait: wait
        }
        
        this.interpolate(options)
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

const TausiLighting__Scene_Boot__onDatabaseLoaded = Scene_Boot.prototype.onDatabaseLoaded
Scene_Boot.prototype.onDatabaseLoaded = function()
{
    TausiLighting__Scene_Boot__onDatabaseLoaded.apply(this, arguments)
    
    $dataLighting = Data_Lighting.migrate($dataLighting)
    $dataLighting = Data_Lighting.deserialize($dataLighting)
}
