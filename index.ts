import * as humanseg from '@paddlejs-models/humanseg';



async function load() {
    await humanseg.load();
    document.getElementById('loading')!.style.display = 'none';
}

load();

var canSeg = true;
const humanImg = document.getElementById('humanImg') as HTMLImageElement ;
const canvas1 = document.getElementById('demo1') as HTMLCanvasElement;
const canvas2 = document.getElementById('demo2') as HTMLCanvasElement;
const video = document.getElementById('video') as HTMLVideoElement;

const ctx = canvas1.getContext('2d');
const backgroundImage = new Image();
backgroundImage.src = './bg/bg.jpg';
// 先将背景图绘制到 canvas1 上
backgroundImage.onload = function () {ctx.drawImage(backgroundImage, 0, 0, canvas1.width, canvas1.height);};

var snapshotCanvas:HTMLCanvasElement;
var snapshotCtx:CanvasRenderingContext2D;
var snapshotImg:HTMLImageElement;

// async function run(input) {
async function run() {
    // 用于单张截图测试
    var runnable = 0;
    while (runnable == 0 && canSeg) {
        // runnable++;
        if(snapshotCanvas == null){
            snapshotCanvas = document.createElement('canvas');
            var width = 640;
            var height = 480;
            var scale =1;
            snapshotCanvas.width = width * scale;
            snapshotCanvas.height = height * scale;
            snapshotCtx = snapshotCanvas.getContext('2d');
            // snapshotImg = document.createElement('img');
            snapshotImg = document.getElementById('snapshotImg') as HTMLImageElement;
        }
        snapshotCtx.drawImage(video, 0, 0, snapshotCanvas.width, snapshotCanvas.height);
        snapshotImg.src = snapshotCanvas.toDataURL('image/jpg');
        // FIXME 这里要等待 1ms 否则会导致无法正确分割
        await(1);
        // input = snapshotImg;
        const {data} = await humanseg.getGrayValue(snapshotImg);
        humanseg.drawHumanSeg(canvas1, data);
        humanseg.drawMask(canvas2, data, true);
    }
}

function selectImage(file) {
    if (!file.files || !file.files[0]) {
        return;
    }
    const reader = new FileReader();
    reader.onload = function (evt) {
        humanImg.src = evt.target.result as any;
        humanImg.onload = function () {
            // run(humanImg);
            canSeg = true
            run();
        };
    };
    reader.readAsDataURL(file.files[0]);
}

// selectImage
document.getElementById('uploadImg').onchange = function () {
    selectImage(this);
};

document.getElementById('stop').onclick = function (){
    (video.srcObject as MediaStream).getTracks()[0].stop();
    canSeg = false;
};

document.getElementById('start').onclick = function(){
    canSeg = true;
    run();
};
