Graphics._defaultStretchMode = function()
{
    return false
}

Graphics._createCanvas = function()
{
    this._canvas = document.createElement(`canvas`)
    this._canvas.id = `gameCanvas`
    this._updateCanvas()
    
    this._canvasScreenshot = document.createElement(`div`)
    this._canvasScreenshot.id = `gameCanvasScreenshot`
    this.hideGameCanvasScreenshot()
    
    const $_container = document.querySelector(`#gameCanvasContainer`)
    $_container.appendChild(this._canvas)
    $_container.appendChild(this._canvasScreenshot)
}

Graphics._centerElement = function(element)
{
    const width = element.width * this._realScale
    const height = element.height * this._realScale
    element.style.width = `${width}px`
    element.style.height = `${height}px`
}

Graphics.showGameCanvasScreenshot = function()
{
    const bitmap = SceneManager.snap()
    const url = bitmap.canvas.toDataURL(`png`)
    bitmap.destroy()
    
    const $_gameCanvas = document.querySelector(`#gameCanvas`)
    
    const rect = $_gameCanvas.getBoundingClientRect()
    
    const style = this._canvasScreenshot.style
    style.left = `${rect.left}px`
    style.top = `${rect.top}px`
    style.width = `${rect.width}px`
    style.height = `${rect.height}px`
    style.backgroundImage = `url(${url})`
    style.display = null
}

Graphics.hideGameCanvasScreenshot = function()
{
    this._canvasScreenshot.style.display = `none`
}
