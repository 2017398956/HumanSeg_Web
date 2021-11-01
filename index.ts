import * as humanseg from '@paddlejs-models/humanseg';



async function load() {
    await humanseg.load();
    document.getElementById('loading')!.style.display = 'none';
}

load();
const canvas1 = document.getElementById('demo1') as HTMLCanvasElement;
const canvas2 = document.getElementById('demo2') as HTMLCanvasElement;
const video = document.getElementById('video') as HTMLVideoElement;

const ctx = canvas1.getContext('2d');
const backgroundImage = new Image();
backgroundImage.src = './bg/bg.jpg';
backgroundImage.onload = function () {ctx.drawImage(backgroundImage, 0, 0, canvas1.width, canvas1.height);};

var snapshotCanvas:HTMLCanvasElement;
var snapshotCtx:CanvasRenderingContext2D;
var snapshotImg:HTMLImageElement;

// async function run(input) {
async function run() {
    var runnable = 0;
    while (runnable == 0) {
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
            snapshotImg = document.getElementById('temp') as HTMLImageElement;
        }
        snapshotCtx.drawImage(video, 0, 0, snapshotCanvas.width, snapshotCanvas.height);
        snapshotImg.src = snapshotCanvas.toDataURL('image/jpg');
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
        const humanImg = document.getElementById('image') as HTMLImageElement;
        humanImg.src = evt.target.result as any;
        humanImg.onload = function () {
            // run(humanImg);
            run();
        };
    };
    reader.readAsDataURL(file.files[0]);
}

// selectImage
document.getElementById('uploadImg').onchange = function () {
    selectImage(this);
};
