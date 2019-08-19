# heapcuts-updated
The HeapCuts (2015) project, updated to meet modern web standards.

This is a digital artwork originally created in collaboration with the musician/artist Jason Friedman in 2015, who contributed to the concept of the piece and created all of the audio for the project. As of 2019, updates to Three.js (and ECMAScript in general) have allowed me to recode this piece from the ground up to be far more stable and efficient than it was before.

Audiovisual players mapped to the textures of 3D player objects fall from the sky piece by piece to randomly create a musical composition without a beginning or an end. Due to the musical nature of the piece, optimization is important; every tick counts, or the players slip out of synchronization. Players are consistently being loaded in the background, so there is no delay when a new one needs to be activated at the start of a new bar.

The way the code works is as follows:

Splashscreen
------------
Created with Matter.js. This page is shown while the 3D 'heap' .gltf (previously .json) model within the three.js scene loads in the background. The first 3D players from the main 3D scene are also instantiated in the background. Once the main 3D 'heap' model has finished loading, physics is activated in the 2D screen and the sprites are randomly nudge while a 'start' button appears. On pressing the start button, gravity is enabled in the Matter.js scene, and the letters drop to the ground. The splashscreen then begins to fade out via a CSS transition, with a callback that deletes the splashscreen from the DOM triggered when the transition is finished.

Main 3D Scene
------------
The timeline of operations of the 3D scene is as follows:
1) A HTML5 video player element is created, and has a random clip assigned to it.
2) Once this player is created, a 3D player object is created, and the video is mapped to one of its sides as a texture.
3) Once this has been created, it is then placed in the scene behind the camera, giving the video time to load.
4) Every second bar (as set in startMainTrackInterval), a new player is dropped from the sky and has its play state triggered, adding to the musical composition.

Credits page
-------------
A credits page has been created by overlaying a masked SVG distortion filter (with the title 'Heap Cuts' cut out of it) to the main three.js scene.
