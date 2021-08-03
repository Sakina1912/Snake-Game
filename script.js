const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const body = document.getElementById('body')
let x = canvas.width/2
let y = canvas.height/2
let snakeLength = 1
const snakeHeight = 20
let speed = 10
let xDirection = 0
let yDirection = 0
let snake = []

class SnakeBox{
    constructor(relPos,xCoord,yCoord){
        this.relPos = relPos
        this.xCoord = xCoord
        this.yCoord = yCoord
    }
    draw(){
        ctx.fillStyle="blue"
        ctx.fillRect(this.xCoord,this.yCoord,20,snakeHeight)
    }
    calculateXcoord(prevX){this.xCoord = prevX > 0 ? prevX : this.xCoord+xDirection*speed}
    calculateYcoord(prevY){this.yCoord = prevY > 0 ? prevY : this.yCoord+yDirection*speed}
}

let snakeHead = new SnakeBox(snakeLength,x,y)
snake.push(snakeHead)
let [posX,posY] = getRandomPosition()
// console.log(snake);

function clearScreen(){
    ctx.fillStyle='#fff'
    ctx.clearRect(0, 0,canvas.width,canvas.height)
}

function drawSnake(){
    snake.forEach(block => {
        block.draw()
        // console.log(block.yCoord);
    })
}

function getRandomPosition(){
    let isfoodOnSnake = true
    let randomNumberX, randomNumberY
    while(isfoodOnSnake){
        randomNumberX = Math.abs( Math.floor(Math.random()*canvas.width-25))
        randomNumberY =Math.abs( Math.floor(Math.random()*canvas.height-25))
        isfoodOnSnake = false
        snake.forEach(block => {
            if(isFoodEaten(randomNumberX,randomNumberY,block.xCoord,block.yCoord)){
                isfoodOnSnake = true
            }
        })
    }
    return [randomNumberX, randomNumberY];
    
}

function randomFood(posX,posY){
    ctx.fillStyle="red"
    ctx.fillRect(posX,posY,20,20)
}


function changeSnakePosition(){
    for(let i=snake.length-1;i>=0;i--){
        if(i === 0){
            snake[i].calculateXcoord(-1)
            snake[i].calculateYcoord(-1)
        }
        else{
            snake[i].calculateXcoord(snake[i-1].xCoord)
            snake[i].calculateYcoord(snake[i-1].yCoord)
        } 
    }
}

function isFoodEaten(foodX,foodY,snakeX,snakeY){
    // has horizontal gap
	if (foodX > snakeX+20 || snakeX > foodX+20) return false;

	// has vertical gap
	if (foodY > snakeY+20 || snakeY > foodY+20) return false;

	return true;
}

function increaseSnakeLength(){
    snakeLength++
    let snakeBlock = new SnakeBox(snakeLength,snake[0].xCoord+20*xDirection,snake[0].yCoord+20*yDirection)
    snake.unshift(snakeBlock)
}

function gameOverElm(){
    const gameOver = document.createElement('div')
    gameOver.classList.add('gameOver')
    gameOver.innerHTML=`GAME OVER!<button id="playAgain" onclick="window.location.reload()">Play Again</button`
    body.appendChild(gameOver)
}

function drawGame(){
    clearScreen()
    changeSnakePosition()
    if(isFoodEaten(posX,posY,snake[0].xCoord,snake[0].yCoord)){
        [posX,posY] = getRandomPosition()
        increaseSnakeLength()
        // console.log(snake);
    }
    if(snake[0].xCoord > canvas.width || snake[0].yCoord > canvas.height || snake[0].xCoord <0 || snake[0].yCoord <0){
        gameOverElm()  
    }
    randomFood(posX,posY)
    drawSnake()
    setTimeout(drawGame,100)
}

drawGame()


window.addEventListener('keydown',(e)=>{
    const pressedKey = e.key
    if(pressedKey === 'ArrowRight' && xDirection === 0){
        xDirection=1
        yDirection=0
        
    }
    if(pressedKey === 'ArrowLeft' && xDirection === 0){
        xDirection=-1
        yDirection=0
    }
    if(pressedKey ==='ArrowUp' && yDirection === 0){
        xDirection=0
        yDirection=-1
    }
    if(pressedKey ==='ArrowDown' && yDirection === 0){
        xDirection=0
        yDirection=1
    }
})

// playAgain.addEventListener('click',()=> window.location.reload())

// https://stackoverflow.com/questions/40749888/snake-in-js-establish-left-right-movement
// https://www.educative.io/blog/javascript-snake-game-tutorial
// https://practity.com/582-2/
// https://www.digitalocean.com/community/tutorials/understanding-classes-in-javascript


// snake head in contact with snake body leads to game over