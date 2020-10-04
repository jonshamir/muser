precision highp float;

varying vec2 vUv;
varying vec4 vColor;

void main() {
	vec4 color = vec4(0.0);
	vec2 uv = vUv;

	// circle
	float border = 0.48;
	float radius = 0.5;
	float dist = radius - distance(uv, vec2(0.5));
	float t = step(0.0, dist);

	// final color
	color = vec4(vColor.xyz, vColor.w*t);

	gl_FragColor = color;
}
