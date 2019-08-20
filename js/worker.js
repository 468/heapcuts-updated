/* Worker for the camera, which slowly rotates around the scene while rising upwards */
self.addEventListener('message', function (e) {
  const data = e.data
  const x = data.x
  const y = data.y || 0
  const z = data.z
  let new_y

  const new_x = x * Math.cos(0.0005) + z * Math.sin(0.0002)
  // max upper limit for camera
  if (y < 5000) {
  	const new_y = y * Math.cos(0.0005) + y * Math.sin(0.000030)
  } else {
   	const new_y = false
  }
  const new_z = z * Math.cos(0.0005) - x * Math.sin(0.00025)

  self.postMessage({ x: new_x, y: new_y, z: new_z })
}, false)
