TouchInput._onWheel = function(event)
{
    let scale = $gameScreen._zoomScale
    
    if (event.deltaY > 0)
    {
        // TODO: decrease zoom
    }
    else
    {
        // TODO: increase zoom
    }
    
    $gameScreen._zoomScale = scale
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
            this._tausiLighting_lastPanningPosition = [ x, y ]
        }
    }
}

const TausiLighting__Editor__TouchInput__onRightButtonDown = TouchInput._onRightButtonDown
TouchInput._onRightButtonDown = function(event)
{
    TausiLighting__Editor__TouchInput__onRightButtonDown.call(this, event)
    
    const x = Graphics.pageToCanvasX(event.pageX)
    const y = Graphics.pageToCanvasY(event.pageY)
    
    if (Graphics.isInsideCanvas(x, y))
    {
        this._tausiLighting_mousePressed = true
    }
}

const TausiLighting__Editor__TouchInput__onMouseUp = TouchInput._onMouseUp
TouchInput._onMouseUp = function(event)
{
    TausiLighting__Editor__TouchInput__onMouseUp.call(this, event)
    
    if (event.button == 0)
    {
        if (this.tausiLighting_lastSelectionMoved)
        {
            LightingUtils.dump()
        }
        
        if (this.tausiLighting_lastSelection)
        {
            if (this.tausiLighting_lastSelection.tausiLighting_createPropertiesEditor)
            {
                const $_properties = document.querySelector(`#properties`)
                $_properties.innerHTML = ``
                this.tausiLighting_lastSelection.tausiLighting_createPropertiesEditor($_properties)
            }
            delete this.tausiLighting_lastSelection
        }
        
        if (this.tausiLighting_lastSelectionMoved)
        {
            delete this.tausiLighting_lastSelectionMoved
        }
        
        SceneManager._scene?.invalidate?.call(SceneManager._scene)
    }
    
    if (event.button == 1)
    {
        delete this._tausiLighting_lastPanningPosition
    }
    
    if (event.button == 2)
    {
        this._tausiLighting_mousePressed = false
    }
}

const TausiLighting__Editor__TouchInput__clear = TouchInput.clear
TouchInput.clear = function(event)
{
    TausiLighting__Editor__TouchInput__clear.call(this, event)
    
    this._tausiLighting_mousePressed = false
}

const TausiLighting__Editor__TouchInput__onMouseMove = TouchInput._onMouseMove
TouchInput._onMouseMove = function(event)
{
    TausiLighting__Editor__TouchInput__onMouseMove.call(this, event)
    
    this.tausiLighting_lastMoveX = Graphics.pageToCanvasX(event.pageX)
    this.tausiLighting_lastMoveY = Graphics.pageToCanvasY(event.pageY)
    
    if (!this.tausiLighting_lastSelection && !this._tausiLighting_lastPanningPosition)
    {
        return
    }
    
    const x = this.tausiLighting_lastMoveX
    const y = this.tausiLighting_lastMoveY
    
    if (this.tausiLighting_lastSelection && this._moved)
    {
        if (this.tausiLighting_lastSelection.tausiLighting_EditorMove)
        {
            this.tausiLighting_lastSelection.tausiLighting_EditorMove(x, y)
            this.tausiLighting_lastSelectionMoved = true
        }
    }
    
    if (this._tausiLighting_lastPanningPosition)
    {
        const panning = {
            x: (this._tausiLighting_lastPanningPosition[0] - x) * .025,
            y: (this._tausiLighting_lastPanningPosition[1] - y) * .025
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
        
        this._tausiLighting_lastPanningPosition[0] = x
        this._tausiLighting_lastPanningPosition[1] = y
    }
}
