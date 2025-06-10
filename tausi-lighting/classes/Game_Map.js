const TausiLighting__Game_Map__update = Game_Map.prototype.update
Game_Map.prototype.update = function()
{
    TausiLighting__Game_Map__update.apply(this, arguments)
    this.updateLights()
}

const TausiLighting__Game_Map__updateInterpreter = Game_Map.prototype.updateInterpreter
Game_Map.prototype.updateInterpreter = function()
{
    TausiLighting__Game_Map__updateInterpreter.apply(this, arguments)
    
    for (const interpolation of [...(this.interpolations ?? [])])
    {
        interpolation.frame ??= 0
        interpolation.frame++
        
        interpolation.update(interpolation.frame / interpolation.duration)
        
        if (interpolation.frame == interpolation.duration)
        {
            this.interpolations ??= []
            this.interpolations.splice(this.interpolations.indexOf(interpolation), 1)
        }
    }
}

Game_Map.prototype.updateLights = function()
{
    for (const binding of this._lightingSwitchBinding ?? [])
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
    
    for (const binding of this._lightingVariableBinding ?? [])
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

Game_Map.prototype.bindSwitch = function(interpreter, options)
{
    this._lightingSwitchBinding ??= []
    
    let binding = this._lightingSwitchBinding.find(x => x.switch == options.switch)
    
    if (!binding)
    {
        binding = { switch: options.switch }
        this._lightingSwitchBinding.push(binding)
    }
    
    binding.objects = options.objects
}

Game_Map.prototype.bindVariable = function(interpreter, options)
{
    this._lightingVariableBinding ??= []
    
    let binding = this._lightingVariableBinding.find(x => x.variable == options.variable)
    
    if (!binding)
    {
        binding = { variable: options.variable }
        this._lightingVariableBinding.push(binding)
    }
    
    binding.objects = options.objects
    binding.min = options.min
    binding.max = options.max
}

Game_Map.prototype.startInterpolation = function(interpreter, options)
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
            if (duration == 0)
            {
                target.set(property, isBoolean ? !!to : to)
            }
            else if (isBoolean)
            {
                const _from = target.get(property) ? 1 : 0
                const _to = to ? 1 : 0
                updates.push(t => target.set(property, !!LightingUtils.lerp(_from, _to, t)))
            }
            else
            {
                const from = target.get(property)
                updates.push(t => target.set(property, LightingUtils.lerp(from, to, t)))
            }
        }
    }
    
    if (updates.length)
    {
        const interpolation = {
            duration: duration,
            update: t => updates.forEach(x => x.call(interpreter, t))
        }
        
        this.interpolations ??= []
        this.interpolations.push(interpolation)
        
        interpolation.update(0)
    }
    
    if (duration && (options?.wait ?? false))
    {
        interpreter.wait(duration)
    }
}
