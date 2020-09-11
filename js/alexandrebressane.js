
	function start() {
	
		var isStopped = false;
	
		var p1Name = prompt("Please enter name for PLAYER 1", "Beavis");
		var p2Name = prompt("Please enter name for PLAYER 2", "Butt Head");
		//SCORE FOR P1
		
		// Drawing canvas....
		
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
		court_image.src = 'court.jpg'; //https://s-media-cache-ak0.pinimg.com/736x/b1/b6/9b/b1b69bf2e5b83272b5efa5180239fe5f.jpg

		ball_image = new Image();
		ball_image.src = 'ball.png'; 

		paddle1_image = new Image();
		paddle1_image.src = 'p1.png'; //https://openclipart.org/detail/27024/led-rectangular-h-blue

		paddle2_image = new Image();
		paddle2_image.src = 'p2.png'; //https://openclipart.org/detail/27027/led-rectangular-h-orange
		

		//Creating game court...
		var gameCanvas = document.getElementById("myCanvas");
		var ctx = gameCanvas.getContext("2d");
		var netLine=document.getElementById("myCanvas");
		var gameNet=netLine.getContext("2d");
		var x = gameCanvas.width/2;
		var y = gameCanvas.height-30;
		var dx = 2;
		var dy = -2;
		
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
		var paddle1X = (gameCanvas.width-paddle1Width)/2;
		var paddle2X = (gameCanvas.width-paddle2Width)/2;
		
		//Initializing the state of controls 
		var rightPressed = false;
		var leftPressed = false;    

		var wallhitsound=document.getElementById("wallhit");
		var sidewallhitsound=document.getElementById("sidewallhit");
		var paddlehitsound=document.getElementById("paddlehit");


		//Creating event listeners for controlls 
		document.addEventListener("keydown", keyDownHandler, false);
		document.addEventListener("keyup", keyUpHandler, false);
		document.addEventListener("mousemove", mouseMoveHandler, false);

		//CONTROLS
		//begin eading mouse movement inside canvas with walls collision on edges accordingly to paddle position on X axis (paddle1X)...
		function mouseMoveHandler(e) {
			var relativeX = e.clientX - gameCanvas.offsetLeft;
			if(relativeX > 0 && relativeX < gameCanvas.width) {
				paddle1X = relativeX - paddle1Width/2;
			}
		}
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
					if(x > paddle2X && x < paddle2X + paddle2Width) {//If the ball hits the paddle, play a sound and invert the forces on ball direction on Y axis (dy)
						PlayPaddleHit();
						dy = -dy;
					}
					else if (y + dy < ballRadius) {//If the ball hits the wall behind player1 scores do player2 and invert the forces on ball direction on Y axis (dy)
						PlayWallHit(); 
						score2 = score2 + 1;
						ctxScore2.clearRect(0,0, 100, 30);
						ctxScore2.fillText(score2,40,20);
						dy = -dy;
					}
				}
				else if((y + dy) > gameCanvas.height-(ballRadius+paddle1Height)){ //If the ball hits the paddle, play a sound and invert the forces on ball direction on Y axis (dy)
					if(x > paddle1X && x < paddle1X + paddle1Width) {
								PlayPaddleHit();
								dy = -dy;
						}
					else if (y + dy > gameCanvas.height-(ballRadius)) { //If the ball hits the wall behind player2 scores do player1 and invert the forces of ball direction on Y axis (dy)
						PlayWallHit();
						score1 = score1 + 1;
						ctx.fillStyle = "#EE6622";
						ctxScore1.clearRect(0,0, 100, 30);
						ctxScore1.fillText(score1,40,20);
						dy = -dy;   
					}            
				}
				
				// check the controls every game loop to update the paddle2 position using keyboard event listener declared before
				if(rightPressed && paddle2X < gameCanvas.width-paddle2Width) {
					paddle2X += 7;
				}
				else if(leftPressed && paddle2X > 0) {
					paddle2X -= 7;
				}
				x += dx;
				y += dy;
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
			ctx.beginPath();
			ctx.rect(paddle1X, gameCanvas.height-paddle1Height, paddle1Width, paddle1Height);
			ctx.fillStyle = "#EE6622";
			ctx.fill();
			ctx.closePath();
			ctx.drawImage(paddle1_image, paddle1X, gameCanvas.height-paddle1Height, paddle1Width, paddle1Height);
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
		setInterval(draw, 16);
	}
	
	//Play anda pause background music
	function PauseSound() {  
		  
		audio.pause();  
	}

	function PlaySound() {  
		audio.play();  
	}
	
	//Loading background music
	var audio = new Audio('./audio/backgroundmusic.mp3');
    