import * as helpers from './helpers.js'
import { initThreeWorld, startMainTrackInterval } from './3dscene.js'
import { initSplashScreenWorld, initiateGravity } from './splashscreen.js'


/* Show splashscreen and load three scene */
initSplashScreenWorld()
initThreeWorld()

const credits_button = document.querySelector('#credits-button')
const credits_overlay = document.querySelector('#credits')
const three_container = document.querySelector('#three-container')
const start_button = document.querySelector('#startbutton')
const splashscreen_cover = document.querySelector('#cover')

credits_button.onclick = () => {
  if (credits_overlay.style.opacity == 1) {
    credits_overlay.style.opacity = 0
  } else {
    credits_overlay.style.opacity = 1
  }
  three_container.classList.toggle('title-filter')
}

const onStartButtonClicked = () => {
  splashscreen_cover.style.opacity = 0
  splashscreen_cover.addEventListener('transitionend', enterThreeScene)
  splashscreen_cover.addEventListener('webkitTransitionEnd', enterThreeScene)

  setTimeout(function () {
    start_button.style.color = '#fff'
  }, 10)
}

const enterThreeScene = (e) => {
  /* Remove splashscreen from DOM */
  splashscreen_cover.removeEventListener('transitionend', enterThreeScene)
  splashscreen_cover.removeEventListener('webkitTransitionEnd', enterThreeScene)
  splashscreen_cover.remove()
  startMainTrackInterval()
}

export const activateStartButton = () => {
  start_button.style.opacity = 1

  initiateGravity()

  start_button.onclick = () => {
      onStartButtonClicked()
  }
}