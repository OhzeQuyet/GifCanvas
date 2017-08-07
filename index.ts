declare function require(path: string): any
let gif = require('./src/gif.js')
let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D
/**
 * @desc play Gif image in HTML5 canvas
 * @param gifPath: relative path of image file from client
 * @param canvas: where Gif is drawed
 * @param position: where Gif is put
 * @param cb: callback to be invoked after playing Gif, can accept 2 parameters:
 *  First: width of gif to be drawed
 *  Second: height of gif to be drawed
 */
export function playGif(gifPath: string, canvas: HTMLCanvasElement, position: Point2D, cb?: Function) {
    let httpRequest = new XMLHttpRequest()
    httpRequest.overrideMimeType('text/plain; charset=x-user-defined')
    httpRequest.onload = function (e) {
        processGif(e, canvas, position, cb)
    }
    httpRequest.open('GET', gifPath, true)
    httpRequest.send()
}
/**
 * @desc get gif source and play it in canvas
 */
function processGif(e, canvas: HTMLCanvasElement, position: Point2D, cb: Function) {
    let httpReq = e.target
    let stream = new gif.Stream(httpReq.responseText)
    let frame
    let transparency
    let lastDisposalMethod
    let hdr
    let tmpCanvas = document.createElement('canvas');
    if (!ctx) {
        ctx = canvas.getContext('2d')
    }
    let doImg = function (img) {
        if (!frame) frame = tmpCanvas.getContext('2d')
        let ct = img.lctFlag ? img.lct : hdr.gct
        let cData = frame.getImageData(img.leftPos, img.topPos, img.width, img.height)
        img.pixels.forEach(function (pixel, i) {
            // cData.data === [R,G,B,A,...]
            if (transparency !== pixel) { // This includes null, if no transparency was defined.
                cData.data[i * 4] = ct[pixel][0];
                cData.data[i * 4 + 1] = ct[pixel][1];
                cData.data[i * 4 + 2] = ct[pixel][2];
                cData.data[i * 4 + 3] = 255; // Opaque.
            } else {
                if (lastDisposalMethod === 2 || lastDisposalMethod === 3) {
                    cData.data[i * 4 + 3] = 0; // Transparent.
                }
            }
            frame.putImageData(cData, img.leftPos, img.topPos);
        })
    }
    let doHdr = function (_hdr) {
        hdr = _hdr;
        tmpCanvas.width = hdr.width;
        tmpCanvas.height = hdr.height;
    }
    let delay
    let disposalMethod
    let clear = function () {
        transparency = null;
        delay = null;
        lastDisposalMethod = disposalMethod;
        disposalMethod = null;
        frame = null;
    }
    let doGCE = function (gce) {
        pushFrame();
        clear();
        transparency = gce.transparencyGiven ? gce.transparencyIndex : null;
        delay = gce.delayTime;
        disposalMethod = gce.disposalMethod;
    }
    let frames = []
    let pushFrame = function () {
        if (!frame) return;
        frames.push({
            data: frame.getImageData(0, 0, hdr.width, hdr.height), delay: delay
        });
    }
    let i = -1;
    let putFrame = function () {
        ctx.putImageData(frames[i].data, position.x, position.y);
    }
    let stepFrame = function () { // XXX: Name is confusing.
        i = (i + 1 + frames.length) % frames.length;
        putFrame();
    }
    let doPlay = function () {
        step()
    }
    let handler = {
        hdr: doHdr, gce: doGCE, img: doImg, eof: function () {
            pushFrame();
            doPlay()
            if (cb) {
                cb(hdr.width, hdr.height)
            }
        }
    }
    let step = function () {
        stepFrame()
        let delay = frames[i].delay * 10;
        if (!delay || delay < 100) delay = 100;
        setTimeout(step, delay)
    }
    gif.parseGIF(stream, handler)
}
/**
 * @desc: represent a point in 2D space
 */
export class Point2D {
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    x: number
    y: number
}