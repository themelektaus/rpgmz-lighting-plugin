Scene_Boot.prototype.start = function()
{
    Scene_Base.prototype.start.apply(this, arguments)
    DataManager.setupNewGame()
    SceneManager.goto(Scene_LightingEditor)
}
