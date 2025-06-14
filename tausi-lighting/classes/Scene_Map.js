const TausiLighting__Scene_Map__onMapLoaded = Scene_Map.prototype.onMapLoaded
Scene_Map.prototype.onMapLoaded = function()
{
    LightingUtils.patchEvents()
    
    TausiLighting__Scene_Map__onMapLoaded.apply(this, arguments)
}
