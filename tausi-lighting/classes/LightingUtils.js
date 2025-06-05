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
    this._lightsNeedRefresh = true
    this._needsRefresh = true
}

LightingUtils.preloadBitmaps = function()
{
    let loaded = 0
    
    const names = [ `map.svg`, `link.svg`, `globelight.svg`, `light.svg` ]
    
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

LightingUtils.getMapInfo = function()
{
    const tileWidth = $gameMap.tileWidth()
    const tileHeight = $gameMap.tileHeight()
    return {
        tileWidth: tileWidth,
        tileHeight: tileHeight,
        offsetX: $gameMap.displayX() * tileWidth,
        offsetY: $gameMap.displayY() * tileHeight,
        width: $dataMap.width * tileWidth,
        height: $dataMap.height * tileHeight
    }
}

LightingUtils.lerp = (a, b, t) => (1 - t) * a + t * b

LightingUtils.getSelectedMapObject = function()
{
    const scene = SceneManager._scene
    return scene.selectedMapObject
}

LightingUtils.setSelectedMapObject = function()
{
    const scene = SceneManager._scene
    scene.setSelectedMapObject(...arguments)
}

LightingUtils.getActiveTool = function()
{
    const scene = SceneManager._scene
    return scene.activeTool
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

LightingUtils.createField = function($_properties, _default, property, options)
{
    const $field = document.createElement(`div`)
    $field.classList.add(`field`)
    
    const $label = document.createElement(`label`)
    $label.innerHTML = options?.label ?? property
    $field.appendChild($label)
    
    const value = this[property]
    
    let $input
    
    const $reset = document.createElement(`button`)
    $reset.classList.add(`no-text`)
    $reset.style.alignSelf = `flex-start`
    $reset.style.backgroundImage = `url(${LightingUtils.getResUrl(`power.svg`)})`
    
    const invalidate = () => SceneManager._scene?.invalidate?.call(SceneManager._scene)
    
    switch (options.type)
    {
        case `toggle`:
            const $inputContainer = document.createElement(`div`)
            $field.appendChild($inputContainer)
            $input = document.createElement(`input`)
            $input.type = `checkbox`
            $input.checked = eval(value ?? `true`)
            $input.addEventListener(`change`, () =>
            {
                this[property] = $input.checked
                invalidate()
            })
            $inputContainer.appendChild($input)
            $reset.addEventListener(`click`, () =>
            {
                $input.value = _default[property]
                $input.dispatchEvent(new Event(`change`))
            })
            break
        
        case `number`:
            $input = document.createElement(`input`)
            $input.type = `number`
            $input.min = options?.min ?? 0
            $input.max = options?.max ?? 1000
            $input.value = Number(value || 0)
            $input.addEventListener(`input`, () =>
            {
                this[property] = Number($input.value || 0)
                invalidate()
            })
            $field.appendChild($input)
            $reset.addEventListener(`click`, () =>
            {
                $input.value = _default[property]
                $input.dispatchEvent(new Event(`input`))
            })
            break
        
        case `dropdown`:
            const $select = document.createElement(`select`)
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
                    $select.appendChild(option)
                }
            }
            else
            {
                const option = document.createElement(`option`)
                option.value = 0
                option.innerHTML = `-`
                $select.appendChild(option)
            }
            
            $select.value = selectedValue
            
            $select.addEventListener(`change`, () =>
            {
                this[property] = Number($select.value || 0)
                invalidate()
            })
            
            $field.appendChild($select)
            $reset.addEventListener(`click`, () =>
            {
                $select.value = _default[property]
                $select.dispatchEvent(new Event(`change`))
            })
            break
        
        case `slider`:
            $input = document.createElement(`input`)
            $input.type = `range`
            $input.min = options?.min ?? 0
            $input.max = options?.max ?? 100
            $input.step = options?.step ?? 1
            $input.value = Number(value || 0)
            $input.addEventListener(`input`, () =>
            {
                this[property] = Number($input.value || 0)
                invalidate()
            })
            $field.appendChild($input)
            $reset.addEventListener(`click`, () =>
            {
                $input.value = _default[property]
                $input.dispatchEvent(new Event(`input`))
            })
            break
            
        case `color`:
            $input = document.createElement(`div`)
            $input.classList.add(`color`)
            $field.appendChild($input)
            for (let i = 0; i < 4; i++)
            {
                const _i = i
                const $ = document.createElement(`input`)
                $.type = `range`
                $.min = 0
                switch (_i)
                {
                    case 0:
                        $.classList.add(`r`)
                        $.max = options?.max?.r ?? 255
                        break
                    case 1:
                        $.classList.add(`g`)
                        $.max = options?.max?.g ?? 255
                        break
                    case 2:
                        $.classList.add(`b`)
                        $.max = options?.max?.b ?? 255
                        break
                    case 3:
                        $.classList.add(`a`)
                        $.max = options?.max?.a ?? 255
                        break
                }
                $.value = Number(value[_i] || 0)
                $.addEventListener(`input`, () =>
                {
                    this[property][_i] = Number($.value || 0)
                    invalidate()
                })
                $input.appendChild($)
                $reset.addEventListener(`click`, () =>
                {
                    $.value = _default[property][_i]
                    $.dispatchEvent(new Event(`input`))
                })
            }
            break
        
        default:
            $input = document.createElement(`input`)
            $input.value = value
            $input.readOnly = true
            $field.appendChild($input)
            break
        
    }
    
    $field.appendChild($reset)
    
    if (!_default)
    {
        $reset.style.visibility = `hidden`
    }
    
    $_properties.appendChild($field)
}
