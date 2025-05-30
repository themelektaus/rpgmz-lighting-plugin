function LightingFilter()
{
    this.initialize(...arguments)
}

LightingFilter.prototype = Object.create(PIXI.Filter.prototype);
LightingFilter.prototype.constructor = LightingFilter;

LightingFilter.prototype.initialize = function()
{
    this.lightsCapacity = Math.max(2, ...($dataLighting.maps.map(x => x.lights.length)))
    
    PIXI.Filter.call(this, null, this._fragmentSrc())
}

LightingFilter.prototype.update = function()
{
    const mapInfo = LightingUtils.getMapInfo()
    
    const screenRect = {
        x: mapInfo.offsetX,
        y: mapInfo.offsetY,
        width: Graphics.width,
        height: Graphics.height
    }
    
    const viewportOffset = {
        x: -screenRect.x / screenRect.width,
        y: -screenRect.y / screenRect.height,
    }
    
    const lightTypes = []
    const lightColors = []
    const lightPositions = []
    const lightProperties1 = []
    const lightProperties2 = []
    const lightProperties3 = []
    
    const mapId = $gameMap.mapId()
    const map = $dataLighting.getMap(mapId)
    
    for (const i in map.lights)
    {
        let light = map.lights[i]
        
        if (light.enabled === false)
        {
            lightTypes.push(0)
            lightColors.push(0, 0, 0, 0)
            lightPositions.push(0, 0)
            lightProperties1.push(0, 0, 0, 0)
            lightProperties2.push(0, 0, 0, 0)
            lightProperties3.push(0, 0)
            continue
        }
        
        let x = light.x
        let y = light.y
        
        if (light.targetId)
        {
            x = light.x
            y = light.y
            light = map.getLightById(light.targetId)
        }
        
        lightTypes.push(light.type)
        lightColors.push(...light.color.map(x => x / 255))
        
        switch (light.type)
        {
            case Data_Lighting_GlobalLight.type:
                lightPositions.push(0, 0)
                lightProperties1.push(
                    light.weight / 100,
                    light.exposure / 100,
                    light.saturation / 100,
                    0
                )
                lightProperties2.push(
                    light.power[0] / 255,
                    light.power[1] / 255,
                    light.power[2] / 255,
                    light.power[3] / 255
                )
                lightProperties3.push(0, 0)
                break
            
            case Data_Lighting_PointLight.type:
                lightPositions.push(
                    viewportOffset.x + x / screenRect.width,
                    viewportOffset.y + y / screenRect.height
                )
                
                let radius = light.radius / 1200
                
                if (light.flickerStrength > 0 && light.flickerSpeed > 0)
                {
                    const flickerStrength = light.flickerStrength / 100
                    const flickerSpeed = light.flickerSpeed / 10
                    radius = LightingUtils.lerp(
                        LightingUtils.lerp(0, radius, 1 - flickerStrength),
                        LightingUtils.lerp(radius, radius * 2, flickerStrength),
                        (noise.perlin2(i * 100, Graphics.frameCount / 60 * flickerSpeed) + 1) / 2
                    )
                }
                
                lightProperties1.push(
                    light.intensity * .24,
                    radius,
                    light.smoothness / 100,
                    0
                )
                lightProperties2.push(0, 0, 0, 0)
                lightProperties3.push(0, 0)
                break
            
            case Data_Lighting_SpotLight.type:
                lightPositions.push(
                    viewportOffset.x + x / screenRect.width,
                    viewportOffset.y + y / screenRect.height
                )
                lightProperties1.push(
                    light.intensity * (500 / light.distance),
                    light.width / 100,
                    light.spread / 100,
                    light.spreadFade / 100
                )
                lightProperties2.push(
                    light.distance / 1000,
                    light.distanceFadeIn / 1000,
                    light.distanceFadeOut / 1000,
                    0
                )
                const radians = light.direction * (Math.PI / 180)
                lightProperties3.push(
                    Math.cos(radians),
                    Math.sin(radians)
                )
                break
        }
    }
    
    while (lightTypes.length < this.lightsCapacity)
    {
        lightTypes.push(0)
        lightColors.push(0, 0, 0, 0)
        lightPositions.push(0, 0)
        lightProperties1.push(0, 0, 0, 0)
        lightProperties2.push(0, 0, 0, 0)
        lightProperties3.push(0, 0)
    }
    
    this.uniforms.screenRect = screenRect
    this.uniforms.lightTypes = lightTypes
    this.uniforms.lightColors = lightColors
    this.uniforms.lightPositions = lightPositions
    this.uniforms.lightProperties1 = lightProperties1
    this.uniforms.lightProperties2 = lightProperties2
    this.uniforms.lightProperties3 = lightProperties3
}

LightingFilter.prototype._fragmentSrc = function()
{
    return `
        varying vec2 vTextureCoord;
        uniform sampler2D uSampler;
        
        uniform vec4 screenRect;
        
        uniform int lightTypes[${this.lightsCapacity}];
        uniform vec4 lightColors[${this.lightsCapacity}];
        uniform vec2 lightPositions[${this.lightsCapacity}];
        uniform vec4 lightProperties1[${this.lightsCapacity}];
        uniform vec4 lightProperties2[${this.lightsCapacity}];
        uniform vec2 lightProperties3[${this.lightsCapacity}];
        
        void main()
        {
            vec4 color = texture2D(uSampler, vTextureCoord);
            float a = color.a;
            
            float globalLightWeight = 1.0;
            vec3 globalLight = color.rgb;
            vec3 totalLight = vec3(1.0, 1.0, 1.0);
            
            vec4 lightPower = vec4(-1.0, -1.0, -1.0, 0.0);
            
            for (int i = 0; i < ${this.lightsCapacity}; i++)
            {
                int lightType = lightTypes[i];
                vec4 lightColor = lightColors[i];
                
                if (lightType == ${Data_Lighting_GlobalLight.type})
                {
                    globalLightWeight = lightProperties1[i].x;
                    float lightExposure = lightProperties1[i].y;
                    float lightSaturation = lightProperties1[i].z;
                    
                    lightPower.rgb = (abs(lightPower.rgb) * lightProperties2[i].rgb) * lightProperties2[i].a;
                    
                    vec3 c = globalLight;
                    
                    c *= mix(vec3(1.0, 1.0, 1.0), lightColor.rgb, lightColor.a);
                    
                    float g = dot(c, vec3(.299, .587, .114));
                    c = mix(vec3(g, g, g), c, lightSaturation + 1.0);
                    c += (c + vec3(c.r * .2126, c.g * .7152, c.b * .0722)) * lightExposure;
                    
                    globalLight = c;
                    
                    continue;
                }
                
                if (lightType == ${Data_Lighting_PointLight.type})
                {
                    vec2 position = vTextureCoord * screenRect.zw / 816.0;
                    vec2 lightPosition = lightPositions[i] * screenRect.zw / 816.0;
                    
                    float lightIntensity = lightProperties1[i].x;
                    float lightRadius = lightProperties1[i].y;
                    float lightSmoothness = lightProperties1[i].z;
                    
                    float light = lightRadius - distance(position, lightPosition);
                    
                    lightIntensity /= lightRadius;
                    lightSmoothness = pow(light * lightIntensity, lightSmoothness) / lightSmoothness;
                    
                    light *= lightIntensity * lightSmoothness;
                    
                    vec3 add = lightColor.rgb * max(0.0, light) * lightColor.a;
                    
                    totalLight += add;
                    
                    continue;
                }
                    
                if (lightType == ${Data_Lighting_SpotLight.type})
                {
                    vec2 position = vTextureCoord * screenRect.zw / 816.0;
                    vec2 lightPosition = lightPositions[i] * screenRect.zw / 816.0;
                    
                    float lightIntensity = lightProperties1[i].x;
                    float lightWidth = lightProperties1[i].y;
                    float lightSpread = lightProperties1[i].z;
                    float lightSpreadFade = lightProperties1[i].w;
                    
                    float lightDistance = lightProperties2[i].x;
                    float lightDistanceFadeIn = lightProperties2[i].y;
                    float lightDistanceFadeOut = lightProperties2[i].z;
                    
                    vec2 lightDirection = lightProperties3[i].xy;
                    
                    lightPosition.xy -= lightDirection * lightWidth;
                    
                    vec2 diff = position - lightPosition;
                    float diffLength = length(diff) - lightWidth;
                    
                    if (diffLength > 0.0 && diffLength < lightDistance)
                    {
                        float spot = dot(lightDirection, normalize(diff));
                        
                        if (spot > 1.0 - lightSpread && spot <= 1.0)
                        {
                            float fade = max(0.0, spot * lightIntensity) * lightColor.a * lightDistance;
                            fade *= clamp(max(0.0, 1.0 - ((1.0 - spot) * (1.0 / lightSpread))) * (1.0 / lightSpreadFade), 0.0, 1.0);
                            fade *= clamp((diffLength - lightDistanceFadeIn) / lightDistanceFadeIn, 0.0, 1.0);
                            fade *= clamp((lightDistance - lightDistanceFadeOut - diffLength) / lightDistanceFadeOut, 0.0, 1.0);
                            
                            vec3 add = lightColor.rgb * fade;
                            
                            totalLight += add;
                        }
                    }
                    
                    continue;
                }
            }
            
            color.rgb = mix(
                color.rgb,
                max(vec3(.0001, .0001, .0001), globalLight) * mix(
                    vec3(1.0, 1.0, 1.0),
                    totalLight,
                    max(vec3(.005, .005, .005), lightPower.rgb)
                ),
                globalLightWeight
            );
            
            gl_FragColor = color;
        }
    `
}
