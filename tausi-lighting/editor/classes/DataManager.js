const TausiLighting__Editor__DataManager__makeEmptyMap = DataManager.makeEmptyMap
DataManager.makeEmptyMap = function()
{
    TausiLighting__Editor__DataManager__makeEmptyMap.apply(this, arguments)
    
    $dataMap.width = 17
    $dataMap.height = 13
}
