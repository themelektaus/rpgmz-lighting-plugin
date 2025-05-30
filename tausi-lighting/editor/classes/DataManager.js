const DataManager__makeEmptyMap = DataManager.makeEmptyMap
DataManager.makeEmptyMap = function()
{
    DataManager__makeEmptyMap.apply(this, arguments)
    $dataMap.width = 17
    $dataMap.height = 13
}
