import * as helpers from './helpers.js'// workers
import { activateStartButton } from './main.js' // this is called when model is loaded.

Physijs.scripts.worker = './lib/physijs_worker.js'
const camera_angle_worker = new Worker('./js/worker.js')
const container = document.querySelector('#three-container')
const one_bar = 8000 // clips are 120bpm; 4:4; one bar is 8000 seconds
const number_of_clips = 24
const clips = new Array(number_of_clips)
const player_queue = []
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)
const scene = new Physijs.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: false })
const player_material = new THREE.MeshBasicMaterial({ color: 0x999999 })
let bar_counter = 0
let count = 0
for (const [i, v] of clips.entries()) { clips[i] = i + 1 + '.mp4' }
camera.position.set(155, 1250, 500)

const createVideoClipElement = async function () {
  try {
    const next_pending_clip = {}
    const video_choice = helpers.randFromArray(clips)
    const element = document.createElement('video')
    const configured_element = configureVideoClipElement(element, video_choice)
    next_pending_clip['element'] = configured_element
    next_pending_clip['id'] = configured_element.id
    next_pending_clip['video_choice'] = configured_element.video_choice
    return (next_pending_clip);
  } catch (rejectedValue) {
    Error('Unable to preload next video clip; please check connection.')
  }
}

const configureVideoClipElement = (element, video_choice) => {
  element.id = count
  element.style.border = '0px'
  element.style.width = '560px'
  element.style.height = '315px'
  element.src = './videos/small/' + video_choice
  element.preload = 'auto';
  return element
}

const create3dPlayerModel = async function (clip_object) {
  try {
    const vid_texture = new THREE.VideoTexture(clip_object.element)
    const dummyMaterialArray = Array.from({ length: 5 }).map((val, index, arr) => {
      if (index == 4) {
        return new THREE.MeshBasicMaterial({ map: vid_texture, side: THREE.FrontSide })
      } else {
        return player_material
      }
    })
    const material = new THREE.MeshFaceMaterial(dummyMaterialArray)
    const geometry = new THREE.BoxGeometry(560, 315, 17)
    const object_model = new Physijs.BoxMesh(geometry, material)
    const object_model_with_video_texture = { video_clip: clip_object, object: configure3dPlayerModelPosition(object_model) }
    return (object_model_with_video_texture)
  } catch (rejectedValue) {
    Error('Unable to preload next 3d object; please check connection.')
  }
}
const configure3dPlayerModelPosition = (this_3d_object) => {
  const camera_height = camera.position.y
  this_3d_object.position.x = helpers.randNum(-400, 400)
  this_3d_object.position.y = Math.random() * 400 + 800 + camera_height
  this_3d_object.position.z = helpers.randNum(-400, 400)
  this_3d_object.rotation.x = 180
  this_3d_object.rotation.z = helpers.randNum(0, 360)
  this_3d_object.doubleSided = true;
  return (this_3d_object)
}

const addPlayerToQueue = (player_object) => {
  player_queue.push(player_object)
  count += 1
}

const createNextVideoObject = () => {
  createVideoClipElement()
    .then(video_clip_element => create3dPlayerModel(video_clip_element))
    .then(player_3d_object => addPlayerToQueue(player_3d_object))
}

const activateNextVideoObject = () => {
  const next_object = player_queue.shift()
  next_object['video_clip']['element'].play()
  scene.add(next_object['object'])
  createNextVideoObject()
}

const createGroundMaterial = () => {
  const material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide })
  const physics_material = Physijs.createMaterial(material, 1, 0)
  const ground_material = Physijs.createMaterial(new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('./img/tile.png') }), 1, 0)
  ground_material.map.wrapS = THREE.RepeatWrapping
  ground_material.map.wrapT = THREE.RepeatWrapping
  ground_material.map.repeat.set(100, 100)
  const ground = new Physijs.BoxMesh(new THREE.CubeGeometry(10000, 10, 10000), ground_material, 0) // 1 == mass
  ground.position.y = -100
  return (ground)
}

const loadGroundModel = (scene) => {
  const loader = new THREE.GLTFLoader()

  loader.load('./models/untitled_seperated_pink.glb',
    (gltf) => {
      const materials = []
      const players_mesh = gltf.scene.children[1]
      var material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
      const object = new Physijs.BoxMesh(players_mesh.children[0].geometry, material, 0)
      players_mesh.children[0].material = new THREE.MeshBasicMaterial({ color: 0x999999 })
      object.rotation.x = Math.PI / 2
      scene.add(object)
      scene.add(gltf.scene)
    },
    (xhr) => {
      if (xhr.loaded % xhr.total == 0) {
        // Once this model has loaded, activate the start button in main.js after waiting 1500ms.
        setTimeout(function () { activateStartButton() }, 1500)
      }
    },
    (error) => {
      console.log(error)
      console.log('Error loading model')
    }
  )
}

const startWorker = () => {
  camera_angle_worker.addEventListener('message', function (e) {
    const data = e.data
    camera.position.x = data.x
    if (data.y) {
      camera.position.y = data.y
    }
    camera.position.z = data.z
  }, false)
}

export const startMainTrackInterval = () => {
  setInterval(function () {
    // To keep sense of musical pace, only drop object is it is first bar, or from then on if bar count is divisible by two
    if (bar_counter == 1 || ((bar_counter % 2 !== 0))) {
      activateNextVideoObject()
    };
    bar_counter += 1
  }, one_bar)
  activateNextVideoObject()
}

export const initThreeWorld = () => {
  scene.setGravity(new THREE.Vector3(0, -500, 0))
  scene.add(createGroundMaterial())
  scene.add(new THREE.AmbientLight(0xffffff))
  renderer.setPixelRatio(window.devicePixelRatio / 1)
  renderer.setSize(container.offsetWidth, container.offsetHeight)
  container.appendChild(renderer.domElement)
  createNextVideoObject()
  loadGroundModel(scene)
  startWorker()
}

const animate = () => {
  camera_angle_worker.postMessage({ x: camera.position.x, y: camera.position.y, z: camera.position.z })
  camera.lookAt(scene.position)
  renderer.render(scene, camera)
 	requestAnimationFrame(animate)
 	scene.simulate()
}

animate()
