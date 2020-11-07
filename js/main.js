//DOM Elements
const elevationDisplayed = document.getElementById("elevation");
const livesDisplayed = document.getElementById("lives");
//calibrate canvas
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.height = 800;
canvas.width = 1000;

//variables
let upPressed = false;
let leftPressed = false;
let rightPressed = false;
let spacePressed = false;
let collision = false;
let fuelCollected = false;
let blast = false;
let blink;
let lives = 3;
let fuelTimer = 50;
let scoreAdder = 0;
let score = 0;
let timer = 140;
let fuel = 1000;
let bgScroll = 0;
let angle = 0; // wobble add to rocket
let frame = 0; // add any periodic triggers to the game
let elevation = 1;
let gameSpeed = 2; // to create parallax effect
let yPos = 0; // Used to set the first two backgrounds
let yPosR = 0; // Used to set the repeating background


//launchStage imgs
const launchStage = new Image();
const stage2 = new Image();
const stars = new Image();
const heart = new Image();
const amp = new Image();
amp.src = "img/amp.png";
heart.src = "img/hearts.png";
stars.src = "img/repeat.jpg";
launchStage.src = "img/launch-stage.jpg";
stage2.src = "img/stage-2.jpg";

const repeatBG = {
  x: 0,
  y1: 0,
  y2: canvas.height,
  width: canvas.width,
  height: canvas.height,
};

//functions
function handleBackground() {
  if (yPosR === 0) {
    yPos += bgScroll * 0.2;
    ctx.drawImage(launchStage, 0, yPos, canvas.width, canvas.height);
    ctx.drawImage(stage2, 0, yPos - 800, canvas.width, canvas.height);
    ctx.drawImage(stars, 0, yPos - 1600, canvas.width, canvas.height);
  }
  if (yPos > 1600) {
    if (repeatBG.y1 >= repeatBG.height) repeatBG.y1 = -repeatBG.height;
    else repeatBG.y1 += bgScroll * 0.2;
    if (repeatBG.y2 >= repeatBG.height) repeatBG.y2 = -repeatBG.height;
    else repeatBG.y2 += bgScroll * 0.2;
    ctx.drawImage(stars, 0, repeatBG.y1, canvas.width, canvas.height + 30);
    ctx.drawImage(stars, 0, repeatBG.y2, canvas.width, canvas.height + 30);
  }
}

function collisionDetection() {
  if (asteroidHit(asteroidArray)) {
    blink = true;
    lives--;
    // console.log("boom");
  }
  if (asteroidHit(bigAsteroidArray)) {
    lives--;
    // console.log("big collsion");
  }
  if (fuelHit(fuelArray)) {
    console.log("fuel added");
    fuel += 200;
  }
}

function asteroidHit(array) {
  if (!collision) {
    for (let i = 0; i < array.length; i++) {
      if (
        array[i].x < rocket.x + rocket.width &&
        array[i].x + array[i].width > rocket.x &&
        array[i].y < rocket.y + rocket.width &&
        array[i].y + array[i].width > rocket.y
      ) {
        collision = true;
        return true;
      }
    }
  }
}

function fuelHit(array) {
  if (!fuelCollected && !collision) {
    for (let i = 0; i < array.length; i++) {
      if (
        array[i].x < rocket.x + rocket.width &&
        array[i].x + array[i].width > rocket.x &&
        array[i].y < rocket.y + rocket.width &&
        array[i].y + array[i].width > rocket.y
      ) {
        array.splice(i, 1);
        fuelCollected = true;
        return true;
      }
    }
  }
}

function playerInfo() {
  //fuel meter
  ctx.save();
  ctx.font = "30px VT323";
  ctx.fillStyle = "red"
  ctx.fillRect(870, 40, 100, 10);
  ctx.shadowBlur = 30;
  ctx.shadowColor = "yellow"
  ctx.fillStyle = "yellow";
  ctx.fillRect(870, 40, fuel / 10, 10);
  if (fuel >= 1000) {
    ctx.fillText(`FUEL: MAX`, 867, 30);
  } else {
    ctx.fillText(`FUEL: ${fuel}`, 867, 30);
  }
  ctx.restore();
  //hearts
  if (lives > 0) ctx.drawImage(heart, 800, 8, 50, 50);
  if (lives > 1) ctx.drawImage(heart, 750, 8, 50, 50);
  if (lives === 3) ctx.drawImage(heart, 700, 8, 50, 50);
  //power up
  powerBar();
  //elevation display
  ctx.save();
  ctx.font = "30px VT323";
  ctx.shadowBlur = 30;
  ctx.shadowColor = "yellow"
  ctx.fillStyle = "yellow"
  ctx.fillText(`SCORE: ${(score)} PTS`, 10, 35);
  ctx.restore();
}

function powerBar() {
  let maxed = (elevation / 3) % 700;
  if (maxed === 0) {
    fuel += 200;
  }
  ctx.fillStyle = "white";
  ctx.save();
  ctx.shadowBlur = 10;
  ctx.shadowColor = "cyan"
  ctx.fillRect(980, 780, 5, -700);
  ctx.fillStyle = "royalblue";
  ctx.fillRect(980, 780, 5, -(maxed));
  ctx.restore()
  ctx.save()
  ctx.shadowBlur = 10;
  ctx.shadowColor = 'white';
  ctx.drawImage(amp, 890, 90, 80, 80);
  ctx.restore();

}

function randomStartPos() {
  let ranNum = Math.random();
  if (ranNum < 0.5) {
    let leftStart;
    leftStart = Math.floor(Math.random() * 350);
    return leftStart;
  } else {
    let rightStart;
    rightStart = Math.floor(Math.random() * 350) + 330;
    return rightStart;
  }
}

//game loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleBackground();
  rocket.update();
  rocket.draw();
  handleAsteroids();
  handleFuel();
  handleBlaster();
  playerInfo();
  collisionDetection();
  requestAnimationFrame(animate);
  if (elevation > 0) frame++;
  elevationDisplayed.innerText = elevation * 5;
}
// animate();

//user input event listeners
window.addEventListener("keydown", function (e) {
  if (e.code === "ArrowUp") upPressed = true;
});

window.addEventListener("keyup", function (e) {
  if (e.code === "ArrowUp") upPressed = false;
});

window.addEventListener("keydown", function (e) {
  if (e.code === "ArrowLeft") leftPressed = true;
});

window.addEventListener("keyup", function (e) {
  if (e.code === "ArrowLeft") leftPressed = false;
});

window.addEventListener("keydown", function (e) {
  if (e.code === "ArrowRight") rightPressed = true;
});

window.addEventListener("keyup", function (e) {
  if (e.code === "ArrowRight") rightPressed = false;
});

window.addEventListener("keydown", function (e) {
  if (e.code === "Space") spacePressed = true;
});

window.addEventListener("keyup", function (e) {
  if (e.code === "ArrowDown") animate();
});
