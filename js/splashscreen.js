import * as helpers from './helpers.js'// workers

const Engine = Matter.Engine
const Render = Matter.Render
const World = Matter.World
const Bodies = Matter.Bodies
const windowwidth = window.innerWidth
const windowheight = window.innerHeight
const title_first_row_position = windowheight / 4
const title_second_row_position = windowheight / 1.8
const engine = Engine.create()
const ground = Bodies.rectangle(windowwidth / 2, windowheight + 30, windowwidth, 30, { isStatic: true })

const render = Render.create({
  element: document.getElementById('cover'),
  engine: engine,
  options: {
    width: windowwidth,
    height: windowheight,
    wireframes: false,
    background: '-webkit-linear-gradient(top, #f9f2c2 0%,#ffc4fa 100%)'
  }
})

/* Assign each title letter to its corresponding sprite image, and position in the matter.js scene */
const title_sprites = ['h', 'e', 'a', 'p', 'c', 'u', 't', 's'].map((val, index, arr) => {
  const x_position = (index <= 3) ? (windowwidth / 7.5) * (index + 2) : (windowwidth / 7.5) * (index - 2)
  const y_position = (index <= 3) ? title_first_row_position : title_second_row_position // determines which row; /4 for first, /1.8 for second.
  return Bodies.rectangle(x_position, y_position, 75, 150, {
    render: {
      sprite: {
        texture: './img/title/' + val + '.png',
        xScale: 0.65,
        yScale: 0.65
      }
    }
  })
})

/* Trigger gravity in the scene (including start button interaction gravity) to indicate three.js scene has loaded */
export const initiateGravity = () => {
  title_sprites.forEach((num, index) => {
    Matter.Body.applyForce(title_sprites[index], { x: 0.01, y: 0.1 }, { x: helpers.randPlusOrMinus(0.01), y: helpers.randPlusOrMinus(0.01) })
  })
  document.getElementById('startbutton').addEventListener('mouseenter', (event) => {
    title_sprites.forEach((num, index) => {
      Matter.Body.applyForce(title_sprites[index], { x: 500, y: 500 }, { x: 0, y: -0.2 })
    })
	  	engine.world.gravity.y = 2
  }, false)// capturing or bubbling phase
}


/* Function to load the mater.js scene, exported to main.js where it is loaded immediately */
export const initSplashScreenWorld = () => {
  World.add(engine.world, [title_sprites, ground].flat())
  engine.world.gravity.y = 0
  Engine.run(engine)
  Render.run(render)
  return ('finished')
}
