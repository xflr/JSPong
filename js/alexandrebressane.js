
//Loading background music
var audio = new Audio('./audio/backgroundmusic.mp3');
 
$( "#game").hide();
$( "#dialog" ).hide();
$( "#welcome" ).dialog({
  resizable: false,
  draggable: false,
  dialogClass: "no-titlebar",
});;
$(" #welcome").css({"position":'absolute'});
$( "#welcome" ).width(300);
$( "#welcome" ).height(300);
  

function showSplash() {
	$( "#welcome" ).remove();
	$( "#dialog" ).dialog({
	  resizable: false,
	  draggable: false,
	  //dialogClass: "no-titlebar",
	});;
	$(" #dialog").css({"left": "50%", "margin-left": "-400px", "position":'absolute'});
	$( "#dialog" ).width(800);
	$( "#dialog" ).height(600);
	$( "#dialog" ).show();
	
	PlaySound();
}
var isStopped = false;
var gameRuning = false;
	var dx = 2;
	var dy = -2;
	var ballSpeed = 1;
	var aiSpeed = 1.2;
	var paddle1X = 0;
	var x;
	var y;
	
	//Declaring the initial score...
	var score1 = 0;
	var score2 = 0;
	
	//Declaring ball size (radius)...
	var ballRadius = 10;
	
	//Calculating the X axis size of paddles on canvas
	var paddle1Height = 15;
	var paddle1Width = 95;
	var paddle2Height = 15;
	var paddle2Width = 95;	
	var gameCanvas = document.getElementById("myCanvas");
	
	
function start() {
	$( "#dialog" ).remove();
	$( "#welcome" ).remove();
	$( "#game").show();

	PauseSound();
	
	if(gameRuning == true) {
		document.location.reload();
		gameRuning = false;
	}
	
	
	
	var p1Name = prompt("Please enter name for PLAYER 1", "Beavis");
	var p2Name = "Jeremy";
	//SCORE FOR P1
	gameRuning = true;
	
	// Drawing canvas....
	var buttonStart = document.getElementById("start");
	buttonStart.firstChild.data = "END GAME";
	
	var p1ScoreCanvas = document.getElementById("p1Name");
	var ctxp1Name=p1ScoreCanvas.getContext("2d");
	ctxp1Name.font="20px Georgia";
	ctxp1Name.fillStyle="#EE6622";
	ctxp1Name.fillText(p1Name,1,20);
	//Score Text on Canvas...
	var p1Score = document.getElementById("p1Score");
	var ctxScore1=p1Score.getContext("2d");
	ctxScore1.font="20px Georgia";
	ctxScore1.fillStyle="#EE6622";
	ctxScore1.fillText("0",40,20);
	
	//SCORE FOR P2
	// Drawing canvas...
	var p2ScoreCanvas = document.getElementById("p2Name");
	var ctxp2Name=p2ScoreCanvas.getContext("2d");
	ctxp2Name.font="20px Georgia";
	ctxp2Name.fillStyle="#EE6622";
	ctxp2Name.fillText(p2Name,1,20);
	//Score Text on Canvas...
	var p2Score = document.getElementById("p2Score");
	var ctxScore2=p2Score.getContext("2d");
	ctxScore2.font="20px Georgia";
	ctxScore2.fillStyle="#EE6622";
	ctxScore2.fillText("0",40,20);

	//DRAW NET 

	
	//Loading image files
	court_image = new Image();
	court_image.src = './img/court.jpg'; //https://s-media-cache-ak0.pinimg.com/736x/b1/b6/9b/b1b69bf2e5b83272b5efa5180239fe5f.jpg

	ball_image = new Image();
	ball_image.src = './img/ball.png'; 

	paddle1_image = new Image();
	paddle1_image.src = './img/p1.png'; //https://openclipart.org/detail/27024/led-rectangular-h-blue

	paddle2_image = new Image();
	paddle2_image.src = './img/p2.png'; //https://openclipart.org/detail/27027/led-rectangular-h-orange
	

	//Creating game court...
	
	var ctx = gameCanvas.getContext("2d");
	var netLine=document.getElementById("myCanvas");
	var gameNet=netLine.getContext("2d");
	x = gameCanvas.width/2;
	y = gameCanvas.height-30;

	paddle1X = (gameCanvas.width-paddle1Width)/2;
	var paddle2X = (gameCanvas.width-paddle2Width)/2;
	
	//Initializing the state of controls 
	var rightPressed = false;
	var leftPressed = false;    

	var wallhitsound=document.getElementById("wallhit");
	var sidewallhitsound=document.getElementById("sidewallhit");
	var paddlehitsound=document.getElementById("paddlehit");
	
	wallhitsound.volume = 0.3;
	sidewallhitsound.volume = 0.3;
	paddlehitsound.volume = 0.2;	

	//Creating event listeners for controlls 
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);


	//CONTROLS


	//reading the allowed buttons to control the paddle2x movement
	function keyDownHandler(e) {
		if(e.keyCode == 39) {
			rightPressed = true;
		}
		else if(e.keyCode == 37) {
			leftPressed = true;
		}
	}
	//OBJECTS DRAWING FUNCTIONS
	//This funcion to draw the ball is updated every game loop to match the updated ball X and Y position. 
	//Same values are considered for collision with paddles and walls, obviously considering the radius of the ball (Math.PI*2).
	function drawBall() {
		ctx.beginPath();
		ctx.arc(x, y, ballRadius, 0, Math.PI*2);
		ctx.fillStyle = "#EE6622";
		ctx.fill();
		ctx.closePath();
		ctx.drawImage(ball_image,x-(ballRadius*2),y-(ballRadius*1.1),35,38); //(35,38 is the initial position of the ball on game start).
	}
	function checkScore() {
		if (score1 >= 10 || score2 >= 10) {
			if (score1 > score2) {
				alert("YEAHH " + p1Name + " WINS!!!");
				start();
			}
			else {
				alert("YOU LOOSE! DON'T WORRY, YOU ALWAYS CAN DO IT BETTER!");
				start();
			}
		}
	}
	
	function draw() {
		if (!isStopped){
		
			ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
			ctx.drawImage(court_image,0,0,gameCanvas.width,gameCanvas.height)
			gameNet.beginPath();
			gameNet.strokeStyle="#FFFFFF";
			gameNet.lineWidth=5;
			gameNet.moveTo(0,299);
			gameNet.lineTo(400,299);
			gameNet.stroke();
			
			//Draw updated position of ball and paddles
			drawBall();
			drawPaddle1();
			drawPaddle2();

			//Collisions check based on ball radius, canvas size and paddles width/position
			if(x + dx > gameCanvas.width-ballRadius || x + dx < ballRadius) { //If the ball hits the side walls of court, play a sound and invert the forces on ball direction on X axis (dx)
				PlaySideWallHit();
				dx = -dx;
			}
			if(y + dy < (ballRadius+paddle2Height)) {
				if(x + dx > paddle2X && x < paddle2X + paddle2Width) {//If the ball hits the paddle, play a sound and invert the forces on ball direction on Y axis (dy)
					PlayPaddleHit();
					dy = dy * -1;
					ballSpeed = ballSpeed + 0.1;
					if(rightPressed && paddle2X < gameCanvas.width-paddle2Width) {
						dx = dx + 1;
					}
					else if(leftPressed && paddle2X > 0) {
						dx = dx - 1;
					}
				}
				else if (y + dy < ballRadius) {//If the ball hits the wall behind player1 scores do player2 and invert the forces on ball direction on Y axis (dy)
					PlayWallHit(); 
					score2 = score2 + 1;
					ctxScore2.clearRect(0,0, 100, 30);
					ctxScore2.fillText(score2,40,20);
					x = 200;
					y = 299;
					dy = dy * -1;
					dx = 2;
					ballSpeed = ballSpeed + 0.02;
					aiSpeed = aiSpeed + 0.1;
					
					checkScore();				
				}
			}
			else if((y + dy) > gameCanvas.height-(ballRadius+paddle1Height)){ //If the ball hits the paddle, play a sound and invert the forces on ball direction on Y axis (dy)
				
				if(x + dx > (paddle1X - paddle1Width/2) && x + dx < (paddle1X + paddle1Width/2)) {
					PlayPaddleHit();
					dy = dy * -1;
					ballSpeed = ballSpeed + 0.1;
				}
				else if (y + dy > gameCanvas.height-(ballRadius)) { //If the ball hits the wall behind player2 scores do player1 and invert the forces of ball direction on Y axis (dy)
					PlayWallHit();
					score1 = score1 + 1;
					ctx.fillStyle = "#EE6622";
					ctxScore1.clearRect(0,0, 100, 30);
					ctxScore1.fillText(score1,40,20);
					x = 200;
					y = 299;
					dx = 2;
					dy = dy * -1;
					ballSpeed = ballSpeed + 0.02;
					aiSpeed = aiSpeed + 0.1;
					
					checkScore();
				}            
			}
			
			// check the controls every game loop to update the paddle2 position using keyboard event listener declared before
			if(rightPressed && paddle2X < gameCanvas.width-paddle2Width) {
				paddle2X += 7;
			}
			else if(leftPressed && paddle2X > 0) {
				paddle2X -= 7;
			}
			x += dx*ballSpeed;
			y += dy*ballSpeed;
		}
	}
	
	//This function based on a EventListener is necessary to stop the movement when the key is released by putting the state of keys on false;
	function keyUpHandler(e) {
		if(e.keyCode == 39) {
			rightPressed = false;
		}
		else if(e.keyCode == 37) {
			leftPressed = false;
		}
	}
	
	function drawPaddle1() {
		
		if ( x + dx > paddle1X){
			paddle1X = paddle1X + 2 * aiSpeed;
		} else if (x + dx < ((paddle1X - (paddle1Width/2)))) {
			paddle1X = paddle1X + 2 * aiSpeed * -1;
		}
		
		ctx.beginPath();
		ctx.rect(paddle1X - (paddle1Width/2), gameCanvas.height-paddle1Height, paddle1Width, paddle1Height);
		ctx.fillStyle = "#EE6622";
		ctx.fill();
		ctx.closePath();
		ctx.drawImage(paddle1_image, paddle1X - (paddle1Width/2), gameCanvas.height-paddle1Height, paddle1Width, paddle1Height);
	}
	
	function drawPaddle2() {
		ctx.beginPath();
		ctx.rect(paddle2X, 0, paddle2Width, paddle2Height);
		ctx.fillStyle = "#EE6622";
		ctx.fill();
		ctx.closePath();
		ctx.drawImage(paddle2_image, paddle2X, 0, paddle2Width, paddle2Height);
	}
	function PlayWallHit() {  

		wallhitsound.play();  
	}   
	function PlaySideWallHit() {  

		sidewallhitsound.play();  
	}
	function PlayPaddleHit() {  

		paddlehitsound.play();  
	}   
	//game loop (16ms = 60fps).
	setInterval(draw, 12);
}

//Play anda pause background music

function PauseSound() {  
	  
	audio.pause();  
}

function PlaySound() {  
	audio.play();  
}
