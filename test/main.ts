import {playGif, Point2D} from '../index'
let canvas: HTMLCanvasElement = document.createElement('canvas')
canvas.width = 960
canvas.height = 630
document.body.appendChild(canvas)
let x = 0, y = 0
let emoticons = [1, 7, 13, 19, 25, 31, 37, 43, 100, 109].concat([2, 8, 14, 20, 26, 32, 38, 44, 101, 110]).concat([3, 9, 15, 21, 27, 33, 39, 45, 102, 111]).concat([4, 10, 16, 22, 28, 34, 40, 46, 103, 112]).concat([5, 11, 17, 23, 29, 35, 41, 47, 104, 113]).concat([6, 12, 18, 24, 30, 36, 42, 48, 105, 114])
let padding = 50
for (let i = 0; i < emoticons.length; i++) {
    let cb = function (width, height) {
        console.log(width, height)
    }
    playGif('gif/' + emoticons[i] + '.gif', canvas, new Point2D(i % 10 * padding, Math.floor(i / 10) * padding), cb)
}