const TausiLighting__Game_Map__update = Game_Map.prototype.update
Game_Map.prototype.update = function()
{
    TausiLighting__Game_Map__update.apply(this, arguments)
    
    this.tausiLighting_updateBindings()
}

Game_Map.prototype.tausiLighting_updateBindings = function()
{
    for (const binding of this._tausiLighting_swtichBindings ?? [])
    {
        const objects = binding.objects ?? []
        
        if (objects.length)
        {
            const v = $gameSwitches.value(binding.switch)
            
            for (const object of objects)
            {
                const _v = v ? object.on : object.off
                
                object.target.set(
                    object.property,
                    (object?.isBoolean ?? false) ? !!_v : _v
                )
            }
        }
    }
    
    for (const binding of this._tausiLighting_VariableBindings ?? [])
    {
        const objects = binding.objects ?? []
        
        if (objects.length)
        {
            const min = binding.min
            const max = binding.max
            const v = $gameVariables.value(binding.variable)
            const t = LightingUtils.lerp(0, 1, (v - min) / (max - min)) 
            
            for (const object of objects)
            {
                object.target.set(
                    object.property,
                    (object?.isBoolean ?? false)
                        ? t > .5
                        : LightingUtils.lerp(object.min, object.max, t)
                )
            }
        }
    }
}

Game_Map.prototype.tausiLighting_bindSwitch = function(interpreter, options)
{
    this._tausiLighting_swtichBindings ??= []
    
    let binding = this._tausiLighting_swtichBindings.find(x => x.switch == options.switch)
    
    if (!binding)
    {
        binding = { switch: options.switch }
        this._tausiLighting_swtichBindings.push(binding)
    }
    
    binding.objects = options.objects
}

Game_Map.prototype.tausiLighting_bindVariable = function(interpreter, options)
{
    this._tausiLighting_VariableBindings ??= []
    
    let binding = this._tausiLighting_VariableBindings.find(x => x.variable == options.variable)
    
    if (!binding)
    {
        binding = { variable: options.variable }
        this._tausiLighting_VariableBindings.push(binding)
    }
    
    binding.objects = options.objects
    binding.min = options.min
    binding.max = options.max
}

Game_Map.prototype.tausiLighting_interpolate = function(interpreter, options)
{
    const duration = options?.duration ?? 60
    
    const updates = []
    
    for (const object of options?.objects ?? [])
    {
        const target = object?.target ?? null
        const property = object?.property ?? null
        const isBoolean = object?.isBoolean ?? false
        const to = object?.to ?? null
        
        if (target && property && to !== null)
        {
            this._tausiLighting_interpolations = this._tausiLighting_interpolations?.filter(
                x => x.target != target || x.property != property
            ) ?? []
            
            if (duration == 0)
            {
                target.set(property, isBoolean ? !!to : to)
                continue
            }
            
            const interpolation = {
                target: target,
                property: property,
                duration: duration,
                frame: 0
            }
            
            if (isBoolean)
            {
                const _from = target.get(property) ? 1 : 0
                const _to = to ? 1 : 0
                interpolation.update = t => target.set(property, !!LightingUtils.lerp(_from, _to, t))
            }
            else
            {
                const from = target.get(property)
                interpolation.update = t => target.set(property, LightingUtils.lerp(from, to, t))
            }
            
            this._tausiLighting_interpolations.push(interpolation)
        }
    }
    
    if (duration && (options?.wait ?? false))
    {
        interpreter.wait(duration)
    }
}

const TausiLighting__Game_Map__updateInterpreter = Game_Map.prototype.updateInterpreter
Game_Map.prototype.updateInterpreter = function()
{
    TausiLighting__Game_Map__updateInterpreter.apply(this, arguments)
    
    if (!this._tausiLighting_interpolations)
    {
        return
    }
    
    for (const interpolation of [ ...this._tausiLighting_interpolations ])
    {
        interpolation.update(++interpolation.frame / interpolation.duration)
        
        if (interpolation.frame < interpolation.duration)
        {
            continue
        }
        
        const index = this._tausiLighting_interpolations.indexOf(interpolation)
        this._tausiLighting_interpolations.splice(index, 1)
    }
}
