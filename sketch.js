// environment positioning variables
var floorPos_y;
var scrollPos = 0;
var floorPos_y = 432; //NB. we are now using a variable for the floor position

// initialising var which will contain human-readable form
// of the co-ordinate of the last mouse click - this is for debugging
var posString = "000, 000";

// colour and style
var shoeBlack = "#262020";
var dressRed = "#AA1313";
var skin1A = "#DBBCA5";
var coinAngle = 5;

// player object variable
var mindy;

// environment object variables
var cloud;
var coin;
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
var gameChar_world_x = gameChar_x - scrollPos;
// width of character's feet (used for adjusting hitboxes)
var gameChar_baseWidth = 20;

// physics variables
var maxRunSpeed = 5;
var minRunSpeed = 1;
var runSpeed = minRunSpeed;
var runAccel = 1.1;

var maxFallSpeed = 10;
var minFallSpeed = 1;
var fallSpeed = minFallSpeed;
var fallAccel = 1.1;

// declare multi-object arrays
var trees_x;
var clouds;
var canyons;
var mountains;


function setup()
{
	createCanvas(1024, 576);



	// make environment objects for game
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
		},
		drawMountains(allMountains)
		{
			for (var i = 0; i < allMountains.length; i++)
			{
				mountain.draw(allMountains[i].x,allMountains[i].y,
					allMountains[i].size);
			}
		}
	}
	coin =
	{
		x_pos: 0,
		y_pos: 0,
		size: 50,
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
				coinAngle += 0.1;
			}
			else
			{
				coinAngle -= 0.1;
			}
			push();
			noStroke();
			translate(x_pos, y_pos);
			ellipseMode(CENTER);
			fill("#DDDD66")
			ellipse(coinAngle-coinAngle*2,0,size-coinAngle,size);
			fill("#FFFF99");
			ellipse(coinAngle,0,size-coinAngle,size);
			pop();
		},
		drawCollectables(t_collectable)
		{
			for (var i = 0; i < t_collectable.length; i++)
			{
				// draw coin unless it's found
				if(t_collectable[i].isFound === false)
				{
					coin.draw(t_collectable[i].x, t_collectable[i].y, t_collectable[i].size);
				}
			}
		},
		checkCollectables(t_collectable)
		{
			for (var i = 0; i < t_collectable.length; i++)
			{
				// is player by coin?
				if(dist(t_collectable[i].x + scrollPos, t_collectable[i].y,
					gameChar_x, gameChar_y - 10) < t_collectable[i].size/2 + 10)
				{
					// set coin's isFound value to true if player is close enough
					t_collectable[i].isFound = true;
				}
			}
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
		},
		drawClouds(allClouds)
		{
			for (var i = 0; i < allClouds.length; i++)
			{
				cloud.draw(allClouds[i].x,allClouds[i].y,allClouds[i].size);
			}
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
		},
		drawTrees(allTrees)
		{
			for (var i = 0; i < allTrees.length; i++)
			{
				tree.draw(allTrees[i],floorPos_y);
			}
		}
	}

	canyon =
	{
		x_pos: 300,
		width: 50,
		drawCanyon(x_pos,width)
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
			this.leftBound = x_pos + gameChar_baseWidth/2;
			this.rightBound = x_pos + width - gameChar_baseWidth/2;
			noStroke();
			fill("#422c22");
			rect(x_pos,floorPos_y,width,300);
			fill(0,0,0,40);
			rect(x_pos + (width/4),floorPos_y,width/2,300);
			rect(x_pos + (width/6),floorPos_y,width/3*2,300);
			pop();
		},

	}

	// multi-object arrays
	trees_x = [10, 65, 130, 540, 674, 2000];
	clouds =
		[
			{
				x: 100, y: 170, size: 40
			},
			{
				x: 600, y: 105, size: 10
			},
			{
				x: 900, y: 222, size: -10
			},
			{
				x: 1100, y: 170, size: 40
			},
			{
				x: 1300, y: 300, size: 40
			},
			{
				x: 1800, y: 100, size: 60
			},
			{
				x: 2250, y: 300, size: 40
			}
		];
	canyons =
		[
			{x: 340, width: 50},
			{x: 600, width: 60},
			{x: 800, width: 50},
			{x: 1000, width: 50},
			{x: 1500, width: 65},
			{x: 1700, width: 100}
		]
	collectables =
		[
			{x: 100, y: 415, size: 30, isFound: false},
			{x: 800, y: 300, size: 100, isFound: false},
			{x: 1500, y: 400, size: 40, isFound: false}
		]
	mountains =
		[
			{x: 312, y: 438, size: 10},
			{x: 600, y: 438, size: 20},
			{x: 1004, y: 438, size: 10},
			{x: 2004, y: 438, size: 100}
		]
}


function draw()
{
	gameChar_world_x = gameChar_x - scrollPos;

	// falling mechanics
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

	// move the character left and right, now with SCROLLING
	if (isLeft)
	{
		if (runSpeed < maxRunSpeed)
		{
			runSpeed *= runAccel;
		}
		if(gameChar_x > width * 0.3)
		{
			gameChar_x -= runSpeed;
		} else {
			scrollPos += runSpeed;
		}
	}
	else if (isRight)
	{
		if (runSpeed < maxRunSpeed)
		{
			runSpeed *= runAccel;
		}
		if (gameChar_x < width * 0.7)
		{
			gameChar_x += runSpeed;
		} else {
			scrollPos -= runSpeed;
		}
	}

	// NON-CHARACTER CODE BEGINS
	push();
	translate(scrollPos, 0);

	background(160, 170, 230); //fill the sky blue
	noStroke(); // disable strokes (the graphics in this game do not use any)

	// draw background scenery
	mountain.drawMountains(mountains);

	// TREE CODE HERE
	tree.drawTrees(trees_x);
	// END TREE CODE

	// CLOUD CODE
		cloud.drawClouds(clouds);
	// END CLOUD CODE

	// draw floor
	fill("#008000");
	rect(0, floorPos_y, width*3, height - floorPos_y);

	// CANYON CODE
	for (var i = 0; i < canyons.length; i++)
	{
		canyon.drawCanyon(canyons[i].x,canyons[i].width);
		// is player above canyon and on/below the ground?
		if (gameChar_x > canyon.leftBound + scrollPos
			&& gameChar_x < canyon.rightBound + scrollPos
			&& mindy.y >= floorPos_y)
		{
			// fall down the hole
			console.log(isPlummeting);
			isPlummeting = true;
		}
	}
	// END CANYON CODE

	// COIN CODE
	coin.drawCollectables(collectables);
	coin.checkCollectables(collectables);
	// END COIN CODE

	pop();
	// NON-CHARACTER CODE ENDS

	// CHARACTER CODE BEGINS

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
