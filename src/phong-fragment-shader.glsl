precision mediump float;
// Receive color and position values
// TODO

varying vec3 v_normal;
varying vec3 v_color;
varying vec3 v_position;

//
varying vec3 normalInterp;  // Surface normal
//

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

  // v_position and v normal should be the intersection and the nromal 
  vec3 ambientColor= vec3(0.2, - 1.0, 1.0);
  vec3 diffuseColor= vec3(0.2, - 1.0, 1.0);
  vec3 specularColor= vec3(0.2, - 1.0, 1.0);
  vec3 N = normalize(normalInterp);
  vec3 L = normalize(lightPos - v_position);
    // Lambert's cosine law
  float lambertian = max(dot(N, L), 0.0);
  float specular = 0.0;
  if(lambertian > 0.0) {
    vec3 R = reflect(-L, N);      // Reflected light vector
    vec3 V = normalize(-v_position); // Vector to viewer
    // Compute the specular term
    float specAngle = max(dot(R, V), 0.0);
    specular = pow(specAngle, shininess);
  }
  gl_FragColor = vec4(Ka * ambientColor +
                      Kd * lambertian * diffuseColor +
                      Ks * specular * specularColor, 1.0);

  //
  // what is camera position ? missing for phong lightning calculation
}

