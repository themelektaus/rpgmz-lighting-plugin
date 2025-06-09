function Sprite_MapObject()
{
    this.initialize(...arguments)
}

Sprite_MapObject.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_MapObject.prototype.constructor = Sprite_MapObject;

Sprite_MapObject.prototype.initialize = function(mapObject)
{
    this.mapObject = mapObject
    
    Sprite_Clickable.prototype.initialize.call(this)
    
    let bitmap
    
    if (mapObject.object instanceof Data_Lighting_Layer)
    {
        bitmap = `map.svg`
    }
    else if (mapObject.object instanceof Data_Lighting_AmbientLight)
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

Sprite_MapObject.prototype.update = function()
{
    const mapInfo = LightingUtils.getMapInfo()
    this.x = this.mapObject.x - mapInfo.offsetX
    this.y = this.mapObject.y - mapInfo.offsetY
    
    if (LightingUtils.getSelectedMapObject() == this.mapObject)
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
