function Sprite_MapObject()
{
    this.initialize(...arguments)
}

Sprite_MapObject.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_MapObject.prototype.constructor = Sprite_MapObject;

Sprite_MapObject.prototype.initialize = function(reference)
{
    this.reference = reference
    
    Sprite_Clickable.prototype.initialize.call(this)
    
    if (reference.object)
    {
        this.getX = () => reference.x - LightingUtils.getMapInfo().offsetX
        this.getY = () => reference.y - LightingUtils.getMapInfo().offsetY
        
        const bitmap = reference.object.icon
        if (bitmap)
        {
            this.bitmap = ImageManager.loadBitmapFromUrl(LightingUtils.getResUrl(bitmap))
        }
        
        this.anchor.x = .5
        this.anchor.y = .5
    }
    else
    {
        this.getX = () => reference.screenX()
        this.getY = () => reference.screenY()
        this.bitmap = ImageManager.loadBitmapFromUrl(LightingUtils.getResUrl(`marker.svg`))
        this.anchor.x = .5
        this.anchor.y = 1.25
    }
}

Sprite_MapObject.prototype.update = function()
{
    this.x = this.getX()
    this.y = this.getY()
    
    const selectedMapObject = LightingUtils.getSelectedMapObject()
    
    if (selectedMapObject && selectedMapObject == this.reference)
    {
        this.setColorTone([50, 50, -50, 50])
        this.scale.x = 1.25
        this.scale.y = 1.25
    }
    else if (selectedMapObject && selectedMapObject.objectId && selectedMapObject.objectId == this.reference.objectId)
    {
        this.setColorTone([50, 50, -50, 50])
        this.scale.x = 1
        this.scale.y = 1
    }
    else
    {
        this.setColorTone([0, 0, 0, 0])
        this.scale.x = 1
        this.scale.y = 1
    }
    
    Sprite_Clickable.prototype.update.call(this)
}
