// game mechanics variables
var lives;
var game_score = 0;

// environment positioning variables
var scrollPos = 0;
var floorPos_y = 432; //NB. we are now using a variable for the floor position

// colour and style
var shoeBlack = "#262020";
var dressRed = "#AA1313";
var skin1A = "#DBBCA5";
var brown = "#422c22";
var lightBlue = "#5BCFFA";
var pink = "#F5ABB9";
var white = "#FFFFFF";
var lightGold = "#DDDD66";
var darkGold = "#FFFF99";
var grassGreen = "#408000";
var offWhite = "#F0F0fD"
var mountainGrey = "#c5c5c9";
var coinAngle = 5;

// player object variable
var mindy;

// environment object variables
var cloud;
var collectable;
var canyon;
var tree;

// used for debugging, can be set by clicking
var game_score;

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
// character's position relative to world
var gameChar_world_x = gameChar_x - scrollPos;
// width of character's feet (used for adjusting hitboxes)
var gameChar_baseWidth = 20;

// physics variables
// running
var maxRunSpeed;
var minRunSpeed;
var runSpeednRunSpeed;
var runAccel1;
// falling
var maxFallSpeed;
var minFallSpeed;
var fallSpeed;
var fallAccel;

// declare multi-object arrays
var trees;
var clouds;
var canyons;
var mountains;
var flagpole;

var firstFrame = true;

function displayMessage(text1, offset1, text2, offset2)
{
	pop();
	fill(shoeBlack);
	rect(width/2-350+offset1,65, text1.length*77.7, 200);
	fill(dressRed);
	textSize(120);
	text(text1, width/2-330+offset1,190);
	textSize(30);
	text
	text(text2, width/2-210+offset2,235);
	push();
}

function startGame()
{
	// set default font for game
	textFont("monospace");

	// on first frame of draw function, unless the character
	// is out of lives, reset the positioning, physics and score variables
	if(firstFrame === true && lives > 1)
	{
		// reset character position variables
		gameChar_x = 400;
		gameChar_y = 432;
		// reset character's position relative to world
		gameChar_world_x = gameChar_x - scrollPos;
		// physics variables
		// running
		maxRunSpeed = 5;
		minRunSpeed = 1;
		runSpeed = minRunSpeed;
		runAccel = 1.1;
		// falling
		maxFallSpeed = 10;
		minFallSpeed = 1;
		fallSpeed = minFallSpeed;
		fallAccel = 1.1;

		scrollPos = 0;
		game_score = 0;

		// character control variables
		isLeft = false;
		isRight = false;
		isGrounded = true;
		isJumping = false;
		isFalling = false;
		isPlummeting = false;
	}

	// multi-object arrays containing game items
	mountains =
		[
			{x: 312, y: 438, size: 10},
			{x: 600, y: 438, size: 20},
			{x: 1004, y: 438, size: 10},
			{x: 2004, y: 438, size: 100},
			{x: 2730, y: 438, size: 70},
			{x: 2730, y: 500, size: 70},
			{x: 2960, y: 500, size: 70},
			{x: 2730, y: 438, size: 70},
			{x: 3400, y: 860, size: 300}
		];

	collectables =
		[
			{x: 100, y: 415, size: 30, isFound: false},
			{x: 800, y: 300, size: 100, isFound: false},
			{x: 1490, y: 400, size: 40, isFound: false},
			{x: 3108, y: 415, size: 40, isFound: false},
			{x: 3278, y: 300, size: 50, isFound: false},
			{x: 3500, y: 415, size: 40, isFound: false},
			{x: 3600, y: 415, size: 40, isFound: false},
		];

		clouds =
			[
				{ x: 100, y: 170, size: 40 },
				{ x: 600, y: 105, size: 10 },
				{ x: 900, y: 222, size: -10 },
				{ x: 1100, y: 170, size: 40 },
				{ x: 1300, y: 300, size: 40 },
				{ x: 1800, y: 100, size: 60 },
				{ x: 2170, y: 300, size: 20 },
				{ x: 2250, y: 190, size: 30 },
				{ x: 2600, y: 280, size: 40 },
				{ x: 2800, y: 160, size: 30 },
			];

	trees = [10, 65, 130, 540, 674, 1340, 1899, 2000, 2631, 2752];

	canyons =
		[
			{x: 340, width: 50},
			{x: 600, width: 60},
			{x: 800, width: 50},
			{x: 1000, width: 50},
			{x: 1500, width: 65},
			{x: 1700, width: 100},
			{x: 2909, width: 135},
			{x: 3304, width: 100}

		];

	flagpole =
		{
			x_pos: 4000, isReached: false, rotation: 1.7, accel: 0.01, vel: 0
		}

	// make environment objects for game and methods for drawing them
	// and handling collision detection
	mountain =
	{

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
			fill(mountainGrey);
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
		drawAll(allMountains)
		{
			for (var i = 0; i < allMountains.length; i++)
			{
				mountain.draw(allMountains[i].x,allMountains[i].y,
					allMountains[i].size);
			}
		}
	}
	collectable =
	{

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
			if(seconds % 2 === 0)
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
			fill(lightGold)
			ellipse(coinAngle-coinAngle*2,0,size-coinAngle,size);
			fill(darkGold);
			ellipse(coinAngle,0,size-coinAngle,size);
			pop();
		},
		drawAll(t_collectable)
		{
			for (var i = 0; i < t_collectable.length; i++)
			{
				// draw collectable unless it's found
				if(t_collectable[i].isFound === false)
				{
					collectable.draw(t_collectable[i].x, t_collectable[i].y, t_collectable[i].size);
				}
			}
		},
		check(t_collectable)
		{
			for (var i = 0; i < t_collectable.length; i++)
			{
				// is player by collectable?
				// set collectable's isFound value to true if player is close enough
				if(dist(t_collectable[i].x, t_collectable[i].y,
					gameChar_world_x, gameChar_y - 10) < t_collectable[i].size/2 + 10)
				{
					// increment score but only if the coin isn't yet found
					if(t_collectable[i].isFound === false) { game_score++ };
					t_collectable[i].isFound = true;
				}
			}
		}
	}
	cloud =
	{

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
			push();
			translate(-200+x_pos,-125+y_pos);
			noStroke();
			fill(offWhite);
			arc(200,100,100+size,100+size,PI,0);
			arc(160-size/2,125,100+size,100+size,PI,0);
			arc(240+size/2,125,100+size,100+size,PI,0);
			pop();
		},
		drawAll(allClouds)
		{
			for (var i = 0; i < allClouds.length; i++)
			{
				cloud.draw(allClouds[i].x,allClouds[i].y,allClouds[i].size);
			}
		}
	}
	tree =
	{

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
			fill(brown);
			rect(904,417,22,70);
			fill(grassGreen);
			triangle(915,385,872,460,958,460);
			triangle(915,369,876.3,436,953.7,436);
			triangle(915,353,880,412.5,950,413);
			pop();
		},
		drawAll(allTrees)
		{
			for (var i = 0; i < allTrees.length; i++)
			{
				tree.draw(allTrees[i],floorPos_y);
			}
		}
	}
	canyon =
	{

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
			noStroke();
			fill(brown);
			rect(x_pos,floorPos_y,width,300);
			fill(0,0,0,40);
			rect(x_pos + (width/4),floorPos_y,width/2,300);
			rect(x_pos + (width/6),floorPos_y,width/3*2,300);
			pop();
		},
		drawAll(t_canyon)
		{
			for (var i = 0; i < t_canyon.length; i++)
			{
				canyon.drawCanyon(t_canyon[i].x,t_canyon[i].width);
			}
		},
		check(t_canyon)
		{
			for (var i = 0; i < t_canyon.length; i++)
			{

				// calculate canyon boundaries based on width of character
				// and width of canyon
				t_canyon[i].leftBound = t_canyon[i].x + gameChar_baseWidth/2;
				t_canyon[i].rightBound = t_canyon[i].x +
					t_canyon[i].width - gameChar_baseWidth/2;

				// is player in line with canyon and at ground-level?
				if (gameChar_world_x > t_canyon[i].leftBound
					&& gameChar_world_x < t_canyon[i].rightBound
					&& mindy.y >= floorPos_y)
				{
					// fall down the hole
					isPlummeting = true;
				}
			}
		}
	}

	// define player object and methods for drawing her
	mindy =
	{
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

	// make sure lives don't decrement at setup
	if(firstFrame === true)
	{
		lives--;
	}

	// ensure the setup code for when the character has respawned/spawned
	// doesn't run every frame.
	firstFrame = false;
}

function renderLives(x,y)
{
	// set default values for x and y
	if (x === undefined || y === undefined)
	{
		x = 970;
		y = 30;
	}
	push();
	fill(shoeBlack);
	rect(855,60,161,-60);
	translate(x,y);
	fill(dressRed);
	// draw crosses for number of lives minus one
	for (var i = 0; i < lives; i++)
	{
		rect(0,0,30,10);
		rect(20,-10,-10,30);
		translate(-50,0);
	}
	pop();
}

function checkFlagpole()
{
	var distance = gameChar_world_x - flagpole.x_pos;
	if(distance < 10 && distance > -10)
	{
		flagpole.isReached = true;
	}
}

function renderFlagpole()
{
	var x = flagpole.x_pos;
	var y = floorPos_y;
	var height = 40;
	var rotation = flagpole.rotation;
	var isReached = flagpole.isReached;
	var jitterToggle = false;

	// move centre to enable rotation
	translate(x, y);

	// if player reaches flag, put it up
	if (flagpole.isReached === true)
	{
		// alter rotation in flag's data object for animation
		if(frameCount % 3 === 0 && flagpole.rotation > 0)
		{
			flagpole.vel += flagpole.accel;
			flagpole.rotation-= flagpole.vel;
		}

		//simulate wind
		if(frameCount % 10 === 0){rotation += 0.01;}

		// animate flag!
		rotate(rotation);
		fill(brown);
		rect(0,0,10,-135);
		fill(lightBlue);
		rect(10,-100,60, height/5);
		fill(pink);
		rect(10,-100-height/5,60, height/5);
		fill(white);
		rect(10,-100-height/5*2,60, height/5);
		fill(pink);
		rect(10,-100-height/5*3,60, height/5);
		fill(lightBlue);
		rect(10,-100-height/5*4,60, height/5);

	//otherwise, draw it on the ground
	} else {
		rotation = TAU/4;
		rotate(rotation);
		fill(brown);
		rect(0,0,10,-135);
		fill(lightBlue);
		rect(10,-100,60, height/5);
		fill(pink);
		rect(10,-100-height/5,60, height/5);
		fill(white);
		rect(10,-100-height/5*2,60, height/5);
		fill(pink);
		rect(10,-100-height/5*3,60, height/5);
		fill(lightBlue);
		rect(10,-100-height/5*4,60, height/5);
	}
}

function setup()
{
	createCanvas(1024, 576);
	frameRate(60);
	lives = 4;
	if(lives > 0)
	{

		startGame();
	}
}

function draw()
{
	push();
	// scroll world if required
	translate(scrollPos, 0);

	background(160, 170, 230); //fill the sky blue
	noStroke(); // disable strokes (the graphics in this game do not use any)

	// draw background scenery
	mountain.drawAll(mountains);

	// tree code
	tree.drawAll(trees);
	// tree code end

	// cloud code
	cloud.drawAll(clouds);
	// cloud code end

	// draw floor
	fill(grassGreen);
	rect(-scrollPos, floorPos_y, width, height - floorPos_y);
	// draw floor end

	// canyon code
	canyon.drawAll(canyons);
	canyon.check(canyons);
	// canyon code end

	// collectable code
	collectable.drawAll(collectables);
	collectable.check(collectables);
	// collectable code end

	// flagpole code
	renderFlagpole();
	checkFlagpole();
	// flagpole code end

	// game over & level complete code begins
	// if character is out of lives, game over
	if(lives < 1)
	{
		displayMessage("GAME OVER", 0, "Press space to continue.", 0);
	}

	// if flag is reached, success message
	if(flagpole.isReached === true)
	{
		displayMessage("YOU WIN", 100, "Press space to continue.", 0);
	}
	// game over and level complete code ends

	// has player died?
	if (gameChar_y > 600 && lives > 0)
	{
		firstFrame = true;
		startGame();
	}
	// has player died? end


	pop();

	// CHARACTER LOGIC BEGINS

	// draw player character
	if (isJumping === true && isLeft === true)
	{
		mindy.jumpLeft(gameChar_x, gameChar_y);
	}
	else if (isJumping === true && isRight === true)
	{
		mindy.jumpRight(gameChar_x, gameChar_y);
	}
	else if (isLeft === true)
	{
		mindy.walkLeft(gameChar_x,gameChar_y);
	}
	else if (isRight === true)
	{
		mindy.walkRight(gameChar_x,gameChar_y);
	}
	else if (isJumping === true && isLeft === true)
	{
		mindy.jumpLeft(gameChar_x, gameChar_y);
	}
	else if (isJumping === true && isRight === true)
	{
		mindy.jumpRight(gameChar_x, gameChar_y);
	}
	else if (isJumping === true)
	{
		if (isGrounded === false)
		{
			mindy.jump(gameChar_x, gameChar_y);
		} else {
			mindy.faceFront(gameChar_x,gameChar_y);
		}
	} else {
		mindy.faceFront(gameChar_x,gameChar_y);
	}
	// draw character END

	// falling mechanics
	if(isPlummeting)
	{
		console.log(fallAccel, fallSpeed);
		if(fallSpeed < 2) { fallSpeed = 5.5; }
		if(gameChar_y < floorPos_y) { gameChar_y = floorPos_y; }
		fallSpeed *= fallAccel;
		runSpeed = 0; // prevent character from leaving edge of canyon
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
	// check if the character is on the ground END

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
	// character left/right movement END

	// prevent character from remaining in a jump state forever
	// (corrects bug which allowed hover-mode)
	// must run after other mechanics code
	if (isGrounded === true)
	{
		isJumping = false;
	}

	// show life tokens
	renderLives(970,30);

	// Display Score
	push();
	textStyle(BOLD);
	fill(shoeBlack);
	rect(0,0,15*game_score.toString.length+15,40);
	fill(dressRed)
	textSize(20);
	text(game_score,8,25);
	pop();

	// update character's position relative to world
	gameChar_world_x = gameChar_x - scrollPos;
}

function keyPressed()
{

	// game level control
	// if(flagpole.isReached && key === ' ')
	// {
	//     nextLevel();
	//     return
	// }
	// else if(lives === 0 && key === ' ')
	// {
	//     returnToStart();
	//     return
	// }
	// game level control end

	// character control
	if (keyCode === 37 || keyCode === 65)
	{
		isLeft = true;
	}
	else if (keyCode === 39 || keyCode === 68)
	{
		isRight = true;
	}
	else if (keyCode === 32 || keyCode === 38 || keyCode === 87)
	{
		isJumping = true;
		if (isGrounded === true)
		{
			gameChar_y -= 100;
		}
	}
	// character control end
}

function keyReleased()
{
	if (keyCode === 37 || keyCode === 65)
	// if left or a is pressed
	{
		isLeft = false;
		runSpeed = minRunSpeed;
	}
	else if (keyCode === 39 || keyCode === 68)
	// if right or d is pressed
	{
		isRight = false;
		runSpeed = minRunSpeed;
	}
	else if (keyCode === 32 || keyCode === 38 || keyCode === 87)
	// if space, up or w is pressed
	{
		isJumping = false;
	}
}

function mousePressed()
{
	console.log(round(mouseX-scrollPos),round(mouseY));
}
