# Final-Year-Project-In-Computational-Arts-3
This repositori is created for the IS53047A: Final Year Project In Computational Arts (2020-21) module by Gabor Paszti.

This project is about creating a space(tool) for human machine interaction as a means for creating art.

The computational part of this project aims to create interface for communication between the code and human;
and a creative environment in which this communication is happening.

The final audio-visual documentation is displayed here: https://third.goldcomparts.show/artists/gabor-paszti/ and https://www.youtube.com/watch?v=SoLNNl_LIOQ

More on the process can be found here: http://www.gaborpaszti.com/dac-final-year-project-in-computational-art/

The soundtrack for this project can be found here: https://soundcloud.com/user-251848331/flow-of-glitches

The programming language used in this project is JavaScript, MAX MSP for audio-visual production and Adobe Premiere Pro for post production. 

I explored various machine learning techniques listed bellow, however I used pose estimation (poseNet) for conveying my vision for this project. This was the most economic and versatile option. I could determine position of the dancer along with isolating body postures and movements. I used regression mode to teach a model three different poses, which I connected to influence the background colour. On the mobile application I did a similar approach to connect the key points of the pose estimation to the sound synthesis variables in MAX MSP, however this time without a pretrained model, but only for tracking via "poseHook OSC" mobile application.

Pixel processing – based on “Brightness mirror” from The Coding Train (https://youtu.be/rNqaw8LT2ZU?list=PL5HWV9mmp3eIKoJTTBGDN_4y9JtWNZGNv) 

ML Object detection – based on “ml5.js: Object Detection with COCO-SSD” from The Coding Train (https://youtu.be/QEzRxnuaZCk?list=PL5HWV9mmp3eIKoJTTBGDN_4y9JtWNZGNv )   

ML Style Transfer – based on “Style Transfer using Spell with Yining Shi” from The Coding Train
(https://youtu.be/gye9hSIrRWI?list=PL5HWV9mmp3eIKoJTTBGDN_4y9JtWNZGNv)

ML Sound classification - based on “Teachable Machine 3: Sound Classification” from The Coding Train
(https://youtu.be/TOrVsLklltM?list=RDCMUCvjgXvBlbQiydffZU7m1_aw )

ML Pose estimation and regression - based on “ml5.js: Pose Regression” from The Coding Train
(https://thecodingtrain.com/Courses/ml5-beginners-guide/7.3-pose-regression.html )
Separated into three sketches:
1: Data Collection: https://editor.p5js.org/codingtrain/sketches/Fe1ZNKw1Z
2: Model Training: https://editor.p5js.org/codingtrain/sketches/KLrIligVq
3: Model Deployment: https://editor.p5js.org/codingtrain/sketches/nejAYCA6N

ML Text generation with CharRNN  - is based on Week 8 sample codes in “Data and machine learning for creative practice” module.

ML Facial recognition - is based on Week 4 sample codes in “Data and machine learning for creative practice” module.

Coding Challenge #59: Steering Behaviors – with text to path based on The Coding Train
(https://youtu.be/4hA7G3gup-4?list=PL5HWV9mmp3eIKoJTTBGDN_4y9JtWNZGNv )


I created my own models following the series of tutorials listed above. 


