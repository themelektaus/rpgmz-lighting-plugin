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
    
    const w = Graphics.width / zoom
    const h = Graphics.height / zoom
    
    const offset = [
        LightingUtils.getMapOffsetX() / w,
        LightingUtils.getMapOffsetY() / h,
        LightingUtils.getMapWidth() / w,
        LightingUtils.getMapHeight() / h
    ]
    
    const enabled = this.sprite.mapObject.enabled
    
    this.uniforms.map = this.sprite.bitmap.baseTexture
    this.uniforms.offset = offset
    
    const opacity = this.sprite.mapObject.get(`opacity`) / 255
    
    const shaderOverlay = this.sprite.mapObject.get(`shaderOverlay`) / 100
    
    this.uniforms.weight = enabled
        ? opacity * (this.sprite.mapObject.get(`power`) * LightingUtils.lerp(.01, .04, Math.abs(shaderOverlay)))//LightingUtils.lerp(.01, .04, Math.abs(shaderOverlay)))
        : 0
    
    const noiseScale = this.sprite.mapObject.get(`noiseScale`) / 100
    
    this.uniforms.shaderOverlay = shaderOverlay
    this.uniforms.res = [ w / noiseScale, h / noiseScale ]
    this.uniforms.noise = this.sprite.mapObject.get(`noise`) / 100
    
    const t = Graphics.frameCount / 60 / noiseScale
    
    this.uniforms.time = [
        this.sprite.mapObject.get(`noiseSpeedX`) / 10 * t,
        this.sprite.mapObject.get(`noiseSpeedY`) / 10 * t
    ]
}

LayerFilter.prototype._fragmentSrc = function()
{
    return `
        varying vec2 vTextureCoord;
        uniform sampler2D uSampler;
        
        uniform sampler2D map;
        uniform vec4 offset;
        uniform float weight;
        
        uniform float shaderOverlay;
        uniform vec2 res;
        uniform float noise;
        uniform float noiseScale;
        uniform vec2 time;
        
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
        
        float rand(vec2 n)
        {
            return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
        }
        
        float getNoise(vec2 p)
        {
            vec2 ip = floor(p);
            
            vec2 u = fract(p);
            
            u = u * u * (3.0 - 2.0 * u);
            
            float res = mix(
                mix(
                    rand(ip),
                    rand(ip + vec2(1.0, 0.0)),
                    u.x
                ),
                mix(
                    rand(ip + vec2(0.0, 1.0)),
                    rand(ip + vec2(1.0, 1.0)),
                    u.x
                ),
                u.y
            );
            
            return res * res;
        }
        
        void main()
        {
            vec2 p = (vTextureCoord + offset.xy) / (816.0 / res);
            vec2 uv = p * vec2(res.x / res.y, 1.0) + time * .1;
            
            float f = 0.0;
            
            uv *= 8.0;
            
            mat2 m = mat2(1.6, 1.2, -1.2,  1.6);
            
            f  = 0.5000 * getNoise(uv);
            uv = m * uv;
            
            f += 0.2500 * getNoise(uv);
            uv = m * uv;
            
            f += 0.1250 * getNoise(uv);
            uv = m * uv;
            
            f += 0.0625 * getNoise(uv);
            uv = m * uv;
            
            vec4 color = texture2D(uSampler, vTextureCoord);
            vec4 mapColor = texture2D(map, (vTextureCoord + offset.xy) / offset.zw);
            
            vec3 newColor = prepare(mapColor.rgb, mapColor.a);
            if (shaderOverlay < 0.0)
            {
                newColor = mix(newColor, color.rgb - newColor, -shaderOverlay);
            }
            else
            {
                newColor = mix(newColor, overlay(color.rgb, newColor), shaderOverlay);
            }
            
            color.rgb = mix(
                color.rgb,
                mix(
                    newColor,
                    mix(color.rgb, newColor, f * 2.0),
                    noise
                ),
                weight * mapColor.a
            );
            
            gl_FragColor = color;
        }
    `
}
