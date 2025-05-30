Graphics._defaultStretchMode = function()
{
    return false
}

Graphics._createCanvas = function()
{
    this._canvas = document.createElement(`canvas`)
    this._canvas.id = `gameCanvas`
    this._updateCanvas()
    document.querySelector(`#gameCanvasContainer`).appendChild(this._canvas)
}

Graphics._centerElement = function(element)
{
    const width = element.width * this._realScale
    const height = element.height * this._realScale
    element.style.width = `${width}px`
    element.style.height = `${height}px`
}
