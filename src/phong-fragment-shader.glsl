precision mediump float;
// Receive color and position values
// TODO

varying vec3 v_normal;
varying vec3 v_color;

const vec3 lightPos = vec3(0.2, - 1.0, 1.0);
const float shininess = 16.0;

void main(void) {
  gl_FragColor = vec4(v_color,1.0);
  // Phong lighting calculation
  // TODO
}