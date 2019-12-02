// floor position
var floorPos_y;

// colour and style
var shoeBlack = "#262020";
var dressRed = "#AA1313";
var skin1A = "#DBBCA5";
var coinAngle = 5;

// object variables
var cloud;
var mindy;
var collectable;
var canyon;
var tree;

// used for debugging, can be set by clicking
var posString;

// character control variables
var isLeft = false;
var isRight = false;
var isGrounded = true;
var isJumping = false;
var isFalling = false;
var isPlummeting = false;

// character position variables
var gameChar_x = 400;
var gameChar_y = 432;

// physics variables
var maxRunSpeed = 5;
var minRunSpeed = 1;
var runSpeed = minRunSpeed;
var runAccel = 1.1;

var maxFallSpeed = 10;
var minFallSpeed = 1;
var fallSpeed = minFallSpeed;
var fallAccel = 1.1;

// multi-object arrays
var trees_x = [10, 65, 130, 590, 650];



function setup()
{
	createCanvas(1024, 576);
	floorPos_y = 432; //NB. we are now using a variable for the floor position

	// initialising var which will contain human-readable form
	// of the co-ordinate of the last mouse click
	posString = "000, 000";

	// make objects for game
	mountain =
	{
		x_pos: width/2-200,
		y_pos: height/2+150,
		size: 10,
		draw(x_pos,y_pos,size)
		{
			if(x_pos === undefined || y_pos === undefined
				|| size === undefined)
			{
				x_pos = this.x_pos;
				y_pos = this.y_pos;
				size = this.size;
			}
			push();
			noStroke();
			translate(x_pos - 573, y_pos - 470);
			fill(190,190,200);
			beginShape();
			// Vary the amount that size affects each vertex
			// to create slightly different looking mountains
			// as the mountain size changes.
			vertex(518-size/2,233-size); // leftmost peak
			vertex(539-size/4,277-size/1.5);
			vertex(574,155-size); // middle peak
			vertex(622+size/4,311-size/1.5);
			vertex(636+size/2,294-size); //rightmost peak
			vertex(683+size/2,470+size);
			vertex(573+size/2,487+size);
			vertex(526,487+size);
			vertex(417-size,476+size);
			endShape(CLOSE);
			pop();
		}
	}
	collectable =
	{
		x_pos: 0,
		y_pos: 0,
		size: 50,
		isFound: false,
		draw(x_pos,y_pos,size)
		{
			if(x_pos === undefined || y_pos === undefined
				|| size === undefined)
			{
				x_pos = this.x_pos;
				y_pos = this.y_pos;
				size = this.size;
			} else {
				this.x_pos = x_pos;
				this.y_pos = y_pos;
				this.size = size;
			}
			var date = new Date();
			var seconds = date.getSeconds();
			size = constrain(size,30,100);
			coinAngle = constrain(coinAngle,-1.5,1.5);
			if(seconds % 2 == 0)
			{

				coinAngle+=0.1;
			}
			else
			{

				coinAngle-=0.1;
			}
			push();
			noStroke();
			translate(x_pos,y_pos);
			ellipseMode(CENTER);
			fill("#DDDD66")
			ellipse(coinAngle-coinAngle*2,0,size-coinAngle,size);
			fill("#FFFF99");
			ellipse(coinAngle,0,size-coinAngle,size);
			pop();
		}
	}
	cloud =
	{
		x_pos: 0,
		y_pos: 0,
		size: 10,
		draw(x_pos,y_pos,size)
		{
			if(x_pos === undefined || y_pos === undefined
				|| size == undefined)
			{
				x_pos = this.x_pos;
				y_pos = this.y_pos;
				size = this.size;
			} else {
				this.x_pos = x_pos;
				this.y_pos = y_pos;
				this.size = size;
			}
			push();
			translate(-200+x_pos,-125+y_pos);
			noStroke();
			fill(240,240,253);
			arc(200,100,100+size,100+size,PI,0);
			arc(160-size/2,125,100+size,100+size,PI,0);
			arc(240+size/2,125,100+size,100+size,PI,0);
			pop();
		}
	}

	// define player object
	mindy =
	{
		x: 0,
		y: 0,
		faceFront(x,y){
			if(x === undefined || y === undefined)
			{
				x = this.x;
				y = this.y;
			} else {
				this.x = x;
				this.y = y;
			}
			////facing forwards
			//SHOES
			noStroke();
			fill(shoeBlack);

			beginShape();
			vertex(x-3,y);
			vertex(x-10,y);
			vertex(x-8,y-7);
			vertex(x-3,y-7);
			endShape(CLOSE);

			beginShape();
			vertex(x+3,y);
			vertex(x+10,y);
			vertex(x+8,y-7);
			vertex(x+3,y-7);
			endShape(CLOSE);

			//ARM
			fill(shoeBlack);
			rect(x-7,y-56,4,13);

			fill(skin1A);
			rect(x-7,y-43,4,10);

			fill(shoeBlack);
			rect(x+3,y-56,4,13);
			fill(skin1A);
			rect(x+3,y-43,4,10);

			//TORSO
			fill(dressRed);
			triangle(x,y-65,
							 x-12,y-3,
							x+11,y-3);
			triangle(x,y-10,
							x-7,y-56,
							x+7,y-56);

			//HEAD
			fill(skin1A);
			beginShape();
			vertex(x-6,y-59);
			vertex(x,y-57);
			vertex(x+6,y-59);
			vertex(x+8,y-65);
			vertex(x+6,y-71);
			vertex(x,y-73);
			vertex(x-6,y-71);
			vertex(x-8,y-65);
			endShape(CLOSE);
		},
		jump(x,y){
				if(x === undefined || y === undefined)
				{
					x = this.x;
					y = this.y;
				} else {
					this.x = x;
					this.y = y;
				}
				noStroke();
				//SHOES
				fill(shoeBlack);
				beginShape();
				vertex(x-3,y-10);
				vertex(x-10,y-8);
				vertex(x-8,y-17);
				vertex(x-4,y-17);
				endShape(CLOSE);

				beginShape();
				vertex(x+3,y-10);
				vertex(x+10,y-8);
				vertex(x+8,y-17);
				vertex(x+4,y-17);
				endShape(CLOSE);

				//ARM
				fill(skin1A);
				rect(x-17,y-64,4,10);

				fill(shoeBlack);
				rect(x-17,y-56,13,4);

				fill(skin1A);
				rect(x+12,y-64,4,10);

				fill(shoeBlack);
				rect(x+3,y-56,13,4 );

				//TORSO
				fill(dressRed);
				triangle(x,y-65,
								 x-13,y-15,
								x+13        ,y-15);
				triangle(x,y-16,
								x-8,y-58,
								x+8,y-58);

				//HEAD
				fill(skin1A);
				beginShape();
				vertex(x-6,y-60);
				vertex(x,y-58);
				vertex(x+6,y-60);
				vertex(x+8,y-66);
				vertex(x+6,y-72);
				vertex(x,y-74);
				vertex(x-6,y-72);
				vertex(x-8,y-66);
				endShape(CLOSE);
		},
		walkLeft(x,y){
			if(x === undefined || y === undefined)
			{
				x = this.x;
				y = this.y;
			} else {
				this.x = x;
				this.y = y;
			}

			noStroke();
			//SHOES
				fill(shoeBlack);

				beginShape();
				vertex(x+3,y);
				vertex(x-4,y);
				vertex(x-2,y-7);
				vertex(x+3,y-7);
				endShape(CLOSE);

				//ARM
				fill(shoeBlack);
				rect(x-7,y-56,4,13);

				fill(skin1A);
				rect(x-7,y-43,4,10);

				//TORSO
				fill(dressRed);
				triangle(x,y-65,
								 x-10,y-3,
								x+9,y-3);
				triangle(x,y-10,
								x-7,y-56,
								x+7,y-56);

				//HEAD
				fill(skin1A);
				beginShape();
				vertex(x-6,y-59);
				vertex(x,y-57);
				vertex(x+6,y-59);
				vertex(x+8,y-65);
				vertex(x+6,y-71);
				vertex(x,y-73);
				vertex(x-6,y-71);
				vertex(x-8,y-65);
				endShape(CLOSE);

				//ARM ON TOP
				fill(shoeBlack);
				rect(x+3,y-56,4,13);
				fill(skin1A);
				rect(x+3,y-43,4,10);
		},
		walkRight(x,y){
			if(x === undefined || y === undefined)
			{
				x = this.x;
				y = this.y;
			} else {
				this.x = x;
				this.y = y;
			}

			noStroke();
			//SHOES
			fill(shoeBlack);

			beginShape();
			vertex(x-3,y);
			vertex(x+4,y);
			vertex(x+2,y-7);
			vertex(x-3,y-7);
			endShape(CLOSE);

			//ARM
			fill(shoeBlack);
			rect(x+3,y-56,4,13);
			fill(skin1A);
			rect(x+3,y-43,4,10);

			//TORSO
			fill(dressRed);
			triangle(x,y-65,
							 x-9,y-3,
							x+10,y-3);
			triangle(x,y-10,
							x-7,y-56,
							x+7,y-56);

			//HEAD
			fill(skin1A);
			beginShape();
			vertex(x-6,y-59);
			vertex(x,y-57);
			vertex(x+6,y-59);
			vertex(x+8,y-65);
			vertex(x+6,y-71);
			vertex(x,y-73);
			vertex(x-6,y-71);
			vertex(x-8,y-65);
			endShape(CLOSE);

			//ARM ON TOP
			fill(shoeBlack);
			rect(x-7,y-56,4,13);

			fill(skin1A);
			rect(x-7,y-43,4,10);
		},
		jumpLeft(x,y){
			if(x === undefined || y === undefined)
			{
				x = this.x;
				y = this.y;
			} else {
				this.x = x;
				this.y = y;
			}

			//SHOES
			fill(shoeBlack);

			beginShape();
			vertex(x-3,y-10);
			vertex(x-10,y-8);
			vertex(x-8,y-17);
			vertex(x-4,y-17);
			endShape(CLOSE);

			beginShape();
			vertex(x+3,y-10);
			vertex(x+10,y-8);
			vertex(x+8,y-17);
			vertex(x+4,y-17);
			endShape(CLOSE);

			//ARM
			fill(skin1A);
			rect(x-17,y-64,4,10);

			fill(shoeBlack);
			rect(x-17,y-56,13,4);

			//TORSO
			fill(dressRed);
			triangle(x,y-65,
							 x-13,y-15,
							x+13        ,y-15);
			triangle(x,y-16,
							x-8,y-58,
							x+8,y-58);


			//ARM ON TOP
			fill(skin1A);
			rect(x+12,y-53,4,10);
			fill(shoeBlack);
			rect(x+3,y-56,13,4 );

			//HEAD
			fill(skin1A);
			beginShape();
			vertex(x-6,y-60);
			vertex(x,y-58);
			vertex(x+6,y-60);
			vertex(x+8,y-66);
			vertex(x+6,y-72);
			vertex(x,y-74);
			vertex(x-6,y-72);
			vertex(x-8,y-66);
			endShape(CLOSE);
		},
		jumpRight(x,y){
			if(x === undefined || y === undefined)
			{
				x = this.x;
				y = this.y;
			} else {
				this.x = x;
				this.y = y;
			}
			noStroke();
			//SHOES
			fill(shoeBlack);

			beginShape();
			vertex(x-3,y-10);
			vertex(x-10,y-8);
			vertex(x-8,y-17);
			vertex(x-4,y-17);
			endShape(CLOSE);

			beginShape();
			vertex(x+3,y-10);
			vertex(x+10,y-8);
			vertex(x+8,y-17);
			vertex(x+4,y-17);
			endShape(CLOSE);

			//ARM
			fill(skin1A);
			rect(x+12,y-64,4,10);
			fill(shoeBlack);
			rect(x+3,y-56,13,4 );

			//TORSO
			fill(dressRed);
			triangle(x,y-65,
							 x-13,y-15,
							x+13        ,y-15);
			triangle(x,y-16,
							x-8,y-58,
							x+8,y-58);

			//HEAD
			fill(skin1A);
			beginShape();
			vertex(x-6,y-60);
			vertex(x,y-58);
			vertex(x+6,y-60);
			vertex(x+8,y-66);
			vertex(x+6,y-72);
			vertex(x,y-74);
			vertex(x-6,y-72);
			vertex(x-8,y-66);
			endShape(CLOSE);

			//ARM ON TOP
			fill(skin1A);
			rect(x-17,y-54,4,10);

			fill(shoeBlack);
			rect(x-17,y-56,13,4);
		}
	}

	tree =
	{
		x_pos: 0,
		y_pos: 0,
		draw(x_pos,y_pos)
		{
			if(x_pos === undefined || y_pos === undefined)
			{
				x_pos = this.x_pos;
				y_pos = this.y_pos;
			} else {
				this.x_pos = x_pos;
				this.y_pos = y_pos;
			}
			push();
			translate(x_pos-904-11,y_pos-487);
			noStroke();
			fill("#543628");
			rect(904,417,22,70);
			fill("#008000");
			triangle(915,385,872,460,958,460);
			triangle(915,369,876.3,436,953.7,436);
			triangle(915,353,880,412.5,950,413);
			pop();
		}
	}

	canyon =
	{
		x_pos: 300,
		width: 20,
		draw(x_pos,width)
		{
			if(x_pos === undefined || width === undefined)
			{
				x_pos = this.x_pos;
				width = this.width;
			} else {
				this.x_pos = x_pos;
				this.width = width;
			}
			push();
			noStroke();
			translate(x_pos-100, 0);
			fill("#422c22");
			triangle(50-width/2,432,100,700,100+width/2,432);
			pop();
		}
	}

}

function draw()
{
	// falling mechanics (should be at the top)
	if(isPlummeting)
	{
		console.log("AAUGH");
		fallSpeed *= fallAccel;
	}

	// check if the character is on the ground
	if (gameChar_y >= floorPos_y && isPlummeting === false)
	{
		isGrounded = true;
		gameChar_y = floorPos_y;
		fallSpeed = minFallSpeed;
	} else {
		isGrounded = false;

		if (fallSpeed < maxFallSpeed)
		{
			fallSpeed *= fallAccel;
		}
		gameChar_y  += fallSpeed;
	}



	// move the character left and right
	if (isLeft)
	{
		if (runSpeed < maxRunSpeed)
		{
			runSpeed *= runAccel;
		}
		gameChar_x -= runSpeed;
	}
	else if (isRight)
	{
		{
			if (runSpeed < maxRunSpeed)
			{
				runSpeed *= runAccel;
			}
			gameChar_x += runSpeed;
		}
	}

	background(160, 170, 230); //fill the sky blue
	noStroke();
	// draw background scenery
	mountain.draw();
	tree.draw(width/2-330,floorPos_y);
	cloud.draw(100,170,40);
	cloud.draw(600,105,10);
	cloud.draw(900,222,-10);

	// draw floor
	fill("#008000");
	rect(0, floorPos_y, height, width - floorPos_y); //draw some green ground
	canyon.draw();

	// prevent character from remaining in a jump state forever
	// (corrects bug which allows hover-mode)
	if (isGrounded == true)
	{
		isJumping = false;
	}
	// draw player character
	if (isJumping == true && isLeft == true)
	{
		mindy.jumpLeft(gameChar_x, gameChar_y);
	}
	else if (isJumping == true && isRight == true)
	{
		mindy.jumpRight(gameChar_x, gameChar_y);
	}
	else if (isLeft == true)
	{
		mindy.walkLeft(gameChar_x,gameChar_y);
	}
	else if (isRight == true)
	{
		mindy.walkRight(gameChar_x,gameChar_y);
	}
	else if (isJumping == true && isLeft == true)
	{
		mindy.jumpLeft(gameChar_x, gameChar_y);
	}
	else if (isJumping == true && isRight == true)
	{
		mindy.jumpRight(gameChar_x, gameChar_y);
	}
	else if (isJumping == true)
	{
		if (isGrounded == false)
		{
			mindy.jump(gameChar_x, gameChar_y);
		} else {
			mindy.faceFront(gameChar_x,gameChar_y);
		}
	} else {
		mindy.faceFront(gameChar_x,gameChar_y);
	}

	// draw foreground

	// draw collectable unless it's found
	if(collectable.isFound === false)
	{
		collectable.draw(100, 415, 30);
	}

	// is player by collectable?
	if(dist(collectable.x_pos, collectable.y_pos,
	gameChar_x, gameChar_y) < 20)
	{
		collectable.isFound = true;
	}



	// is player above canyon and on/below the ground?
	if (gameChar_x < canyon.x_pos + 5 && gameChar_x > canyon.x_pos - 55 &&
	mindy.y >= floorPos_y)
	{
		// fall down the hole
		console.log(isPlummeting);
		isPlummeting = true;
	}



	// state postion (for debugging)
	fill("#202211");
	rect(0,0,15*posString.length,40);
	fill("#04EF03")
	textSize(20);
	textFont("monospace");
	text(posString,8,25);
}

function keyPressed()
{
	if (keyCode == 37 || keyCode == 65)
	{
		isLeft = true;
		console.log("isLeft = "+ isLeft);
	}
	else if (keyCode == 39 || keyCode == 68)
	{
		isRight = true;
		console.log("isRight = "+ isRight);
	}
	else if (keyCode == 32 || keyCode == 38 || keyCode == 87)
	{
		isJumping = true;
		console.log("isJumping = "+ isJumping);
		if (isGrounded == true)
		{
			gameChar_y -= 100;
		}
	}
}

function keyReleased()
{
	if (keyCode == 37 || keyCode == 65)
	// if left or a is pressed
	{
		isLeft = false;
		console.log("isLeft = "+ isLeft);
		runSpeed = minRunSpeed;
	}
	else if (keyCode == 39 || keyCode == 68)
	// if right or d is pressed
	{
		isRight = false;
		console.log("isRight = "+ isRight);
		runSpeed = minRunSpeed;
	}
	else if (keyCode == 32 || keyCode == 38 || keyCode == 87)
	// if space or w is pressed
	{
		isJumping = false;
		console.log("isJumping = "+ isJumping);
	}
}

function mousePressed()
{
	gameChar_x = mouseX;
	gameChar_y = mouseY;
	posString = mouseX+", "+mouseY;
}
