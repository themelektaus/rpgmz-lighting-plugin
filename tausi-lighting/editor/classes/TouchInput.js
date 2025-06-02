TouchInput._onWheel = function(event)
{
    
}

const TausiLighting__Editor__TouchInput__onMouseDown = TouchInput._onMouseDown
TouchInput._onMouseDown = function(event)
{
    TausiLighting__Editor__TouchInput__onMouseDown.call(this, event)
    
    const x = Graphics.pageToCanvasX(event.pageX)
    const y = Graphics.pageToCanvasY(event.pageY)
    
    if (Graphics.isInsideCanvas(x, y))
    {
        if (event.button == 1)
        {
            this._lastPanningPosition = [ x, y ]
        }
    }
}

const TausiLighting__Editor__TouchInput__onMouseUp = TouchInput._onMouseUp
TouchInput._onMouseUp = function(event)
{
    TausiLighting__Editor__TouchInput__onMouseUp.call(this, event)
    
    if (event.button == 0)
    {
        delete this._lastLight
        SceneManager._scene?.invalidate?.call(SceneManager._scene)
    }
    
    if (event.button == 1)
    {
        delete this._lastPanningPosition
    }
}

const TausiLighting__Editor__TouchInput__onMouseMove = TouchInput._onMouseMove
TouchInput._onMouseMove = function(event)
{
    TausiLighting__Editor__TouchInput__onMouseMove.call(this, event)
    
    if (!this._lastLight && !this._lastPanningPosition)
    {
        return
    }
    
    const x = Graphics.pageToCanvasX(event.pageX)
    const y = Graphics.pageToCanvasY(event.pageY)
    
    if (this._lastLight)
    {
        const mapInfo = LightingUtils.getMapInfo()
        this._lastLight.x = x + mapInfo.offsetX
        this._lastLight.y = y + mapInfo.offsetY
    }
    
    if (this._lastPanningPosition)
    {
        const panning = {
            x: (this._lastPanningPosition[0] - x) * .025,
            y: (this._lastPanningPosition[1] - y) * .025
        }
        
        if (panning.x > 0)
        {
            $gameMap.scrollRight(panning.x)
        }
        else
        {
            $gameMap.scrollLeft(-panning.x)
        }
        
        if (panning.y > 0)
        {
            $gameMap.scrollDown(panning.y)
        }
        else
        {
            $gameMap.scrollUp(-panning.y)
        }
        
        this._lastPanningPosition[0] = x
        this._lastPanningPosition[1] = y
    }
}
