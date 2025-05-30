function Sprite_Light()
{
    this.initialize(...arguments)
}

Sprite_Light.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_Light.prototype.constructor = Sprite_Light;

Sprite_Light.prototype.initialize = function(light)
{
    this.light = light
    
    Sprite_Clickable.prototype.initialize.call(this)
    
    let bitmap
    
    if (light.targetId)
    {
        bitmap = `link.svg`
    }
    else if (light.type == Data_Lighting_GlobalLight.type)
    {
        bitmap = `globelight.svg`
    }
    else
    {
        bitmap = `light.svg`
    }
    
    this.bitmap = ImageManager.loadBitmapFromUrl(LightingUtils.getResUrl(bitmap))
    
    this.anchor.x = .5
    this.anchor.y = .5
}

Sprite_Light.prototype.update = function()
{
    const mapInfo = LightingUtils.getMapInfo()
    this.x = this.light.x - mapInfo.offsetX
    this.y = this.light.y - mapInfo.offsetY
    
    if (LightingUtils.getSelectedLight() == this.light)
    {
        this.setColorTone([50, 50, -50, 50])
        this.scale.x = 1.25
        this.scale.y = 1.25
    }
    else
    {
        this.setColorTone([0, 0, 0, 0])
        this.scale.x = 1
        this.scale.y = 1
    }
    
    Sprite_Clickable.prototype.update.call(this)
}
