DataManager._databaseFiles.push({ name: `$dataLighting`, src: `Lighting.json` })

const DataManager__loadMapData = DataManager.loadMapData
DataManager.loadMapData = function()
{
    DataManager__loadMapData.apply(this, arguments)
    LightingUtils.refresh()
}
