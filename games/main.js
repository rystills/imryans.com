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
	
	drawTerrain();
	
	//draw all objects with images specified, centered in order of list indices
	for (let i = 0; i < objects.length; ++i) {
		if (objects[i].imgName) {
			drawCentered(objects[i].imgName,ctx, objects[i].x, objects[i].y,objects[i].dir);	
		}
	}
	
	//finally draw the HUD
	drawHUD();
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
		
	//update objects
	for (let i = 0; i < objects.length; objects[i].update(), ++i);
	
	//update GUI elements
	for (let i = 0; i < buttons.length; buttons[i].update(), ++i);
	
	//once all updates are out of the way, render the frame
	render();
	
	//toggle off any one-frame event indicators at the end of the update tick
	mousePressedLeft = false;
	mousePressedRight = false;
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
		terrainVerts.push({x: cnv.width * (i/(numTerrainVerts-1)), 
		y:clamp(i == 0 ? getRandomInt(minTerrainStartY,cnv.height - minTerrainStartY - 1) : 
		terrainVerts[i-1].y + getRandomInt(-5,6),minTerrainY, cnv.height-minTerrainY-1)});
	}
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
	
	//global game objects
	objects = [];
	
	terrainVerts = [];
	numTerrainVerts = 400;
	minTerrainY = 50;
	minTerrainStartY = 150;
	randomizeTerrain();
	
	//global list of UI buttons
	buttons = [];
	buttons.push(new Button(10,10,uicnv,"RandomizeTerrain",24,randomizeTerrain));
	
	//misc properties
	skyGradient = ctx.createLinearGradient(0,0,0,cnv.height);
	skyGradient.addColorStop(0,"blue");
	skyGradient.addColorStop(1,"purple");
	
	groundGradient = ctx.createLinearGradient(cnv.width,0,0,cnv.height);
	groundGradient.addColorStop(0,"yellow");
	groundGradient.addColorStop(1,"green");
}

//disallow right-click context menu as right click functionality is often necessary for gameplay
document.body.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

//initialize a reference to the canvas first, then begin loading the game
initCanvases();
loadAssets();