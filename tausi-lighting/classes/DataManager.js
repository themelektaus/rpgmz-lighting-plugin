DataManager._databaseFiles.push({ name: `$dataLighting`, src: `Lighting.json` })

const TausiLighting__DataManager__loadMapData = DataManager.loadMapData
DataManager.loadMapData = function()
{
    TausiLighting__DataManager__loadMapData.apply(this, arguments)
    LightingUtils.refresh()
}
