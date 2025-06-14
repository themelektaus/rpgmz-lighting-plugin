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
    
    if (reference instanceof Data_Lighting_MapObject)
    {
        this.getX = () => reference.x - LightingUtils.getMapOffsetX()
        this.getY = () => reference.y - LightingUtils.getMapOffsetY()
        
        const object = reference.getObject()
        
        if (object.icon)
        {
            this.bitmap = ImageManager.loadBitmapFromUrl(LightingUtils.getResUrl(object.icon))
        }
    }
    else
    {
        this.getX = () => reference.screenX()
        this.getY = () => reference.screenY() - $gameMap.tileHeight() / 2
        this.bitmap = ImageManager.loadBitmapFromUrl(LightingUtils.getResUrl(`marker.svg`))
    }
    
    this.anchor.x = .5
    this.anchor.y = .5
    
    this.update()
    
    this.opacity = this._targetOpacity
    this.scale.x = this._targetScale
    this.scale.y = this._targetScale
}

Sprite_MapObject.prototype.isClickEnabled = function()
{
    return Sprite_Clickable.prototype.isClickEnabled.call(this) && this.opacity > 5
}

Sprite_MapObject.prototype.update = function()
{
    Sprite_Clickable.prototype.update.call(this)
    
    this.x = this.getX()
    this.y = this.getY()
    
    const activeTool = LightingUtils.getActiveTool()
    const selection = LightingUtils.getSelection()
    const isSelected = selection && selection == this.reference
    const isReference = selection && (
        (selection.objectId && selection.objectId == this.reference.objectId) ||
        (selection.referenceEventId && this.reference instanceof Game_Event && selection.referenceEventId == this.reference.eventId())
    )
    
    if (isSelected)
    {
        this.setColorTone([50, 50, -50, 50])
    }
    else if (isReference)
    {
        this.setColorTone([50, 0, -50, 50])
    }
    else
    {
        this.setColorTone([0, 0, 0, 0])
    }
    
    if (activeTool == `select` && isSelected)
    {
        this._targetScale = 1.25
    }
    else
    {
        this._targetScale = 1
    }
    
    switch (activeTool)
    {
        case `select`:
            if (selection)
            {
                if (isSelected)
                {
                    this._targetOpacity = 255
                }
                else if (isReference)
                {
                    this._targetOpacity = this._hovered ? 255 : 205
                }
                else if (
                    selection instanceof Data_Lighting_MapObject &&
                    selection.getObject() instanceof Data_Lighting_Layer &&
                    this.reference instanceof Data_Lighting_MapObject &&
                    this.reference.getObject() instanceof Data_Lighting_Layer
                )
                {
                    this._targetOpacity = this._hovered ? 255 : 185
                }
                else if (
                    selection instanceof Data_Lighting_MapObject &&
                    selection.getObject() instanceof Data_Lighting_AmbientLight &&
                    this.reference instanceof Data_Lighting_MapObject &&
                    this.reference.getObject() instanceof Data_Lighting_AmbientLight
                )
                {
                    this._targetOpacity = this._hovered ? 255 : 185
                }
                else
                {
                    this._targetOpacity = 0
                }
            }
            else
            {
                if (this._hovered)
                {
                    this._targetOpacity = 255
                }
                else
                {
                    this._targetOpacity = 185
                }
            }
            break
        
        case `selectEvent`:
            if (this.reference instanceof Game_Event)
            {
                if (this._hovered)
                {
                    this._targetOpacity = 255
                }
                else
                {
                    this._targetOpacity = 185
                }
            }
            else
            {
                this._targetOpacity = 0
            }
            break
        
        case `paint`:
        case `erase`:
            this._targetOpacity = 0
            break
    }
    
    this.scale.x = LightingUtils.lerp(this.scale.x, this._targetScale, .3)
    this.scale.y = this.scale.x
    
    this.opacity = LightingUtils.lerp(this.opacity, this._targetOpacity, this.opacity < this._targetOpacity ? .3 : .1)
}
