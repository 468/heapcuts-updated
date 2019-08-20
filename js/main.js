import * as helpers from './helpers.js'
import { initThreeWorld, startMainTrackInterval } from './3dscene.js'
import { initSplashScreenWorld, initiateGravity } from './splashscreen.js'


/* Show splashscreen and load three scene in the backbround*/
initSplashScreenWorld()
initThreeWorld()

/* Selectors for generic interactive elements  */
const credits_button = document.querySelector('#credits-button')
const credits_overlay = document.querySelector('#credits')
const three_container = document.querySelector('#three-container')
const start_button = document.querySelector('#startbutton')
const splashscreen_cover = document.querySelector('#cover')

/* Apply SVG filter to three.js scene when credits button is clicked */
credits_button.onclick = () => {
  if (credits_overlay.style.opacity == 1) {
    credits_overlay.style.opacity = 0
  } else {
    credits_overlay.style.opacity = 1
  }
  three_container.classList.toggle('title-filter')
}

/* On start button clicked, fade out splashscreen via CSS transition 
then trigger enterThreeScene callback when CSS transition is finished */
const onStartButtonClicked = () => {
  splashscreen_cover.style.opacity = 0
  splashscreen_cover.addEventListener('transitionend', enterThreeScene)
  splashscreen_cover.addEventListener('webkitTransitionEnd', enterThreeScene)
  /* Simple 'click' reaction coloru change */
  setTimeout(function () {
    start_button.style.color = '#fff'
  }, 10)
}

/* Remove event listener for start button, remove the splashscreen from the DOM, 
and begin looping the track */
const enterThreeScene = (e) => {
  /* Remove splashscreen from DOM */
  splashscreen_cover.removeEventListener('transitionend', enterThreeScene)
  splashscreen_cover.removeEventListener('webkitTransitionEnd', enterThreeScene)
  splashscreen_cover.remove()
  startMainTrackInterval()
}

/* Show the start button on the splashscreen and trigger gravity in the 
matter.js scene once the three.js scene is loaded */
export const activateStartButton = () => {
  start_button.style.opacity = 1

  initiateGravity()

  start_button.onclick = () => {
      onStartButtonClicked()
  }
}