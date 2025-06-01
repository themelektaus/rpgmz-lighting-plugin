const Scene_Boot__create = Scene_Boot.prototype.create
Scene_Boot.prototype.create = function()
{
    Scene_Boot__create.apply(this, arguments)
    
    if (LightingUtils.getPluginParameterBoolean(`Show Overlay`))
    {
        if (Utils.isOptionValid(`test`) && !location.pathname.endsWith(`/tausi-lighting/editor/index.html`))
        {
            const $_buttons = document.createElement(`div`)
            $_buttons.id = `lightingEditorOverlayButtons`
            document.body.appendChild($_buttons)
            
            const $_button = document.createElement(`div`)
            $_button.classList.add(`button`)
            $_button.innerHTML = `Lighting Editor`
            $_button.addEventListener(`click`, () =>
            {
                let id = Number($gameMap?.mapId() || 0)
                location.href = `tausi-lighting/editor/index.html${id ? `#${id}` : ``}`
            })
            $_buttons.appendChild($_button)
            
            const $_style = document.createElement(`style`)
            $_style.innerHTML = `
#lightingEditorOverlayButtons {
    position: fixed;
    top: .25em;
    left: 50vw;
    transform: translate(-50%, calc(-100% - .5em));
    z-index: 2;
    display: flex;
    gap: .25em;
    transition: .2s;
}
#lightingEditorOverlayButtons .button {
    padding: .5em 1em;
    color: #fff;
    background: linear-gradient(#555, #000);
    border-radius: .25em;
    cursor: pointer;
    opacity: .8;
    transition: .1s;
    font-family: sans-serif;
    filter: brightness(.9);
}
*:hover ~ #lightingEditorOverlayButtons,
#lightingEditorOverlayButtons:hover {
    transform: translate(-50%, 0);
}
#lightingEditorOverlayButtons .button:hover {
    filter: brightness(1.0);
}
#lightingEditorOverlayButtons .button:active {
    filter: brightness(1.2);
}
`
            document.body.appendChild($_style)
            
            new Promise(async () =>
            {
                const baseUrl = `https://nockal.com/download/rpgmz-lighting-plugin`
                
                const localVersion = TAUSI_LIGHTING_VERSION
                
                const remoteVersion = await fetch(`${baseUrl}/version.txt`).then(x => x.text())
                
                if (localVersion != remoteVersion)
                {
                    const $_button = document.createElement(`div`)
                    $_button.classList.add(`button`)
                    $_button.innerHTML = `Update`
                    $_button.addEventListener(`click`, async () =>
                    {
                        $_button.disabled = true
                        $_button.style.opacity = .5
                        $_button.style.pointerEvents = `none`
                        
                        const data = await fetch(`${baseUrl}/TausiLighting.js`)
                            .then(x => x.arrayBuffer())
                        
                        const fs = require(`fs`)
                        fs.writeFileSync(`js/plugins/TausiLighting.js`, Buffer.from(data))
                        
                        SceneManager.reloadGame()
                    })
                    $_buttons.appendChild($_button)
                }
            })
        }
    }
}

const Scene_Boot__onDatabaseLoaded = Scene_Boot.prototype.onDatabaseLoaded
Scene_Boot.prototype.onDatabaseLoaded = function()
{
    Scene_Boot__onDatabaseLoaded.apply(this, arguments)
    
    $dataLighting = Object.assign(new Data_Lighting, $dataLighting)
    
    for (const i in $dataLighting.maps)
    {
        $dataLighting.maps[i] = Object.assign(new Data_Lighting_Map, $dataLighting.maps[i])
        
        const map = $dataLighting.maps[i]
        for (const j in map.lights)
        {
            if (map.lights[j].targetId)
            {
                map.lights[j] = Object.assign(new Data_Lighting_Reference, map.lights[j])
            }
            else if (map.lights[j].type == Data_Lighting_AmbientLight.type)
            {
                map.lights[j] = Object.assign(new Data_Lighting_AmbientLight, map.lights[j])
            }
            else if (map.lights[j].type == Data_Lighting_PointLight.type)
            {
                map.lights[j] = Object.assign(new Data_Lighting_PointLight, map.lights[j])
            }
            else if (map.lights[j].type == Data_Lighting_SpotLight.type)
            {
                map.lights[j] = Object.assign(new Data_Lighting_SpotLight, map.lights[j])
            }
            else
            {
                map.lights[j] = Object.assign(new Data_Lighting_MapObject, map.lights[j])
            }
        }
    }
}
