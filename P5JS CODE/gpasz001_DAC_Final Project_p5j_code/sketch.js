/* jshint esversion: 8 */

// ml5.js: Pose Regression
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/Courses/ml5-beginners-guide/7.3-pose-regression.html
// https://youtu.be/lob74HqHYJ0


// Separated into three sketches
// 1: Data Collection: https://editor.p5js.org/codingtrain/sketches/Fe1ZNKw1Z
// 2: Model Training: https://editor.p5js.org/codingtrain/sketches/KLrIligVq
// 3: Model Deployment: https://editor.p5js.org/codingtrain/sketches/nejAYCA6N


// Brightness Mirror
// Salvaged the method from The Coding Train / Daniel Shiffman: 
// The Coding Train: https://youtu.be/rNqaw8LT2ZU?list=PL5HWV9mmp3eIKoJTTBGDN_4y9JtWNZGNv


// Altered the code from above mentioned sources for Computational Arts -  Final Project Assignment
// Added pixel processing, and my own training model for pose estimation with regression.
// gpasz001@gold.ac.uk – Gabor Paszti



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
let video1;


//// key points dinamics variable
var ripple = 6;

//// pixel manipulatin variable
var vScale = 6; ///Changing this variable, changes the size of the "pixel" rectangles. must be divided without reminder from canvas size.



function setup() {

    frameRate(60);

    //// WINDOW AND CANVAS SIZE
    width = window.innerWidth;
    height = window.innerHeight;
    createCanvas(width, height);
    pixelDensity(1);


    //// SLIDERS - for colours - connected to key poseNet
    rSlider = createSlider(0, 255, 0);
    gSlider = createSlider(0, 255, 0);
    bSlider = createSlider(0, 255, 0);

    //// VIDEO SOURCE SETUP
    video1 = createCapture(VIDEO);
    video1.size(1080, 720); //// needs to be dividable of var vScale = 6; 
    video1.volume(0);
    video1.loop();
    video1.hide(); // hides the html video loader
    video1.position(0, 0);


    //// LOADING POSNET
    poseNet = ml5.poseNet(video1, modelLoaded); //// posnet will not work if the soursce and name of the video here does not match !!!
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


    //// LOAD PRETRAINED MODE
    brain = ml5.neuralNetwork(options);
    const modelInfo = {
        model: 'model/model.json',
        metadata: 'model/model_meta.json',
        weights: 'model/model.weights.bin',
    };
    brain.load(modelInfo, brainLoaded);

}



function draw() {

    //// CONNECTING THE MODEL TO VARIABLES
    let r = rSlider.value() / 3; // there is no division in the initial version
    let g = gSlider.value() / 2;
    let b = bSlider.value() / 2;
    let averageValue = (r + g + b) / 3; // assigning all the sliders average value to a variable

    //// BRIGHTNESS MIRROR - Pixel manipulation
    push();
    translate(300, 50);
    video1.loadPixels();
    for (var y = 0; y < video1.height / vScale; y++) {
        for (var x = 0; x < video1.width / vScale; x++) {
            var index = ((x) + (y * video1.width)) * 4 * vScale; // non inversion
            //var index = ((video.width - x + 1) + (y * video.width)) * 4 * vScale; // inversion

            var rG = video1.pixels[index + 0];
            var gG = video1.pixels[index + 1];
            var bG = video1.pixels[index + 2];

            var bright = (rG + gG + bG) / 3;

            var w = map(bright, 0, 255, 0, vScale);

            //// this logic gate is acting as a threshold filter to eliminate unnecessary green squares from the video.
            if (w > 1.0) {
                strokeWeight(1);
                stroke(10 + r, 0 + 200 + g, 10 + b, 100);
                fill(0, 0, 0, 0);
                rectMode(CENTER);
                rect((x * vScale), (y * vScale), w, w);
            } else {

            }

        }
    }
    pop();


    //// BACKGROUND
    var interval;
    interval = 1;
    interval += 20 * sin(frameCount / random(200)); // making the fading in-out effect and the light-painting effect

    if (interval < 0) {

        push();
        image(video1, 300, 50, video1.width, video1.height);
        pop();

        background('rgba(0, 0, 0, 0.01)');
    } else {
        background(r, g, b + 5, 5); ////the rgb is connected to the ML pose regression model 

    }


    //// POSE ESTIMATION - and the aesthetics of it
    push();
    translate(300, 50);
    if (pose) {

        for (let i = 0; i < skeleton.length; i++) {
            var aL = skeleton[i][0];
            var bL = skeleton[i][1];
            strokeWeight(2);
            stroke(255, 0, 0);
            line(aL.position.x, aL.position.y, bL.position.x, bL.position.y);
        }


        //// This is how one element is connected to a specific keypoint
        if (pose && pose.keypoints.length > 9) {
            let pos = pose.keypoints[9].position;

            //// bounding box - green
            push();
            if (pose && pose.keypoints.length > 1) {
                let pos = pose.keypoints[0].position;
                //rect(pos.x, pos.y, 10, 10);

                noFill();
                strokeWeight(10);
                stroke(10, 200, 0, 5);
                rectMode(CENTER);
                rect(pos.x, pos.y + 50, 500, 800);
            }
        }
        pop();

        //// The square ripple around "key points"
        for (let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;

            noFill();
            strokeWeight(1);
            stroke(255, 0, 5, 90);
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
                stroke(150, 0, 0, 50);
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


    // Debugging purpose. To check if there are keypoints
    //    if(pose && pose.keypoints)
    //        console.log(" -- " + pose.keypoints.length);
    //    else
    //        console.log("no keypoints");

}



//// POSNET FUNCTIONS
function brainLoaded() {
    console.log('pose classification ready!');
    predictColor();
}

function predictColor() {
    if (pose) {
        //console.log('predicting');
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

//// A function to run when we get any errors and the results
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
