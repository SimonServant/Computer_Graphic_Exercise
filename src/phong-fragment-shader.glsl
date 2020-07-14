precision mediump float;
// Receive color and position values
// TODO

varying vec3 v_normal;
varying vec3 v_color;
varying vec3 v_position;


const vec3 lightPos = vec3(0.2, - 1.0, 1.0);
const float shininess = 16.0;

vec4 phong( vec3 color){
  return vec4(color,1.0);
}

void main(void) {
  vec4 phong_color = phong(v_color);
  gl_FragColor = vec4(phong_color);
  // Phong lighting calculation

  // What is camera position

  const float Ka = 0.5;
  const float Kd = 0.6;
  const float Ks = 0.4; 
  const float Ke = 4.0;
}

