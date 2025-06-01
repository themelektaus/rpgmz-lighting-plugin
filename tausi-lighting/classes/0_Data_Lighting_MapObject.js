class Data_Lighting_MapObject
{
    enabled = true
    x = 0
    y = 0
    
    createPropertiesEditor($_properties)
    {
        this.createField($_properties, null, `enabled`, { type: `toggle` })
    }
    
    createField($_properties, _default, property, options)
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
                            $.max = 255
                            break
                        case 1:
                            $.classList.add(`g`)
                            $.max = 255
                            break
                        case 2:
                            $.classList.add(`b`)
                            $.max = 255
                            break
                        case 3:
                            $.classList.add(`a`)
                            $.max = 1020
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
}
