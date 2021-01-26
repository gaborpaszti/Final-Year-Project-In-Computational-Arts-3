/* jshint esversion: 8 */

// ml5.js: Pose Regression
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/Courses/ml5-beginners-guide/7.3-pose-regression.html
// https://youtu.be/lob74HqHYJ0

// All code: https://editor.p5js.org/codingtrain/sketches/JI_j-PiLk

// Separated into three sketches
// 1: Data Collection: https://editor.p5js.org/codingtrain/sketches/Fe1ZNKw1Z
// 2: Model Training: https://editor.p5js.org/codingtrain/sketches/KLrIligVq
// 3: Model Deployment: https://editor.p5js.org/codingtrain/sketches/nejAYCA6N


// Altered the code from above mentioned source for the Machine Learning Final Project Assignment

// Added pixel processing, sound "synthesis", and my own training model for pose estimation with regression.
// I left the training, making a model and loading model parts of the code in this sketch, as a means of further experimentation.
// gpasz001@gold.ac.uk – Gabor Paszti

//Please wait until the scetch fully loads, as sometimes the sound hangs if we move the mouse before it loads the content. Reload id=f necessary. 


//// pose estimation variables
let poseNet;
let pose;
let skeleton;

//// model variable
let brain;
let state = 'waiting';

//// slider variable
let rSlider, gSlider, bSlider;

//// vieo variables
let video;

//// sound media variables 
let playing = true;
let song0;
var song;
var song1;
var song2;
var song3;
var song4;

//// dinamics variable
var ripple = 10;

//// pixel manipulatin variable
var vScale = 6; ///Changing this variable, changes the size of the "pixel" rectangles. must be divided without reminder from canvas size.

//// TIMER
function delay(time) {
    return new Promise((resolve, reject) => {
        if (isNaN(time)) {
            reject(new Error('delay requires a valid number.'));
        } else {
            setTimeout(resolve, time);
        }
    });
}

//// TRAIN MODEL - Only active when training a model
//function trainModel() {
//    brain.normalizeData();
//    let options = {
//        epochs: 50
//    }
//    brain.train(options, finishedTraining);
//}


//// "INTERFACE" - for training only
async function keyPressed() {
    if (key == 's') {
        brain.saveData();
    } else if (key == 't') {
        trainModel();
    } else if (key == 'd') {

        let r = rSlider.value();
        let g = gSlider.value();
        let b = bSlider.value();
        targetColor = [r, g, b];

        console.log(r, g, b);

        await delay(5000);
        console.log('collecting');
        state = 'collecting';

        await delay(15000);
        console.log('not collecting');
        state = 'waiting';
    }

}

function preload() {

    //// SOUND track - loading sounds here.
    soundFormats('mp3', 'wav');
    //// Load a sound file
    song0 = loadSound('assets/TempoNo.33.mp3');
    song0.rate(1);
    song0.amp(0.5);

    song = loadSound('assets/birdSong.mp3');
    song.setVolume(0.2);

    song1 = loadSound('assets/eBass.wav');
    song1.setVolume(0.0);

    song2 = loadSound('assets/swoosh.wav');
    song2.setVolume(0.0);

    /// The morese code says: Delete. Ignore. Delete. Delete. Ignore. Delete. Ignore. Ignore.
    song3 = loadSound('assets/morsecode_500.wav');
    //song3.amp(0.07);
    song3.amp(0.97);
    song3.rate(74.6);

    song4 = loadSound('assets/morsecode_1000.wav');
    song4.amp(0.01);


}



function setup() {

    frameRate(random(60)); //// This is one way to controll the speed of the scetch, which gives different aesthetics to the code 

    createCanvas(1080, 740);
    //createCanvas(640, 480);
    pixelDensity(1);

    //// SLiders - for colours - connected to key poseNet
    rSlider = createSlider(0, 255, 0);
    gSlider = createSlider(0, 255, 0);
    bSlider = createSlider(0, 255, 0);


    //// VIDEO
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();

    //// LOADING POSNET
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);

    //// INPUT - OUTPUT PARAMETER SETTING
    let options = {
        inputs: 34,
        //// simplified way of having data written on the jason file, without label
        //outputs: 3,  
        //// avtive if jason file to display the label of each parameter(name of the output)
        outputs: ['red', 'green', 'blue'],
        task: 'regression',
        debug: true
    }

    brain = ml5.neuralNetwork(options);

    //// LOAD TRAINING DATA -  2nd step
    //brain.loadData('color_poses.json', dataReady);

    //// LOAD PRETRAINED MODEL - 3rd step
    const modelInfo = {
        model: 'model/model.json',
        metadata: 'model/model_meta.json',
        weights: 'model/model.weights.bin',
    };
    brain.load(modelInfo, brainLoaded);

}


function dataReady() {
    trainModel();
}


function brainLoaded() {
    console.log('pose classification ready!');
    predictColor();
}


function finishedTraining() {
    brain.save();
    predictColor();
}


function predictColor() {
    if (pose) {
        console.log('predicting');
        let inputs = [];
        for (let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            inputs.push(x);
            inputs.push(y);
        }
        brain.predict(inputs, gotResult);
    } else {
        setTimeout(predictColor, 100);
    }
}


function gotResult(error, results) {
    let r = results[0].value;
    let g = results[1].value;
    let b = results[2].value;
    rSlider.value(r);
    gSlider.value(g);
    bSlider.value(b);
    predictColor();
}


function gotPoses(poses) {
    if (poses.length > 0) {
        pose = poses[0].pose;
        skeleton = poses[0].skeleton;
        if (state == 'collecting') {
            let inputs = [];
            for (let i = 0; i < pose.keypoints.length; i++) {
                let x = pose.keypoints[i].position.x;
                let y = pose.keypoints[i].position.y;
                inputs.push(x);
                inputs.push(y);
            }
            brain.addData(inputs, targetColor);
        }
    }
}



function modelLoaded() {
    console.log('poseNet ready');
}

//// DRAW 
function draw() {

    //// Song volume - mapped to the slider.It here because it updates every frame.
    song2.setVolume(map(rSlider.value(), 0, 255, 0, 1));
    song.setVolume(map(gSlider.value(), 0, 255, 0, 1));
    song1.setVolume(map(bSlider.value(), 0, 255, 0, 1));
    song4.rate(map(bSlider.value(), 0, 255, 1, 100));

    //// CONNECTING THE MODEL TO VARIABLES
    let r = rSlider.value();
    let g = gSlider.value();
    let b = bSlider.value();
    let averageValue = (r + g + b) / 3; /// assigning all the sliders average value to a variable

    //// IMAGE PROCESSING - pixel manipulation based on brightness
    push();
    translate(0, 0);
    video.loadPixels();
    for (var y = 0; y < video.height / vScale; y++) {
        for (var x = 0; x < video.width / vScale; x++) {
            //var index = ((x) + (y * video.width)) * 4 * vScale; // non inversion
            var index = ((video.width - x + 1) + (y * video.width)) * 4 * vScale; // inversion

            var rG = video.pixels[index + 0];
            var gG = video.pixels[index + 1];
            var bG = video.pixels[index + 2];

            var bright = (rG + gG + bG) / 3;

            var w = map(bright, 0, 255, 0, vScale);

            strokeWeight(1);
            stroke(0, 255, 0);
            fill(0, 0, 0, 0);
            rectMode(CENTER);
            rect((x * vScale), (y * vScale), w, w);
        }
    }
    pop();

    //// This is only for debugging purpose - display the original video in
    //    push();
    //    translate(video.width, 0);
    //    scale(-1, 1);
    //    image(video, 0, 0, video.width, video.height);  //// it looks better without the source video


    if (pose) {

        for (let i = 0; i < skeleton.length; i++) {
            let a = skeleton[i][0];
            let b = skeleton[i][1];
            strokeWeight(2);
            stroke(255, 0, 0);
            line(a.position.x, a.position.y, b.position.x, b.position.y);
        }

        for (let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            //fill(200, 0, 0);
            noFill();
            strokeWeight(1);
            stroke(255, 0, 5, 90);
            //rectMode(CENTER);  //// changing this will make the key position at the center of the rectangle - changing visuals
            rect(x, y, 16, 16);

            //// Ripple effect
            let stoprip = random(200, 600);

            let skalaResonance = 0;
            skalaResonance = skalaResonance + 20;

            if (skalaResonance >= 200000) {
                skalaResonance = 0;
            }

            if (averageValue > 30) { //changing this value will effect the ripple count

                noFill();
                stroke(150, 0, 0);
                strokeWeight(random(1));
                rect(x, y, ripple, ripple);
                ripple = ripple + averageValue / skalaResonance; // the divider drasticly changes the visuals

                if (ripple >= stoprip) {
                    ripple = 10;
                }
            } else {
                ripple = 10;

            }
        }
    }
    pop();


    //// BACKGROUND
    var interval;
    interval = 1;
    interval += 2 * sin(frameCount / 8); // making the fading in-out effect and the light-painting effect

    if (interval < 0) {
        background('rgba(0, 0, 0, 0.01)');
    } else {
        background(r, g, b, 2);
    }

    //background(r, g, b, 100); //// for debugging purpose
}


function keyPressed() {
    //// SOUND - in key pressed - triggering  
    if (song.isPlaying()) {
        song.pause();
        song0.pause();
        song1.pause();
        song2.pause();
        song3.pause();
        song4.pause();
    }
}


function mouseMoved() {
    /// SOUND - in mouse moved - triggering   
    if (playing == false) {
        playing = true;
    } else {
        playing = false;
    }

    if (!song.isPlaying()) // .isPlaying() returns a boolean
    {
        song.play();
        song.loop();
        song0.loop();
        song1.loop();
        song2.loop();
        song3.loop();
        song4.loop();
    }

}
