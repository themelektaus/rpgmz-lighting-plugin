LightingUtils = function()
{
    
}

LightingUtils.getPluginParameters = function()
{
    return PluginManager.parameters(`TausiLighting`)
}

LightingUtils.getPluginParameterString = function(key)
{
    return this.getPluginParameters()[key] || ``
}

LightingUtils.getPluginParameterBoolean = function(key)
{
    return eval(this.getPluginParameters()[key] || `true`)
}

LightingUtils.refresh = function()
{
    this._needsRefresh = true
    this._editorNeedsRefresh = true
}

LightingUtils.preloadBitmaps = function()
{
    let loaded = 0
    
    const names = [ `map.svg`, `globelight.svg`, `light.svg` ]
    
    return new Promise(resolve =>
    {
        for (const name of names)
        {
            ImageManager.loadBitmapFromUrl(LightingUtils.getResUrl(name))
                .addLoadListener(() =>
                {
                    if (++loaded == names.length)
                    {
                        resolve()
                    }
                })
        }
    })
}

LightingUtils.getMapWidth = function()
{
    return $dataMap.width * $gameMap.tileWidth()
}

LightingUtils.getMapHeight = function()
{
    return $dataMap.height * $gameMap.tileHeight()
}

LightingUtils.getMapOffsetX = function()
{
    return $gameMap.displayX() * $gameMap.tileWidth()
}

LightingUtils.getMapOffsetY = function()
{
    return $gameMap.displayY() * $gameMap.tileHeight()
}

LightingUtils.lerp = (a, b, t) => (1 - t) * a + t * b

LightingUtils.invalidate = function()
{
    const scene = SceneManager._scene
    return scene.invalidate(...arguments)
}

LightingUtils.getSelection = function()
{
    const scene = SceneManager._scene
    return scene.selection
}

LightingUtils.setSelection = function()
{
    const scene = SceneManager._scene
    scene.setSelection(...arguments)
}

LightingUtils.getActiveTool = function()
{
    const scene = SceneManager._scene
    return scene.activeTool
}

LightingUtils.getActiveToolData = function()
{
    const scene = SceneManager._scene
    return scene.activeToolData
}

LightingUtils.setActiveTool = function()
{
    const scene = SceneManager._scene
    return scene.setActiveTool(...arguments)
}

LightingUtils.toolSettings = {
    color: [ 255, 255, 255, 50 ],
    radius: 40,
    smoothness: 50
}

LightingUtils.getResUrl = function(name)
{
    return `tausi-lighting/editor/res/${name}`
}

LightingUtils.showOverlay = async function(windowId)
{
    const $_overlay = document.querySelector(`#overlay`)
    
    if ($_overlay.classList.contains(`visible`))
    {
        LightingUtils.hideOverlay()
        await new Promise(x => setTimeout(x, 200))
    }
    
    $_overlay.querySelector(`#${windowId}`).classList.add(`visible`)
    $_overlay.classList.add(`visible`)
}

LightingUtils.hideOverlay = function()
{
    const $_overlay = document.querySelector(`#overlay`)
    $_overlay.querySelectorAll(`.dialog-window`).forEach($ => $.classList.remove(`visible`))
    $_overlay.classList.remove(`visible`)
}

LightingUtils.hashCode = function(str)
{
    if (!str)
    {
        return 0
    }
    
    let hash = 0
    
    for (i = 0; i < str.length; i++)
    {
        hash = (((hash << 5) - hash) + str.charCodeAt(i)) | 0
    }
    return hash
}

LightingUtils.colorToHex = function(x)
{
    if (typeof x == `object`)
    {
        let result = `#`
        for (const y of x)
        {
            result += LightingUtils.colorToHex(y)
        }
        return result
    }
    
    return x.toString(16).padStart(2, '0')
}

LightingUtils.property = function(object, property)
{
    if (property.endsWith(`]`))
    {
        const array = property.split(`[`, 2)[0]
        const index = Number(property.split(`[`, 2)[1].split(`]`)[0])
        return {
            get: () => (object[array] ?? [])[index],
            set: x => object[array][index] = x
        }
    }
    else
    {
        return {
            get: () => object[property],
            set: x => object[property] = x
        }
    }
}

LightingUtils.createField = function($_properties, _default, property, options)
{
    const $_field = document.createElement(`div`)
    $_field.classList.add(`field`)
    
    const label = options?.label ?? (
        property.endsWith(`()`)
            ? property.substring(0, property.length - 2)
            : property
    )
    
    const $_label = document.createElement(`label`)
    $_label.innerHTML = label
    $_field.appendChild($_label)
    
    const value = property.endsWith(`()`)
        ? this[property.substring(0, property.length - 2)].apply(this)
        : this[property]
    
    let $_input
    
    const $_reset = document.createElement(`button`)
    $_reset.classList.add(`no-text`)
    $_reset.style.alignSelf = `flex-start`
    $_reset.style.backgroundImage = `url(${LightingUtils.getResUrl(`power.svg`)})`
    
    const $_code = document.createElement(`button`)
    $_code.classList.add(`no-text`)
    $_code.style.alignSelf = `flex-start`
    
    if (property.endsWith(`()`))
    {
        $_code.style.backgroundImage = `url(${LightingUtils.getResUrl(`copy.svg`)})`
        $_code.style.backgroundSize = `75%`
        $_code.style.backgroundRepeat = `no-repeat`
    }
    else
    {
        $_code.style.backgroundImage = `url(${LightingUtils.getResUrl(`code.svg`)})`
        $_code.style.backgroundSize = `92.5%`
        $_code.style.backgroundRepeat = `no-repeat`
    }
    
    const $_codeInfo = document.createElement(`div`)
    $_codeInfo.classList.add(`codeInfo`)
    $_codeInfo.innerHTML = `Copied to Clipboard`
    
    $_code.addEventListener(`click`, async () =>
    {
        $_code.disabled = true
        await navigator.clipboard.writeText(this.generateScriptCommand(property.endsWith(`()`) ? null : property))
        $_codeInfo.classList.add(`visible`)
        await new Promise(x => setTimeout(x, 2000))
        $_codeInfo.classList.remove(`visible`)
        $_code.disabled = false
    })
    
    const dump = options?.dump
        ? () => { LightingUtils.dump() }
        : () => { }
    
    switch (options?.type)
    {
        case `toggle`:
            const $_inputContainer = document.createElement(`div`)
            $_field.appendChild($_inputContainer)
            $_input = document.createElement(`input`)
            $_input.type = `checkbox`
            $_input.checked = eval(value ?? `true`)
            $_input.addEventListener(`change`, () =>
            {
                if (this[property] != $_input.checked)
                {
                    this[property] = $_input.checked
                    dump()
                    LightingUtils.invalidate()
                }
            })
            $_inputContainer.appendChild($_input)
            $_reset.addEventListener(`click`, () =>
            {
                if ($_input.value != _default[property])
                {
                    $_input.value = _default[property]
                    this[property] = $_input.checked
                    dump()
                    LightingUtils.invalidate()
                }
            })
            break
        
        case `number`:
            $_input = document.createElement(`input`)
            $_input.type = `number`
            $_input.min = options?.min ?? 0
            $_input.max = options?.max ?? 1000
            $_input.value = Number(value || 0)
            $_input.addEventListener(`input`, () =>
            {
                this[property] = Number($_input.value || 0)
                LightingUtils.invalidate()
            })
            $_input.addEventListener(`change`, () =>
            {
                dump()
                LightingUtils.invalidate()
            })
            $_field.appendChild($_input)
            $_reset.addEventListener(`click`, () =>
            {
                if ($_input.value != _default[property])
                {
                    $_input.value = _default[property]
                    this[property] = Number($_input.value || 0)
                    dump()
                    LightingUtils.invalidate()
                }
            })
            break
        
        case `event`:
            const $_button = document.createElement(`button`)
            $_button.innerHTML = LightingUtils.getEventHtml(Number(value || 0))
            $_button.addEventListener(`click`, () =>
            {
                LightingUtils.setActiveTool(`selectEvent`, x =>
                {
                    LightingUtils.setActiveTool(`selectEvent`, null)
                    this[property] = x
                    $_button.innerHTML = LightingUtils.getEventHtml(x)
                    dump()
                    requestAnimationFrame(() =>
                    {
                        LightingUtils.setActiveTool(`select`)
                        LightingUtils.invalidate()
                    })
                })
                LightingUtils.invalidate()
            })
            $_field.appendChild($_button)
            break
        
        case `dropdown`:
            const $_select = document.createElement(`select`)
            const selectedValue = Number(value || 0)
            
            const items = options?.items ?? []
            if (items.length)
            {
                for (const item of items)
                {
                    const option = document.createElement(`option`)
                    const value = Number(item.value || 0)
                    option.value = value
                    option.innerHTML = item.text || value.toString()
                    $_select.appendChild(option)
                }
            }
            else
            {
                const option = document.createElement(`option`)
                option.value = 0
                option.innerHTML = `-`
                $_select.appendChild(option)
            }
            
            $_select.value = selectedValue
            
            $_select.addEventListener(`change`, () =>
            {
                if (this[property] != Number($_select.value || 0))
                {
                    this[property] = Number($_select.value || 0)
                    dump()
                    LightingUtils.invalidate()
                }
            })
            
            $_field.appendChild($_select)
            $_reset.addEventListener(`click`, () =>
            {
                if ($_select.value != _default[property])
                {
                    $_select.value = _default[property]
                    this[property] = Number($_select.value || 0)
                    dump()
                    LightingUtils.invalidate()
                }
            })
            break
        
        case `slider`:
            $_input = document.createElement(`input`)
            $_input.type = `range`
            $_input.min = options?.min ?? 0
            $_input.max = options?.max ?? 100
            $_input.step = options?.step ?? 1
            $_input.value = Number(value || 0)
            $_input.addEventListener(`input`, () =>
            {
                this[property] = Number($_input.value || 0)
                LightingUtils.invalidate()
            })
            $_input.addEventListener(`change`, () =>
            {
                dump()
                LightingUtils.invalidate()
            })
            $_field.appendChild($_input)
            $_reset.addEventListener(`click`, () =>
            {
                if ($_input.value != _default[property])
                {
                    $_input.value = _default[property]
                    this[property] = Number($_input.value || 0)
                    dump()
                    LightingUtils.invalidate()
                }
            })
            break
            
        case `color`:
            $_input = document.createElement(`div`)
            $_input.classList.add(`color`)
            $_field.appendChild($_input)
            
            const resetActions = []
            
            for (let i = 0; i < 4; i++)
            {
                const _i = i
                const $_ = document.createElement(`input`)
                $_.type = `range`
                $_.min = 0
                switch (_i)
                {
                    case 0:
                        $_.classList.add(`r`)
                        $_.max = options?.max?.r ?? 255
                        break
                    case 1:
                        $_.classList.add(`g`)
                        $_.max = options?.max?.g ?? 255
                        break
                    case 2:
                        $_.classList.add(`b`)
                        $_.max = options?.max?.b ?? 255
                        break
                    case 3:
                        $_.classList.add(`a`)
                        $_.max = options?.max?.a ?? 255
                        break
                }
                $_.value = Number(value[_i] || 0)
                $_.addEventListener(`input`, () =>
                {
                    this[property][_i] = Number($_.value || 0)
                    LightingUtils.invalidate()
                })
                $_.addEventListener(`change`, () =>
                {
                    dump()
                    LightingUtils.invalidate()
                })
                $_input.appendChild($_)
                resetActions.push(() =>
                {
                    if ($_.value == _default[property][_i])
                    {
                        return false
                    }
                    
                    $_.value = _default[property][_i]
                    this[property][_i] = Number($_.value || 0)
                    
                    return true
                })
            }
            
            $_reset.addEventListener(`click`, () =>
            {
                let dirty = false
                for (const resetAction of resetActions)
                {
                    if (resetAction())
                    {
                        dirty = true
                    }
                }
                if (dirty)
                {
                    dump()
                    LightingUtils.invalidate()
                }
            })
            break
        
        default:
            $_input = document.createElement(`input`)
            $_input.type = `text`
            $_input.value = value
            $_input.readOnly = true
            $_field.appendChild($_input)
            break
    }
    
    const $_buttons = document.createElement(`div`)
    $_buttons.classList.add(`buttons`)
    $_field.appendChild($_buttons)
    
    if (this.generateScriptCommand)
    {
        $_buttons.appendChild($_code)
        $_buttons.appendChild($_codeInfo)
    }
    
    if (_default)
    {
        $_buttons.appendChild($_reset)
    }
    
    $_properties.appendChild($_field)
    
    return $_field
}

LightingUtils.dump = function()
{
    if (!$dataLighting)
    {
        return false
    }
    
    let fs
    
    try
    {
        fs = require(`fs`)
    }
    catch
    {
        return false
    }
    
    const data = $dataLighting.serialize()
    
    this.history ??= []
    this.historyIndex = (this.historyIndex ?? -1) + 1
    
    while (this.history.length > this.historyIndex)
    {
        this.history.pop()
    }
    
    this.history.push(data)
    
    return true
}

LightingUtils.undo = function(validation)
{
    return LightingUtils.restore(validation, (this.historyIndex ?? 0) - 1)
}

LightingUtils.redo = function(validation)
{
    return LightingUtils.restore(validation, (this.historyIndex ?? 0) + 1)
}

LightingUtils.restore = function(validation, index)
{
    if (!this.history)
    {
        return false
    }
    
    if (index < 0)
    {
        return false
    }
    
    if (index >= this.history.length)
    {
        return false
    }
    
    let fs
    
    try
    {
        fs = require(`fs`)
    }
    catch
    {
        return false
    }
    
    if (!validation)
    {
        $dataLighting = Data_Lighting.deserialize(this.history[index])
        
        this.historyIndex = index
        
        this.refresh()
    }
    
    return true
}

LightingUtils.patchEvents = function()
{
    for (const eventId in $dataMap.events)
    {
        const event = $dataMap.events[eventId]
        
        if (!event)
        {
            continue
        }
        
        for (const item of (event.pages ?? []).map(x => x.list ?? []).flat())
        {
            if (item.code != 357)
            {
                continue
            }
            
            if (item.parameters[0] != `TausiLighting`)
            {
                continue
            }
            
            if (item.parameters[1] != `copyEventFrom`)
            {
                continue
            }
            
            this.copyEvent(
                Number(item.parameters[3].sourceMapId || 0),
                Number(item.parameters[3].sourceEventId || 0),
                eventId
            )
            
            break
        }
    }
}

LightingUtils.isPatched = function(eventId)
{
    const pages = $dataMap.events[eventId]?.pages ?? []
    const list = pages.map(x => x.list ?? []).flat()
    return list.some(x => x.code == 108 && x.parameters[0] == `Patched by TausiLighting`)
}

LightingUtils.copyEvent = function(sourceMapId, sourceEventId, destinationEventId)
{
    const sourceEvent = (!sourceMapId || sourceMapId == $dataMap.id)
        ? $dataMap.events[sourceEventId]
        : $dataMapEvents[sourceMapId][sourceEventId]
    
    const destinationEvent = $dataMap.events[destinationEventId]
    
    const newEvent = JSON.parse(JSON.stringify(sourceEvent))
    newEvent.id = destinationEvent.id
    newEvent.x = destinationEvent.x
    newEvent.y = destinationEvent.y
    newEvent.pages[0].list.unshift({
        code: 108,
        indent: 0,
        parameters: [ `Patched by TausiLighting` ]
    })
    
    $dataMap.events[destinationEventId] = newEvent
}

LightingUtils.loadPreset = function(name, modifyJson)
{
    
    let fs
    
    try
    {
        fs = require(`fs`)
    }
    catch
    {
        return null
    }
    
    const path = `tausi-lighting/editor/presets/${name}.json`
    const json = fs.readFileSync(path, `utf8`)
    
    return JSON.parse(modifyJson ? modifyJson(json) : json)
}

LightingUtils.getEventHtml = function(eventId)
{
    if (eventId)
    {
        const event = $dataMap.events[eventId]
        
        if (event)
        {
            return `<span class="id">${eventId.padZero(3)}</span>`
                + `<span class="name">${event?.name ?? `-`}</span>`
        }
        else
        {
            return `<span class="id error">${eventId.padZero(3)}</span>`
                + `<span class="error">Event does not exists</span>`
        }
    }
    else
    {
        return `<span class="unset">Unset</span>`
    }
}
