precision mediump float;
// TODO [exercise 9]
varying vec3 v_color;

void main(void) {
  // gl_FragColor = vec4(1.000,0.040,0.059,1.000);
  // TODO [exercise 9]
  gl_FragColor = vec4(v_color,1.0);
}
