attribute vec4 a_position;
uniform mat4 u_camera; // 应用到所有元素
uniform mat4 u_matrix; // 只对当前元素有效
void main(){
    gl_Position=u_camera * u_matrix * a_position;
}
