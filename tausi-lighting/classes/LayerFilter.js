function LayerFilter()
{
    this.initialize(...arguments)
}

LayerFilter.prototype = Object.create(PIXI.Filter.prototype);
LayerFilter.prototype.constructor = LayerFilter;

LayerFilter.prototype.initialize = function(sprite)
{
    this.sprite = sprite
    
    PIXI.Filter.call(this, null, this._fragmentSrc())
}

LayerFilter.prototype.update = function()
{
    const zoom = $gameScreen.zoomScale()
    
    const offset = [
        LightingUtils.getMapOffsetX() / (Graphics.width / zoom),
        LightingUtils.getMapOffsetY() / (Graphics.height / zoom),
        LightingUtils.getMapWidth() / (Graphics.width / zoom),
        LightingUtils.getMapHeight() / (Graphics.height / zoom)
    ]
    
    this.uniforms.map = this.sprite.bitmap.baseTexture
    this.uniforms.offset = offset
    this.uniforms.weight = this.sprite.mapObject.enabled
        ? this.sprite.mapObject.get(`opacity`) / 255 * (this.sprite.mapObject.get(`power`) * .04)
        : 0
}

LayerFilter.prototype._fragmentSrc = function()
{
    return `
        varying vec2 vTextureCoord;
        uniform sampler2D uSampler;
        
        uniform sampler2D map;
        uniform vec4 offset;
        uniform float weight;
        
        float prepare(float color, float alpha)
        {
            return mix(0.5, color / max(0.00001, alpha), alpha);
        }
        
        vec3 prepare(vec3 color, float alpha)
        {
            return vec3(
                prepare(color.r, alpha),
                prepare(color.g, alpha),
                prepare(color.b, alpha)
            );
        }
        
        float overlay(float base, float blend)
        {
            return base < 0.5
                ? (2.0 * base * blend)
                : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend));
        }
        
        vec3 overlay(vec3 base, vec3 blend)
        {
            return vec3(
                overlay(base.r, blend.r),
                overlay(base.g, blend.g),
                overlay(base.b, blend.b)
            );
        }
        
        void main()
        {
            vec4 color = texture2D(uSampler, vTextureCoord);
            vec4 mapColor = texture2D(map, (vTextureCoord + offset.xy) / offset.zw);
            color.rgb = mix(color.rgb, overlay(color.rgb, prepare(mapColor.rgb, mapColor.a)), weight);
            gl_FragColor = color;
        }
    `
}
