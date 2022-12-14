let lineNum = 15
let canvasSize = 50
let canvasScale = 25
let lineWidth = 3
let noiseScale = 0.1
let seed = 'Hello world.'
let distortScale = 100
let timeScale = 0.01
let showPts = false
let ptSize = 20
let panScale = 0.005
let autoTime = true
let mousePan = false
let sidePan = false
let fillLine = false

let simplex = new SimplexNoise(seed)
let c = document.getElementById('canvas')
let ctx = c.getContext('2d')
c.height = canvasSize * canvasScale
c.width = canvasSize * canvasScale
let mousePanHints = {
	left: document.getElementsByClassName('left')[0],
	right: document.getElementsByClassName('right')[0],
	up: document.getElementsByClassName('up')[0],
	down: document.getElementsByClassName('down')[0]
}
let mouseX = window.innerWidth / 2
let mouseY = window.innerHeight / 2
let panAdditionX = 0
let panAdditionY = 0

let distorts = new Array((lineNum)**2)
// for (let i = 0; i < distorts.length; i++) {
// 	distorts[i] = []
// }


let panX = 0
let panY = 0
let frameNum = 0;

function draw() {
	if (autoTime){
		frameNum++
	}
	
	for (let i = 0; i < distorts.length; i++) {
		let x = i % lineNum
		let y = (i - x) / lineNum
		distorts[i] = [simplex.noise3D((x + ((panX + panAdditionX) * panScale)) * noiseScale,(y+((panY + panAdditionY) * panScale))*noiseScale,0+(frameNum*timeScale)), simplex.noise3D(x*noiseScale,y*noiseScale,100+(frameNum*timeScale))]
	}
	
	ctx.lineWidth = lineWidth
	
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.fillStyle = 'rgba(255,255,255,0.75)'
		// ctx.strokeStyle = 'transparent'
	
	ctx.fillRect(0,0,canvasSize*canvasScale,canvasSize*canvasScale)
	
		
	for (let i = 1; i < lineNum; i++){
		
		ctx.beginPath()
		ctx.moveTo(i * (canvasSize / lineNum) * canvasScale, 0)
		for (let j = 1; j < lineNum; j++){
			ctx.lineTo(i * (canvasSize / lineNum) * canvasScale + (distorts[i + (j * lineNum)][0] * distortScale), j * (canvasSize / lineNum) * canvasScale + (distorts[i + (j * lineNum)][1] * distortScale))
			
			if (showPts){
				ctx.fillStyle = 'red'
				ctx.fillRect(i * (canvasSize / lineNum) * canvasScale + (distorts[i + (j * lineNum)][0] * distortScale)- (ptSize / 2), j * (canvasSize / lineNum) * canvasScale + (distorts[i + (j * lineNum)][1] * distortScale)-(ptSize/2),ptSize,ptSize)
				ctx.fillStyle = 'purple'
				ctx.fillRect(i * (canvasSize / lineNum) * canvasScale - (ptSize / 2), j * (canvasSize / lineNum) * canvasScale -(ptSize/2),ptSize,ptSize)
			}
		}
		ctx.lineTo(i * (canvasSize / lineNum) * canvasScale, canvasSize * canvasScale)
		if (fillLine){
			ctx.fillStyle = 'black'
			ctx.fill()
		}
		ctx.stroke()

		// ctx.translate(canvasScale * canvasSize, 0)
		// ctx.rotate(Math.PI/2)
		ctx.beginPath()
		ctx.moveTo(0, i * (canvasSize / lineNum) * canvasScale)
		for (let j = 1; j < lineNum; j++){
			// ctx.fillRect(i * (canvasSize / lineNum) * canvasScale - 5, j * (canvasSize / lineNum) * canvasScale - 5, 10, 10)
			ctx.lineTo(j * (canvasSize / lineNum) * canvasScale + (distorts[j + (i * lineNum)][0] * distortScale), i * (canvasSize / lineNum) * canvasScale + (distorts[j + (i * lineNum)][1] * distortScale))
		}
		ctx.lineTo(canvasSize * canvasScale, i * (canvasSize / lineNum) * canvasScale)
		ctx.stroke()
		if (fillLine){
			ctx.fillStyle = 'black'
			ctx.fill()
		}
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
	
	if (sidePan) {
		if (mouseX < 10){
			panAdditionX -= 50
			mousePanHints.left.classList.add('active')
		} else {
			mousePanHints.left.classList.remove('active')
		}
		if (mouseX > window.innerWidth - 10){
			panAdditionX += 50
			mousePanHints.right.classList.add('active')
		} else {
			mousePanHints.right.classList.remove('active')
		}
		if (mouseY < 10){
			panAdditionY -= 50
			mousePanHints.up.classList.add('active')
		} else {
			mousePanHints.up.classList.remove('active')
		}
		if (mouseY > window.innerHeight - 10){
			panAdditionY += 50
			mousePanHints.down.classList.add('active')
		} else {
			mousePanHints.down.classList.remove('active')
		}
	}
	requestAnimationFrame(draw)
}




// ctx.fillRect(10,10,10,10)
draw()
// setInterval(draw,50)

addEventListener('mousemove', (e) => {
	// console.log(e.movementX)
	mouseX = e.clientX
	mouseY = e.clientY
	if (mousePan){
		panX=e.clientX
		panY=e.clientY
	}
	console.log(mouseX)
})

addEventListener('wheel', (e) => {
	if (!autoTime) {
		frameNum += (e.deltaY * 5) * timeScale
	}
});
