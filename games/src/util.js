// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function() {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function(obj) {
      if (typeof obj !== 'function' && (typeof obj !== 'object' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

/**
 * find the index at which to insert item x in list a, assuming a is sorted
 * @param a: the list of elements to search
 * @param x: the item to be inserted into the list
 * @param key: the key to apply to list items when determining the insert location
 * @param leftMost: whether to return the left-most insertion location (true) or the right-most insertion location (false)
 * @param lo: the lower bound of the search space (inclusive)
 * @param hi: the upper bound of the search space (exclusive)
 * @returns some value i such that all e in a[:i] have e <= x, and all e in a[i:] have e > x.
 * @throws bounds error if lo < 0 or high > a.length
 */
function binarySearch(a, x, key, leftMost, lo, hi) {
	if (lo == null) {
		lo = 0;
	}
	else if (lo < 0) {
		throw "ERROR: lo must be non-negative";
	}
		
	if (hi == null) {
		hi = a.length;
	}
	else if (hi > a.length) {
		throw "Error: hi must be <= a.length";
	}
	
	if (leftMost == null) {
		leftMost = false;
	}
	
	if (key != null) {
		x = x[key]; 
	}
	if (leftMost) {
		while (lo < hi) {
			mid = ~~((lo+hi)/2);
			if (key == null) {
				value = a[mid];
			}
			else {
				value = a[mid][key]; 
			}
			if (x <= value) {
				hi = mid;
			}
			else {
				lo = mid+1;
			}
		}
	}
	else {
		while (lo < hi) {
			mid = ~~((lo+hi)/2);
			if (key == null) {
				value = a[mid];
			}
			else {
				value = a[mid][key]; 
			}
			if (x < value) {
				hi = mid;
			}
			else {
				lo = mid+1;
			}
		}
	}
	
	return lo;
}

/**
 * make the input object a child of the specified parent object
 * @param objectName: the name of the child object being given inheritance
 * @param parentName: the name of the parent object
 */
function makeChild(objectName, parentName) {
	eval(objectName + ".prototype = Object.create(" + parentName + ".prototype);" + 
			objectName + ".prototype.constructor = " + objectName + ";");
}

/**
 * add a 'last' method to arrays for simple retrieval of the last element in an array
 */
if (!Array.prototype.last) {
    Array.prototype.last = function() {
        return this[this.length - 1];
    };
};

/**
 * get the angle between two points
 * @param x1: the x coordinate of the first point
 * @param y1: the y coordinate of the first point
 * @param x2: the x coordinate of the second point
 * @param y2: the y coordinate of the second point
 * @param radians: whether the returned angle should be in radians (true) or degrees (false)
 * @returns the angle between the two input points
 */
function getAngle(x1,y1,x2,y2,radians) {
	if (radians == null || radians == false) {
		return Math.atan2((y2-y1),(x2-x1))*180/Math.PI;
	}
	return Math.atan2((y2-y1),(x2-x1));
}

/**
 * stop the desired sound from playing
 * @param sound: the sound we wish to stop
 */
function stopSound(sound) {
	sound.pause();
	sound.currentTime = 0;
}

/**
 * restart the desired sound
 * @param sound: the sound we wish to restart
 */
function restartSound(sound) {
	sound.currentTime = 0;
	sound.play();
}

/**
 * get a random integer between min (inclusive) and max (exclusive)
 * @param min: the inclusive minimum integer value
 * @param max: the exclusive maximum integer value
 * @returns the randomly generated integer between min and max
 */
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * draw an image centered around the specified coordinates, with an optional arbitrary rotation
 * @param imageName: the name of the image to draw
 * @param ctx: the context onto which to draw the image
 * @param x: the center x coordinate at which to draw the image
 * @param y: the center x coordinate at which to draw the image
 * @param rot: if specified, the amount in degrees by which to rotate the image
 */
function drawCentered(imageName,ctx,x,y,rot,flipHorizontal=false) {
	let img = images[imageName];
	ctx.save();
	//perform the inverse of the object's translation to effectively bring it to the origin
	ctx.translate(x,y);
	if (rot != 0) {
		ctx.rotate(rot*Math.PI/180);
	}
	if (flipHorizontal) {
		ctx.scale(-1, 1);
	}
	ctx.drawImage(img, -(img.width/2), -(img.height/2));
	//restore the canvas now that we're done modifying it
	ctx.restore();
}

/**
 * get the distance between two points
 * @param x1: the x coordinate of the first point
 * @param y1: the y coordinate of the first point
 * @param x2: the x coordinate of the second point
 * @param y2: the y coordinate of the second point
 * @returns the distance between the two input points
 */
function getDistance(x1,y1,x2,y2) {
	return Math.sqrt(((x2-x1)*(x2-x1))+((y2-y1)*(y2-y1)));
}

/**
 * check for a collision between two objects' centers assuming AABBs
 * @param x1: the center x coordinate of the first object
 * @param y1: the center y coordinate of the first object
 * @param w1: the width of the first object
 * @param h1: the height of the first object
 * @param x2: the center x coordinate of the second object
 * @param y2: the center y coordinate of the second object
 * @param w2: the width of the second object
 * @param h2: the height of the second object
 * @returns whether there is a collision between the objects (true) or not (false)
 */
function collisionRectCenter(x1,y1,w1,h1,x2,y2,w2,h2) {
	return (Math.abs(x1 - x2) * 2 < (w1 + w2)) &&
    (Math.abs(y1 - y2) * 2 < (h1 + h2));
}

/**
 * find the amount of interseection between two objects on each axis using AABB
 * @param x1: the center x coordinate of the first object
 * @param y1: the center y coordinate of the first object
 * @param w1: the width of the first object
 * @param h1: the height of the first object
 * @param x2: the center x coordinate of the second object
 * @param y2: the center y coordinate of the second object
 * @param w2: the width of the second object
 * @param h2: the height of the second object
 * @returns the amount of intersection between the two objects on each axis
 */
function intersectRectCenter(x1,y1,w1,h1,x2,y2,w2,h2) {
	return {"x" : .5*((w1 + w2) - Math.abs(x1 - x2) * 2),
    "y" : .5*((h1 + h2) - Math.abs(y1 - y2) * 2)};
}

/**
 * check for a collision between two objects assuming AABBs
 * @param x1: the x coordinate of the first object
 * @param y1: the y coordinate of the first object
 * @param w1: the width of the first object
 * @param h1: the height of the first object
 * @param x2: the x coordinate of the second object
 * @param y2: the y coordinate of the second object
 * @param w2: the width of the second object
 * @param h2: the height of the second object
 * @returns whether there is a collision between the objects (true) or not (false)
 */
function collisionRect(x1,y1,w1,h1,x2,y2,w2,h2) {
	return (x1 < x2 + w2) && (x1 + w1 > x2) && (y1 < y2 + h2) && (y1 + h1 > y2);
}


/**
 * publish the current level to the server
 * @param gameName: the name of the game for which the level was constructed
 * @param lname: the level name
 * @param ldata: the JSON level data
 */
function publishLevelToServer(gameName,lname,ldata) {
	$.ajax({
		type: "POST",
		url: '../../../../../backend/publishLevel.php',
		data: {game_name:gameName, level_name: lname, level_data: ldata},
		success: function(data){
			if (data == "Success") {
				alert("Level Published Successfully!");
			}
			else {
				alert(data);
			}
		}
	});
}

/**
 * alert the server that we won the level
 * @param levelid: the id of the level we won
 * @param creatorName: the name of the level creator
 */
function sendLevelVictory(levelId,creatorName) {
	$.ajax({
		type: "POST",
		url: '../../../../../backend/applyWinLevel.php',
		data: {level_id: levelId, creator_name: creatorName},
		success: function(data){
			if (data == "Success") {
				alert("User and Creator Scores Updated Successfully!");
			}
			else {
				alert(data);
			}
		}
	});
}

/**
 * retrieve a string containing all level ids, names, and creators
 * @param gameName: the name of the game to which the levels should belong
 */
function getLevelList(gameName) {
	$.ajax({
		type: "POST",
		url: '../../../../../backend/getLevelList.php',
		data: {game_name: gameName},
		success: function(data){
			//since AJAX is async, its up to the current game to implement loadLevel and handle async on its own
			displayLevelList(data);
		}
	});
}

/**
 * retrieve a string containing all cleared level ids
 * @param gameName: the name of the game to which the levels should belong
 */
function getClearedLevels(gameName) {
	$.ajax({
		type: "POST",
		url: '../../../../../backend/getClearedLevels.php',
		data: {game_name: gameName},
		success: function(data){
			//since AJAX is async, its up to the current game to implement loadLevel and handle async on its own
			setClearedLevels(data);
		}
	});
}

/**
 * get the JSON data corresponding to the specified level id
 * @param levelId: the id of the level we wish to load
 * @returns the JSON data corresponding to the specified level id
 */
function getLevelData(levelId) {
	$.ajax({
		type: "POST",
		url: '../../../../../backend/getLevelData.php',
		data: {level_id: levelId},
		success: function(data){
			//since AJAX is async, its up to the current game to implement loadLevel and handle async on its own
			loadLevel(data);
		}
	});
}

/**
 * check for a collision between a point and a rect
 * @param px: the x coordinate of our point
 * @param py: the y coordinate of our point
 * @param obj: the object whose rect we check for contained point
 * @param objectPosIsTopLeft: whether obj's position represents its top-left (true) or its center (false)
 * @returns whether the point (px,py) is contained in obj's rect (true) or not (false)
 */
function pointInRect(px,py,obj, objectPosIsTopLeft) {
	//special case: assume objects without coordinates (ie. canvases) are at 0,0 use topLeft
	if (obj.x == null) {
		return (px >= 0 && px < obj.width && py >= 0 && py < obj.height);
	}
	if (objectPosIsTopLeft) {
		return (px >= obj.x && px < obj.x + obj.width && py >= obj.y && py < obj.y + obj.height);
	}
	return (px >= obj.x - obj.width/2 && px < obj.x + obj.width/2
			&& py >= obj.y - obj.height/2 && py < obj.y + obj.height/2); 	
}

/**
 * check whether a circle and a line are overlapping (true) or not (false)
 * @param circRad: the radius of the circle
 * @param circPos: the position of the circle
 * @param lineWidth: the thickness of the line
 * @param lineSPos: the start position of the line
 * @param lineEPos: the end position of the line
 * @returns whether the circle and line are overlapping (true) or not (false)
 */
function collisionCircleLine(circRad, circPos, lineWidth, lineSPos, lineEPos) {
	hitDist = pointLineSegmentDistance(lineSPos, lineEPos, circPos);
	return hitDist < circRad + lineWidth/2;
}

/**
 * find the shortest distance between a line segment and another point
 * @param v: the first point on the line
 * @param w: the second point on the line
 * @param p: the other point used for comparison
 * @returns the closest distance on the specified line segment from the specified point
 */
function pointLineSegmentDistance(v, w, p) {
	l2 = Math.pow(v.x - w.x, 2) + Math.pow(v.y - w.y, 2);
	if (l2 == 0.0) return getDistance(p.x, p.y, v.x, v.y); 
	pminusv = {x:p.x-v.x, y:p.y-v.y};
	wminusv = {x:w.x-v.x, y:w.y-v.y};
	t = Math.max(0, Math.min(1, (pminusv.x*wminusv.x + pminusv.y*wminusv.y) / l2));
	projection = {x:(w.x - v.x)*t+v.x, y:(w.y-v.y)*t+v.y}; 
	return getDistance(p.x,p.y, projection.x, projection.y);
}

/**
 * update the global deltaTime
 */
function updateTime() {
	let curTime = Date.now();
	//divide by 1,000 to get deltaTime in seconds
    deltaTime = (curTime - prevTime) / 1000;
    //cap deltaTime at ~15 ticks/sec as below this threshhold collisions may not be properly detected
    if (deltaTime > .067) {
    	deltaTime = .067;
    }
    prevTime = curTime;
    totalTime += deltaTime;
}

/**
 * clamp the specified value to the specified bounds
 * @param min: the minimum value allowed
 * @param max: the maximum value allowed
 * @returns the provided value clamped between min and max (both inclusive)
 */
function clamp(value, min, max) {
  	return Math.min(Math.max(value, min), max);
};

/** 
 * darken the screen with a partial transparency black fill
 */
function darkenScreen() {
	ctx.fillStyle = "rgba(0,0,0,.7)";
	ctx.fillRect(0,0,cnv.width,cnv.height);
	uictx.fillStyle = "rgba(0,0,0,.7)";
	uictx.fillRect(0,0,uicnv.width,uicnv.height);
}

/**
 * calls initGlobals and begins the main update loop; to be called after resource loading
 */
function startGame() {
	initGlobals();

	//set the game to call the 'update' method on each tick
	_intervalId = setInterval(update, 1000 / fps);
}

/**
 * extract parameters from url string (sorce: https://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters')
 * @returns an object containing keys for all url parameters
 */
function getURLParams() {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	var query_string = {};
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		var key = decodeURIComponent(pair[0]);
		var value = decodeURIComponent(pair[1]);
		// If first entry with this name
		if (typeof query_string[key] === "undefined") {
			query_string[key] = decodeURIComponent(value);
			// If second entry with this name
		} 
		else if (typeof query_string[key] === "string") {
			var arr = [query_string[key], decodeURIComponent(value)];
			query_string[key] = arr;
			// If third or later entry with this name
		} 
		else {
			query_string[key].push(decodeURIComponent(value));
		}
	}
	return query_string;
}

/**
 * helper method for text rendering
 * @param size: the font size
 * @param color: the text color
 * @param alignment: the text alignment
 * @param text: the string to render
 * @param x: the x coordinate of the text
 * @param y: the y coordinate of the text
 * @param font: the name of the font in which to render the text
 */
function drawText(size,color,alignment,text,x,y,font="Arial") {
	ctx.font = size + "px " + font;
	ctx.fillStyle = color;
	ctx.textAlign=alignment;
	ctx.fillText(text,x,y);
	ctx.textAlign="start";
}