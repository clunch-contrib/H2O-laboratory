import { Component } from 'nefbl'

// 引入着色器程序
import vertexShader from './vertex-shader.c'
import fragmentShader from './fragment-shader.c'

let image3D = require('image3d')
let ThreeGeometry = require('three-geometry')

import style from './index.scss'
import template from './index.html'

@Component({
    selector: "app-root",
    template,
    styles: [style]
})
export default class {

    $mounted() {

        let image3d = new image3D(document.getElementsByTagName('canvas')[0], {
            "vertex-shader": vertexShader,
            "fragment-shader": fragmentShader,
            "depth": true
        })

        let painter = image3d.Painter() // 画笔
        let buffer = image3d.Buffer() // 缓冲区
        let cammera = image3d.Camera({ size: 250 }) // 相机

        setInterval(() => {

            // 首先，每次围绕x轴旋转一点点
            image3d.setUniformMatrix("u_camera", cammera.rotateBody(0.02, -1, 0, 0, 1, 0, 0).value())

            // 对于变换矩阵，只有个别需要，因此先使用单位矩阵E初始化
            image3d.setUniformMatrix("u_matrix", [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])

            // 然后，借助三维坐标运算库来绘制元素

            let threeGeometry = ThreeGeometry({
                precision: 15
            })

            // 设置为绘制氧原子颜色
            image3d.setUniformFloat("u_color", 1, 0.2, 0.2, 1.0) // 颜色

            // 绘制氧原子
            threeGeometry.sphere(function (data) {
                buffer.write(new Float32Array(data.points)).use('a_position', 3, 3, 0) // 坐标数据
                painter.drawStripTriangle(0, data.length) // 绘制
            }, 0, 70, 0, 50)

            // 设置为绘制氢原子颜色
            image3d.setUniformFloat("u_color", 0.6, 0.6, 0.6, 1.0)

            // 绘制氢原子（左）
            threeGeometry.sphere(function (data) {
                buffer.write(new Float32Array(data.points)).use('a_position', 3, 3, 0)
                painter.drawStripTriangle(0, data.length)
            }, -70, 0, 0, 36)

            // 绘制氢原子（右）
            threeGeometry.sphere(function (data) {
                buffer.write(new Float32Array(data.points)).use('a_position', 3, 3, 0)
                painter.drawStripTriangle(0, data.length)
            }, 70, 0, 0, 36)

            // 设置为绘制化学键颜色
            image3d.setUniformFloat("u_color", 0.2, 0.3, 0.1, 0.4)

            //  绘制化学键（左）

            image3d.setUniformMatrix("u_matrix", image3d.Camera().rotateBody(Math.PI * 0.25, -70, 0, 0, -70, 0, -1).value())

            threeGeometry.prism(function (data) {
                buffer.write(new Float32Array(data.points)).use('a_position', 3, 3, 0)
                painter['draw' + data.methods](0, data.length)

            }, -70, 0, 0, 16, 100, 10)

            //  绘制化学键（右）

            image3d.setUniformMatrix("u_matrix", image3d.Camera().rotateBody(Math.PI * 0.25, 70, 0, 0, 70, 0, 1).value())

            threeGeometry.prism(function (data) {
                buffer.write(new Float32Array(data.points)).use('a_position', 3, 3, 0)
                painter['draw' + data.methods](0, data.length)

            }, 70, 0, 0, 16, 100, 10)

        }, 70)

    }

}
