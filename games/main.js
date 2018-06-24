/**
 * clear each canvas to a predetermined fillcolor, preparing it for a fresh render
 */
function clearScreen() {
	//main canvas
	//clear to sky gradient

	// Fill with gradient
	ctx.fillStyle=skyGradient;
	ctx.fillRect(0,0,cnv.width,cnv.height);
	
	//HUD canvas
	uictx.fillStyle="rgb(0,0,0)";
	uictx.fillRect(0,0,uicnv.width,uicnv.height);
}

/**
 * render all objects and HUD elements
 */
function render() {
	//clear all canvases for a fresh render
	clearScreen();
	if (loading) {
		drawLoadingText();
		return;
	}
	
	drawTerrain();
	drawWalls();
	drawTargets();
	drawPlayer();
	
	if (placing) {
		drawPlacer();
	}
	
	if (choosingPower) {
		drawPowerBar();
	}
	
	drawBullets();
	
	drawAmmo();
	drawFuel();
	
	if (gameWon) {
		drawWinText();
	}
	else if (gameLost) {
		drawLoseText();
	}
	
	//finally draw the HUD
	drawHUD();
}

/**
 * draw loading screen text
 */
function drawLoadingText() {
	ctx.font = "36px Arial";
	ctx.fillStyle = "white";
	ctx.textAlign="center";
	ctx.fillText("Loading...",cnv.width/2,cnv.height/2);
	ctx.textAlign="start";
}

/**
 * draw victory text
 */
function drawWinText() {
	ctx.font = "36px Arial";
	ctx.fillStyle = "white";
	ctx.textAlign="center";
	ctx.fillText("You Win!",cnv.width/2,cnv.height/2);
	ctx.textAlign="start";
}

/** 
 * draw losing text
 */
 function drawLoseText() {
	 ctx.font = "36px Arial";
	ctx.fillStyle = "white";
	ctx.textAlign="center";
	ctx.fillText("You Lose!",cnv.width/2,cnv.height/2);
	ctx.textAlign="start";
 }

/**
 * draw all bullets in order
 */
function drawBullets() {
	for (let i = 0; i < bullets.length; ++i) {
		ctx.beginPath();
		ctx.arc(bullets[i].x,bullets[i].y,bulletRadius,0,2*Math.PI);
		ctx.closePath();
		ctx.lineWidth = 1;
		ctx.fillStyle = 'white';
		ctx.fill();
		ctx.strokeStyle = 'black';
		ctx.stroke();
	}
}

/**
 * draw a power indicator while the player is preparing a shot
 */
function drawPowerBar() {
	//calculate max power triangle points
	let pt0 = gunFinalPos;
	let pt1 = {x:pt0.x + Math.cos(playerShotAng-.2) * 100,y:pt0.y + Math.sin(playerShotAng-.2) * 100};
	let pt2 = {x:pt0.x + Math.cos(playerShotAng+.2) * 100,y:pt0.y + Math.sin(playerShotAng+.2) * 100};
	//draw triangle
	ctx.fillStyle = '#FF0000';
	ctx.beginPath();
	ctx.moveTo(pt0.x,pt0.y);
    ctx.lineTo(pt1.x,pt1.y);
    ctx.lineTo(pt2.x,pt2.y);
    ctx.fill();
	
	//calculate power triangle points
	pt1 = {x:pt0.x + Math.cos(playerShotAng-.2) * power,y:pt0.y + Math.sin(playerShotAng-.2) * power};
	pt2 = {x:pt0.x + Math.cos(playerShotAng+.2) * power,y:pt0.y + Math.sin(playerShotAng+.2) * power};
	//draw triangle
	ctx.fillStyle = '#00FF00';
	ctx.beginPath();
	ctx.moveTo(pt0.x,pt0.y);
    ctx.lineTo(pt1.x,pt1.y);
    ctx.lineTo(pt2.x,pt2.y);
    ctx.fill();
}

/**
 * draw a meter indicating remaining fuel
 */
 function drawFuel() {
 	ctx.font = "12px Arial";
	ctx.fillStyle = "white";
	ctx.fillText("Fuel",20,20);
 	ctx.fillStyle = "#CC4400";
 	ctx.fillRect(20,30,100,20);
 	ctx.fillStyle = "#BBFF00";
 	ctx.fillRect(20,30,100 * (fuel/maxFuel),20);
 }

/**
 * draw a bullet sprite for each shot available to the player
 */
 function drawAmmo() {
 	for (let i = 0; i < numShots; ++i) {
 		drawCentered("bullet",ctx, 150 + 35*i, 40);
 	}	
 }
 
/**
 * draw the player tank
 */
 function drawPlayer() {
 	//draw tank body
 	ctx.beginPath();
	ctx.arc(playerPos.x, playerPos.y + (playerRad/2), playerRad, Math.PI + playerRot, 2*Math.PI + playerRot, false);
	ctx.closePath();
	ctx.lineWidth = 1;
	ctx.fillStyle = 'red';
	ctx.fill();
	ctx.strokeStyle = '#550000';
	ctx.stroke();
	
	//draw tank gun
	ctx.lineWidth = playerGunWidth;
	ctx.strokeStyle = '#8B0000';
	ctx.beginPath();
	ctx.moveTo(gunStartPos.x,gunStartPos.y);
    ctx.lineTo(gunFinalPos.x,gunFinalPos.y);
    ctx.stroke();
 }

/**
 * draw all user-placed walls
 */
function drawWalls() {
	ctx.lineWidth = wallWidth;
	ctx.strokeStyle = '#BBBB33';
	for (let i = 0; i < wallVerts.length-1; i+=2) {
		ctx.beginPath();
	    ctx.moveTo(wallVerts[i].x,wallVerts[i].y);
	    ctx.lineTo(wallVerts[i+1].x,wallVerts[i+1].y);
	    ctx.stroke();
	}
	if (wallVerts.length%2 != 0) {
		ctx.beginPath();
		ctx.moveTo(wallVerts[wallVerts.length-1].x,wallVerts[wallVerts.length-1].y);
	    ctx.lineTo(cnv.mousePos.x,cnv.mousePos.y);
	    ctx.stroke();
	}
}

/**
 * draw all user-placed targets
 */
function drawTargets() {
	for (let i = 0; i < targetLocs.length; ++i) {
		if (targetLocs[i].alive) {
			drawCentered("target",ctx, targetLocs[i].x,targetLocs[i].y);
		}
	}
}

/**
 * draw the placer at the location of the mouse
 */
function drawPlacer() {
	if (placeType == placeTypes.wall) {
		drawCentered("star",ctx, cnv.mousePos.x,cnv.mousePos.y,totalTime*100);
	}
	else if (placeType == placeTypes.target) {
		drawCentered("target",ctx,cnv.mousePos.x,cnv.mousePos.y,0);
	}
	else if (placeType == placeTypes.eraser) {
		drawCentered("eraser",ctx,cnv.mousePos.x,cnv.mousePos.y,0);
	}
}

/**
 * draw the terrain using terrainVerts data
 */
function drawTerrain() {
	ctx.fillStyle=groundGradient;
	for (let i = 0; i < terrainVerts.length-1; ++i) {
		// Filled triangles (half pixel horizontal offsets to remove visual artifacts from floating point graphics)
		floatBuffer = .5;
	    ctx.beginPath();
	    ctx.moveTo(terrainVerts[i].x-floatBuffer, terrainVerts[i].y);
	    ctx.lineTo(terrainVerts[i+1].x+floatBuffer, terrainVerts[i+1].y);
	    ctx.lineTo(terrainVerts[i].x-floatBuffer, 600);
	    ctx.fill();
	    ctx.moveTo(terrainVerts[i].x-floatBuffer, 600);
	    ctx.lineTo(terrainVerts[i+1].x+floatBuffer, terrainVerts[i+1].y);
	    ctx.lineTo(terrainVerts[i+1].x+floatBuffer, 600);
	    ctx.fill();
	}
}

/**
 * draw the HUD
 */
function drawHUD() {
	//draw buttons
	for (let i = 0; i < buttons.length; ++i) {
		let btnctx = buttons[i].canvas.getContext("2d");
		//fill light blue border color
		btnctx.fillStyle = "rgb(" +  
		Math.round(.15 * buttons[i].blendWhiteness) + ", " + 
		Math.round(buttons[i].blendWhiteness *.75) + ", " + 
		Math.round(.1 * buttons[i].blendWhiteness) + ")";
		btnctx.fillRect(buttons[i].x, buttons[i].y, buttons[i].width,buttons[i].height);
		
		//fill blue inner color
		btnctx.fillStyle = "rgb(" + 
		Math.round(buttons[i].blendWhiteness *.1) + ", " + 
		Math.round(.15 * buttons[i].blendWhiteness) + ", " + 
		Math.round(.75 * buttons[i].blendWhiteness) + ")";
		btnctx.fillRect(buttons[i].x + 2, buttons[i].y + 2, buttons[i].width - 4,buttons[i].height - 4);
		
		//set the font size and color depending on the button's attributes and state
		btnctx.font = buttons[i].fontSize + "px Arial";
		btnctx.fillStyle = "rgb(" + buttons[i].blendWhiteness + ", " + buttons[i].blendWhiteness + ", " + buttons[i].blendWhiteness + ")";
		
		//draw the button label (add slight position offset to account for line spacing)
		btnctx.fillText(buttons[i].text,buttons[i].x + 4, buttons[i].y + buttons[i].height/2 + 8);
	}
	uictx.font = "24px Arial";
	uictx.fillStyle = "#FFFFFF";
}

/**
 * main game loop; update all aspects of the game in-order
 */
function update() {
	//update the deltaTime
	updateTime();
	
	if (loading) {
		render();
		return;
	}
	
	updatePlacer();
	
	if (gameMode == gameModes.play && !(gameWon || gameLost)) {
		updatePlayer();
		updateBullets();
	}
	else {
		//if we are not in play mode, still update the player's gun, but don't allow angle changes
		updateGun(false);
	}
	
	//update GUI elements
	for (let i = 0; i < buttons.length; buttons[i].update(), ++i);
	
	//once all updates are out of the way, render the frame
	render();
	
	//toggle off any one-frame event indicators at the end of the update tick
	mousePressedLeft = false;
	mousePressedRight = false;
}

/**
 * update all active bullets
 */
function updateBullets() {
	for (let i = 0; i < bullets.length; ++i) {
		//divide movement into 15 sub-steps to minimize risk of passing through collisions
		for (let j = 0; j < 15; ++j) {
			bullets[i].x += bullets[i].xVel/15;
			bullets[i].y += bullets[i].yVel/15;
			//apply gravity to bullet
			bullets[i].yVel += .3/15;
			//clear bullet if it exits screen with a small buffer
			if (bullets[i].x > cnv.width + 14 || bullets[i].x < -14 || bullets[i].y > cnv.height + 14) {
				bullets.splice(i,1);
				--i;	
				break;	
			}
			//check collisions with targets
			for (let r = 0; r < targetLocs.length; ++r) {
				if (!targetLocs[r].alive) {
					continue;
				}
				if (getDistance(bullets[i].x,bullets[i].y,targetLocs[r].x,targetLocs[r].y) < bulletRadius + targetRadius) {
					targetLocs[r].alive = false;
					--r;
				}
			}
			//check collisions with walls
			for (let r = 0; r < wallVerts.length; r+=2) {
				if (collisionCircleLine(bulletRadius,bullets[i],wallWidth,wallVerts[r],wallVerts[r+1])) {
					//calculate bounce angle
					let bulletDir = getAngle(bullets[i].x,bullets[i].y,bullets[i].x + bullets[i].xVel, bullets[i].y + bullets[i].yVel,true);
					let bulletSpeed = getDistance(bullets[i].x,bullets[i].y,bullets[i].x + bullets[i].xVel, bullets[i].y + bullets[i].yVel);
					let wallDir = getAngle(wallVerts[r].x,wallVerts[r].y,wallVerts[r+1].x,wallVerts[r+1].y,true);					
					//rotate coordinate system
					bulletDir -= wallDir;
					//bounce
					let bounceXVel = Math.cos(bulletDir) * bulletSpeed;
					let bounceYVel = Math.sin(bulletDir) * bulletSpeed * -1;
					//rotate coordinate system back
					let bounceBulletDir = getAngle(bullets[i].x,bullets[i].y,bullets[i].x + bounceXVel, bullets[i].y + bounceYVel,true);
					bounceBulletDir += wallDir
					//return to velocities
					bullets[i].xVel = Math.cos(bounceBulletDir) * bulletSpeed;
					bullets[i].yVel = Math.sin(bounceBulletDir) * bulletSpeed;
					
					//push the ball out of the collision before continuing
					while (collisionCircleLine(bulletRadius,bullets[i],wallWidth,wallVerts[r],wallVerts[r+1])) {
						bullets[i].x += bullets[i].xVel/100;
						bullets[i].y += bullets[i].yVel/100;
					}
				}
			}
			//check collisions with terrain
			for (let r = 0; r < terrainVerts.length; ++r) {
				if (getDistance(bullets[i].x,bullets[i].y,terrainVerts[r].x,terrainVerts[r].y) < bulletRadius) {
					bullets.splice(i,1);
					--i;
					j = 15;
					break;
				}
			}
		}
	}
	
	//end game is all targets have been cleared
	let allClear = true;
	for (let i = 0; i < targetLocs.length; ++i) {
		if (targetLocs[i].alive) {
			allClear = false;
			break;
		}
	}
	if (allClear) {
		gameWon = true;
		buttons[6].active = true;
	}
	
	//end game if player is out of shots and no bullets are left alive
	if (bullets.length == 0 && numShots == 0) {
		gameLost = true;
		return;
	}
}

/**
 * update the player tank during play mode
 */
function updatePlayer() {
	//movement
	if (fuel > 0) {
		if (keyStates["A"] && playerPos.x > minPlayerPos) {
			calcPlayerPosRot(playerPos.x-1, false);
			--fuel;
		}
		else if (keyStates["D"] && playerPos.x < cnv.width - minPlayerPos) {
			calcPlayerPosRot(playerPos.x+1, false);
			--fuel;
		}
	}
	//aiming
	updateGun();
	
	//firing
	if (mousePressedLeft && numShots > 0 && pointInRect(cnv.mousePos.x,cnv.mousePos.y,cnv)) {
		choosingPower = true;
		powerSin = 1;
		power = 0;
	}
	if (mouseDownLeft) {
		power += powerSin;
		if (power%100 == 0) {
			powerSin *= -1;
		}
	}
	else {
		if (choosingPower) {
			choosingPower = false;
			fireShot();
		}
	}
}

/**
 * fire a bullet from the player tank's gun
 */
function fireShot() {
	bullets.push({x:gunFinalPos.x,y:gunFinalPos.y,xVel:Math.cos(playerShotAng)*(power*.25),yVel:Math.sin(playerShotAng)*(power*.25)});
	--numShots;
}

/**
 * update the player's gun angle and recalculate start/end position of the gun
 * @param shouldUpdateAngle: whether or not we should allow the gun angle to change
 */
function updateGun(shouldUpdateAngle = true) {
	//calculate gun start pos
	gunStartPos.x = playerPos.x + Math.cos(-Math.PI/2 + playerRot) * 6;
	gunStartPos.y = playerPos.y + (playerRad/2) + Math.sin(-Math.PI/2 + playerRot) * 6;
    if (shouldUpdateAngle) {
    	playerShotAng = getAngle(gunStartPos.x,gunStartPos.y,cnv.mousePos.x,cnv.mousePos.y,true);
    }
    //calculate gun end pos
    gunFinalPos.x = gunStartPos.x + Math.cos(playerShotAng) * playerGunLength;
    gunFinalPos.y = gunStartPos.y + Math.sin(playerShotAng) * playerGunLength;
}

/**
 * initialize a reference to each of our canvases and contexts
 */
function initCanvases() {
	//create appropriately named references to all of our canvases
	cnv = document.getElementById("cnv");
	ctx = cnv.getContext("2d");
	
	uicnv = document.getElementById("uicnv");
	uictx = uicnv.getContext("2d");
}

/**
 * load the asset loader, which will load all of our required elements in order
 */
function loadAssets() {
	//setup a global, ordered list of asset files to load
	requiredFiles = [
		"images\\star.png", "images\\target.png", "images\\eraser.png", "images\\bullet.png", //images
		"src\\util.js","src\\setupKeyListeners.js", //misc functions
		"src\\classes\\Enum.js", "src\\classes\\Button.js" //classes
		];
	
	//manually load the asset loader
	let script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = "src\\loadAssets.js";
	script.onload = loadAssets;
	//begin loading the asset loader by appending it to the document head
    document.getElementsByTagName('head')[0].appendChild(script);
}

/**
 * randomize the list of terrain verts
 */
function randomizeTerrain() {
	terrainVerts.length = 0;
	for (let i = 0; i < numTerrainVerts; ++i) {
		terrainVerts.push({x: Math.round(cnv.width * (i/(numTerrainVerts-1))), 
		y:clamp(i == 0 ? getRandomInt(minTerrainStartY,cnv.height - minTerrainStartY - 1) + 100 : 
		terrainVerts[i-1].y + getRandomInt(-5,6),minTerrainY, cnv.height-minTerrainY - 1)});
	}
	calcPlayerPosRot(playerPos.x);
}

/**
 * start the object placer
 * @param type: the object type we wish to place
 */
function startPlacer(type) {
	stopPlacer();
	placing = true;
	placeType = type;
}

/** 
 * stop the placer
 */
function stopPlacer() {
	placing = false;
	//if we have an odd number of wall verts, remove the last one
	if (wallVerts.length%2 != 0) {
		wallVerts.splice(-1,1);
	}
}

/**
 * calculate the player's y position and rotation from the terrain, given his x position
 * @param x: the player's desired x position
 * @paaram updateStartPos: whether to change playerStartPos, or just playerPos
 * @returns the player's final {x,y} position 
 */
function calcPlayerPosRot(x,updateStartPos = true) {
	//find the two nearest points
	let pts = [];
	for (let i = 0; i < terrainVerts.length; ++i) {
		if (terrainVerts[i].x > x) {
			pts.push(terrainVerts[i-1]);
			pts.push(terrainVerts[i]);
			break;
		}
	}
	//calculate slope
	let slope = (pts[1].y - pts[0].y) / (pts[1].x - pts[0].x);
	playerRot = getAngle(pts[0].x,pts[0].y,pts[1].x,pts[1].y,true);
	//solve for y
	y = pts[1].y - (slope * (pts[1].x - x));
	//offset player y from center to bottom
	playerPos = {"x":x,"y":y - playerRad/2};
	if (updateStartPos) {
		playerStartPos = playerPos;
	}
}

/**
 * update the placer, stopping on rightclick and adding a point on leftclick
 */
function updatePlacer() {
	if (!placing) {
		return;
	}
	if (placeType == placeTypes.player) {
		calcPlayerPosRot(clamp(cnv.mousePos.x,minPlayerPos,cnv.width-minPlayerPos));
	}
	if (mousePressedRight) {
		stopPlacer();
	}
	else if (pointInRect(cnv.mousePos.x,cnv.mousePos.y,cnv)) {
		if (placeType == placeTypes.eraser) {
			if (mouseDownLeft) {
				//check erase targets
				for (let i = 0; i < targetLocs.length; ++i) {
					if (getDistance(cnv.mousePos.x,cnv.mousePos.y,targetLocs[i].x,targetLocs[i].y) < eraserRadius + targetRadius) {
						targetLocs.splice(i, 1);
						--i;
					}
				}
				//check erase walls
				for (let i = 0; i < wallVerts.length-1; i+=2) {
					if (collisionCircleLine(eraserRadius,cnv.mousePos,wallWidth,wallVerts[i],wallVerts[i+1])) {
						wallVerts.splice(i,2);
						i-=2;
					}
				}
			}
		}
		else if (mousePressedLeft) {
			if (placeType == placeTypes.wall) {
				wallVerts.push(cnv.mousePos);
			}
			else if (placeType == placeTypes.target) {
				targetLocs.push({"x":cnv.mousePos.x,"y":cnv.mousePos.y,"alive":true});
			}
			else if (placeType == placeTypes.player) {
				stopPlacer();
			}
		}
	}
} 

/**
 * toggle between play and build modes
 */
function toggleGameMode() {
	//reset targets
	if (gameMode == gameModes.play) {
		for (let i = 0; i < targetLocs.length; ++i) {
			targetLocs[i].alive = true;
		}
	}
	gameWon = false;
	buttons[6].active = false;
	gameLost = false;
	stopPlacer();
	bullets.length = 0;
	gameMode = (gameMode == gameModes.build ? gameModes.play : gameModes.build);
	playerPos = playerStartPos;
	numShots = maxNumShots;
	fuel = maxFuel;
	playerShotAng = -Math.PI/8;
	//toggle active flag on settings buttons when starting/stopping the game
	for (let i = 0; i < 5; buttons[i].active = !buttons[i].active, ++i);
	buttons[5].text = (gameMode == gameModes.build ? "play" : "stop");
	choosingPower = false;
}

/**
 * publish the current level to the online database
 */
function publishLevel() {
	levelName = "";
	while (levelName.length == 0) {
		levelName = prompt("Enter Level Name", "Untitled").trim();
	}
	//limit level name to 50 characters
	levelName = levelName.length > 50 ? levelName.substring(0,50) : levelName;
	//stringify the level data, delimited with newlines so we can easily split and destringify later to load
	levelData = JSON.stringify(terrainVerts) + '\n' 
	+ JSON.stringify(targetLocs) + '\n' 
	+ JSON.stringify(wallVerts) + '\n'
	+ JSON.stringify(playerStartPos) + '\n'
	+ JSON.stringify(maxNumShots) + '\n'
	+ JSON.stringify(maxFuel);
	publishLevelToServer("targetTest",levelName,levelData);
}

/**
 * load level from the input JSON data
 * @param JSONData: the data comprising the level to load
 */
function loadLevel(JSONData) {
	splitData = JSONData.split('\n');
	terrainVerts.length = 0;
	terrainVerts = JSON.parse(splitData[0]);
	targetLocs = JSON.parse(splitData[1]);
	wallVerts = JSON.parse(splitData[2]);
	playerStartPos = JSON.parse(splitData[3]);
	calcPlayerPosRot(playerStartPos.x);
	maxNumShots = JSON.parse(splitData[4]);
	maxFuel = JSON.parse(splitData[5]);
	//set targets alive to true
	for (let i = 0; i < targetLocs.length; ++i) {
		targetLocs[i].alive = true;
	}
	loading = false;
}

/**
 * initialize all global variables
 */
function initGlobals() {
	//keep a global fps flag for game-speed (although all speeds should use deltaTime)
	fps = 60;
	
	//init global time vars for delta time calculation
	prevTime = Date.now();
	deltaTime = 0;
	totalTime = 0;
	
	bullets = [];
	
	//game modes
	gameModes = new Enum("build","play");
	gameMode = gameModes.build;
	
	//placer
	placing = false;
	placeTypes = new Enum("wall","target", "eraser", "player");
	placeType = null;
	
	//player
	minPlayerPos = 16;
	playerGunWidth = 2;
	playerGunLength = 10;
	playerRad = 8;
	playerRot = 0;
	playerStartPos = {x:100,y:0};
	playerPos = playerStartPos;
	playerShotAng = -Math.PI/8;
	gunStartPos = {x:0,y:0};
	gunFinalPos = {x:0,y:0};
	
	//settings
	maxNumShots = 3;
	numShots = maxNumShots;
	maxFuel = 100;
	fuel = maxFuel;
	choosingPower = false;
	powerSin = 1;
	power = 0;
	gameWon = false;
	gameLost = false;
	levelName = "";
	
	//terrain
	terrainVerts = [];
	numTerrainVerts = 101;
	minTerrainY = 50;
	minTerrainStartY = 200;
	randomizeTerrain();
	
	//walls and targets
	wallVerts = [];
	targetLocs = [];
	wallWidth = 4;
	eraserRadius = 16;
	targetRadius = 16;
	
	//bullets
	bulletRadius = 4;
	
	//global list of UI buttons
	buttons = [];
	buttons.push(new Button(10,10,uicnv,"Randomize Terrain",24,randomizeTerrain));
	buttons.push(new Button(10,60,uicnv,"Place Wall",24,startPlacer,placeTypes.wall));
	buttons.push(new Button(10,110,uicnv,"Place Target",24,startPlacer,placeTypes.target));
	buttons.push(new Button(10,160,uicnv,"Place Player",24,startPlacer,placeTypes.player));
	buttons.push(new Button(10,210,uicnv,"Eraser",24,startPlacer,placeTypes.eraser));
	buttons.push(new Button(10,260,uicnv,"Play",24,toggleGameMode));
	buttons.push(new Button(10,310,uicnv,"Publish Level",24,publishLevel));
	buttons[6].active = false;
	
	//gradients
	skyGradient = ctx.createRadialGradient(850,500,1,500,600,900);
	skyGradient.addColorStop(0,"purple");
	skyGradient.addColorStop(1,"blue");
	
	groundGradient = ctx.createLinearGradient(cnv.width,0,0,cnv.height);
	groundGradient.addColorStop(0,"#ff59b2");
	groundGradient.addColorStop(1,"#387517");

	loading = false;
	levelId = getURLParams().levelId;
	if (levelId != null) {
		loading = true;
		getLevelData(levelId);
	}
}

//disallow right-click context menu as right click functionality is often necessary for gameplay
document.body.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

//initialize a reference to the canvas first, then begin loading the game
initCanvases();
loadAssets();