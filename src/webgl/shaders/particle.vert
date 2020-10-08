precision highp float;

attribute float pindex;
attribute vec3 position;
attribute vec3 offset;
attribute vec2 uv;
attribute float angle;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;
uniform float uTimeScale;
uniform float uRandom;
uniform float uDepth;
uniform float uSize;
uniform vec4 uColor;

varying vec2 vUv;
varying vec4 vColor;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

float rand(float n, float alpha) {
	return fract(sin(n) * alpha);
}

float fadeInOut(float t) {
	return -pow((2.0 * (t - 0.5)), 6.0) + 1.0;
}

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
	vUv = uv;

	// Generate random numbers [-1,1]
	float rand1 = 2.0 * (rand(pindex, 43758.5453123) - 0.5);
	float rand2 = 2.0 * (rand(pindex, 23718.5253123) - 0.5);
	float rand3 = 2.0 * (rand(pindex, 11218.5153123) - 0.5);

	// Animation timer from 0 to 1
	float t = mod(rand1 + 0.05 * uTime * uTimeScale, 1.0);

	// Randomise color
	vec3 colorHSV = rgb2hsv(uColor.xyz);
	colorHSV[0] = mod(colorHSV[0] + 0.03 * rand1, 1.0); // hue
	colorHSV[2] = clamp(colorHSV[2] + 0.1 * rand2, 0.0, 1.0); // value (brightness)
	vColor = vec4(hsv2rgb(colorHSV), uColor.w);

	// displacement
	vec3 displaced = offset;
	displaced += t * normalize(vec3(rand1, rand2, rand3));

	// particle size
	float psize = fadeInOut(t) * uSize * (1.0 + (0.5 + 0.5 * rand2));

	// final position
	vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
	mvPosition.xyz += position * psize;
	vec4 finalPosition = projectionMatrix * mvPosition;

	gl_Position = finalPosition;
}
