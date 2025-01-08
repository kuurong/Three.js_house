import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import { Sky } from 'three/addons/objects/Sky.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// Floor
const floorAlphaTexture = textureLoader.load('./floor/alpha.webp')
const floorColorTexture = textureLoader.load(
  './floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp'
)
const floorARMTexture = textureLoader.load(
  './floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp'
)
const floorNormalTexture = textureLoader.load(
  './floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp'
)
const floorDisplacementTexture = textureLoader.load(
  './floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp'
)

floorColorTexture.colorSpace = THREE.SRGBColorSpace

floorColorTexture.repeat.set(8, 8)
floorARMTexture.repeat.set(8, 8)
floorNormalTexture.repeat.set(8, 8)
floorDisplacementTexture.repeat.set(8, 8)

floorColorTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapS = THREE.RepeatWrapping

floorColorTexture.wrapT = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping

// Wall
const wallColorTexture = textureLoader.load(
  './wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.webp'
)
const wallARMTexture = textureLoader.load(
  './wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.webp'
)
const wallNormalTexture = textureLoader.load(
  './wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.webp'
)

wallColorTexture.colorSpace = THREE.SRGBColorSpace

// roof
const roofColorTexture = textureLoader.load(
  './roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp'
)
const roofARMTexture = textureLoader.load(
  './roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp'
)
const roofNormalTexture = textureLoader.load(
  './roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp'
)

roofColorTexture.colorSpace = THREE.SRGBColorSpace

roofColorTexture.repeat.set(3, 1) // x축으로만 repeat 3배, wrapS만 필요
roofARMTexture.repeat.set(3, 1)
roofNormalTexture.repeat.set(3, 1)

roofColorTexture.wrapS = THREE.RepeatWrapping
roofARMTexture.wrapS = THREE.RepeatWrapping
roofNormalTexture.wrapS = THREE.RepeatWrapping

// Bush
const bushColorTexture = textureLoader.load(
  './bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp'
)
const bushARMTexture = textureLoader.load(
  './bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp'
)
const bushNormalTexture = textureLoader.load(
  './bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp'
)

bushColorTexture.colorSpace = THREE.SRGBColorSpace

bushColorTexture.repeat.set(2, 1)
bushARMTexture.repeat.set(2, 1)
bushNormalTexture.repeat.set(2, 1)

bushColorTexture.wrapS = THREE.RepeatWrapping
bushARMTexture.wrapS = THREE.RepeatWrapping
bushNormalTexture.wrapS = THREE.RepeatWrapping

// Grave
const graveColorTexture = textureLoader.load(
  './grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp'
)
const graveARMTexture = textureLoader.load(
  './grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp'
)
const graveNormalTexture = textureLoader.load(
  './grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp'
)

graveColorTexture.colorSpace = THREE.SRGBColorSpace

graveColorTexture.repeat.set(0.3, 0.4)
graveARMTexture.repeat.set(0.3, 0.4)
graveNormalTexture.repeat.set(0.3, 0.4)

// Door
const doorColorTexture = textureLoader.load('./door/color.webp')
const doorAlphaTexture = textureLoader.load('./door/alpha.webp')
const doorAmbientOcclusionTexture = textureLoader.load(
  './door/ambientOcclusion.webp'
)
const doorHeightTexture = textureLoader.load('./door/height.webp')
const doorNormalTexture = textureLoader.load('./door/normal.webp')
const doorMetalnessTexture = textureLoader.load('./door/metalness.webp')
const doorRoughnessTexture = textureLoader.load('./door/roughness.webp')

doorColorTexture.colorSpace = THREE.SRGBColorSpace

/**
 * House
 */

// Temporary sphere
// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(1, 32, 32),
//   new THREE.MeshStandardMaterial({ roughness: 0.7 })
// )
// scene.add(sphere)

// const HouseMeasurements = { 원래는 이런식으로 먼저 선언해준다.
//     width:4,
//     height:2.5,
//     depth:4
// }

// Floor  1m = 1
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    alphaMap: floorAlphaTexture,
    transparent: true, // alphaMap을 쓴다면 꼭!
    map: floorColorTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    normalMap: floorNormalTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.3,
    displacementBias: -0.2,
  }) // 사실적인 표현 PBR 텍스처
)
floor.rotation.x = -Math.PI * 0.5
scene.add(floor)

gui
  .add(floor.material, 'displacementScale')
  .min(0)
  .max(1)
  .step(0.01)
  .name('floordisplacementScale')
gui
  .add(floor.material, 'displacementBias')
  .min(-1)
  .max(1)
  .step(0.01)
  .name('floordisplacementBias')

// House Group Container
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture,
  })
)
walls.position.y = 2.5 / 2
house.add(walls) // house의 요소는 scene이 아닌 group에 add하기 !!

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
  })
)
roof.position.y = 2.5 + 0.75 // wall position + roof height/2
roof.rotation.y = Math.PI * 0.25 // PI는 half circle
house.add(roof)

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementBias: -0.04,
    displacementScale: 0.15,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
)
door.position.y = 1
door.position.z = 2 + 0.01 // z fighting 찌그러짐 방지
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
  color: '#ccffcc',
  map: bushColorTexture,
  aoMap: bushARMTexture,
  roughnessMap: bushARMTexture,
  metalnessMap: bushARMTexture,
  normalMap: bushNormalTexture,
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5) // bush1.scale.setScalar(0.5) 와 같다
bush1.position.set(0.8, 0.2, 2.2)

bush1.rotation.x = -0.75 // 꼭대기 텍스처 숨기기위해

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

bush2.rotation.x = -0.75

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)

bush3.rotation.x = -0.75

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)

bush4.rotation.x = -0.75

house.add(bush1, bush2, bush3, bush4)

// graves
//random - 0부터 1사이 값 랜덤
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  normalMap: graveNormalTexture,
})

const graves = new THREE.Group()
scene.add(graves)

for (let i = 0; i < 30; i++) {
  const angle = Math.random() * Math.PI * 2
  const radius = 3 + Math.random() * 4
  const x = Math.sin(angle) * radius
  const z = Math.cos(angle) * radius

  // Mesh
  const grave = new THREE.Mesh(graveGeometry, graveMaterial)
  grave.position.x = x
  grave.position.y = Math.random() * 0.4 // 0.8이 총 높이니까 그 반
  grave.position.z = z
  grave.rotation.x = (Math.random() - 0.5) * 0.4 // -0.5 는 +,- 값을 둘다 가져서 회전할때 다른방향 가능케 / 0.4를 곱해줌으로서 강도 조절
  grave.rotation.y = (Math.random() - 0.5) * 0.4 // 0.4를 곱해줌으로서 강도 조절
  grave.rotation.z = (Math.random() - 0.5) * 0.4 // 0.4를 곱해줌으로서 강도 조절

  graves.add(grave)
}

/**
 * Lights
 */
// Ambient light - light bouncing을 위해 모든 면에 빛이 적용됨 즉, 빛이 안들어오는 부분도 밝게 해준다
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

// Door Light
const doorLight = new THREE.PointLight('#ff7d46', 5)
doorLight.position.set(0, 2.2, 2.5)
house.add(doorLight)

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#8800ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#ff0000', 6)
scene.add(ghost1, ghost2, ghost3)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Shadows
 */
renderer.shadowMap.enabled = true //이 프로젝트는 쉐도우를 support 한다!
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Cast and receive
directionalLight.castShadow = true // directional light이 쉐도우를 생기게끔 하여 집 쉐도우가 floor에 그려지게끔!
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true // 집 그림자 floor에 생기게하고싶으니까
walls.receiveShadow = true // ghost가 지나가면서 graves의 그림자를 wall 에 비추게끔 하고싶으니까
roof.castShadow = true // wall과 roof가 맞닿는 면에 작게 생기는 roof그림자
floor.receiveShadow = true

for (const grave of graves.children) {
  grave.castShadow = true
  grave.receiveShadow = true
}

// Mapping
directionalLight.shadow.mapSize.width = 256 // shadow 를 블러리 하게
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8 // shadow가 적용될 카메라 범위 amplitude
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.left = -8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 10

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 10

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 10

/**
 * Sky
 */
const sky = new Sky()
sky.scale.set(100, 100, 100) // setScalar(100)과 같다
scene.add(sky)

sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)

/**
 * Fog
 */
scene.fog = new THREE.FogExp2('#04343f', 0.1)

/**
 * Animate
 */
const timer = new Timer()

const tick = () => {
  // Timer
  timer.update()
  const elapsedTime = timer.getElapsed()

  // Ghost
  const ghost1Angle = elapsedTime * 0.5 // 속도 늦춤
  ghost1.position.x = Math.cos(ghost1Angle) * 4
  ghost1.position.z = Math.sin(ghost1Angle) * 4
  ghost1.position.y =
    Math.sin(ghost1Angle) *
    Math.sin(ghost1Angle * 2.34) *
    Math.sin(ghost1Angle * 3.45)

  const ghost2Angle = -elapsedTime * 0.38
  ghost2.position.x = Math.cos(ghost2Angle) * 5
  ghost2.position.z = Math.sin(ghost2Angle) * 5
  ghost2.position.y =
    Math.sin(ghost2Angle) *
    Math.sin(ghost2Angle * 2.34) *
    Math.sin(ghost2Angle * 3.45)

  const ghost3Angle = elapsedTime * 0.6
  ghost3.position.x = Math.cos(ghost3Angle) * 6
  ghost3.position.z = Math.sin(ghost3Angle) * 6
  ghost3.position.y = Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34)

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
