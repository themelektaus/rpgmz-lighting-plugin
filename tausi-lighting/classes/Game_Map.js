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

Game_Map.prototype.startInterpolation = function(interpreter, options)
{
    const duration = options?.duration ?? 60
    
    const updates = []
    
    for (const object of options?.objects ?? [])
    {
        const target = object?.target ?? null
        const property = object?.property ?? null
        const to = object?.to ?? null
        
        if (target && property && to !== null)
        {
            if (duration == 0)
            {
                target.set(property, to)
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
