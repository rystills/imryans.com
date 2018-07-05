/**
 * Player class: describes the playable charaacter
 * @param x: the starting center x coordinate
 * @param y: the starting center y coordinate
 */
makeChild("Player","GameObject");
function Player(x,y) {
    GameObject.call(this,x,y,"player");
    //movement properties
    this.yvel = 0;
    this.xvel = 0;
    this.xAccelGround = 1;
    this.xAccelAir = .5;
    this.xvelMax = 5;
    this.yAccel = .4;
    this.yVelMax = 10;
    this.jumpVel = 11;
    this.wallJumpYVel = 9;
    this.walljumpXVel = 5;
    this.xDecelGround = 1;
    this.xDecelAir = 0;
    this.grounded = false;
    this.wallSliding = false;
    this.wallDir = "left";
    this.yVelSlide = 1;
    this.wallJumpMaxTimer = 13;
    this.wallJumpTimer = 0;
    this.jumpPressed = false;
}

/**
 * move outside of all rect collisions on the specified axis
 * @param isXAxis: whether we wish to move on the x axis (true), or the y axis (false)
 * @param sign: the direction in which we wish to move (-1 or 1, given by Math.sign)
 * @param collidingObject: object to move outside of collision with. If left blank, all solid tiles are checked for collision instead
 */
Player.prototype.moveOutsideCollisions = function(isXAxis, moveSign, collidingObject = null) {
    let collisionResolved = false;
    
    if (collidingObject != null) {
        if (this.collide(collidingObject)) {
            collisionResolved = true;
            this.translate(isXAxis,(isXAxis ? this.intersect(collidingObject).x : this.intersect(collidingObject).y) * moveSign);
        }
    }
    else {
        for (let i = 0; i < tiles.length; ++i) {
            if (tileProperties[tiles[i].type].state == tileStates.solid && this.collide(tiles[i])) {
                collisionResolved = true;
                this.translate(isXAxis,(isXAxis ? this.intersect(tiles[i]).x : this.intersect(tiles[i]).y) * moveSign);
            }
        }
    }
    return collisionResolved;
}

/**
 * checks whether the player is grounded. if they are, reset yvel and toggle grounded flag
 */
Player.prototype.checkGrounded = function() {
    //toggle grounded off and move down one pixel to see if the floor is below us
    this.grounded = false;
    this.y += 1;
    for (let i = 0; i < tiles.length; ++i) {
        if (tileProperties[tiles[i].type].state == tileStates.solid && this.collide(tiles[i])) {
            this.grounded = true;
            break;
        }
    }
    //move back up and reset velocity if we are indeed grounded
    this.y -= 1;
    if (this.grounded) {
        this.yvel = 0;
    }
}

/**
 * update the player character
 */
Player.prototype.update = function() {
    //horizontal movement
    if (this.wallJumpTimer > 0) {
        --this.wallJumpTimer;
    }
    else {
        if (keyStates["A"] || keyStates["D"]) {
            this.xvel = clamp(this.xvel-(this.grounded ? this.xAccelGround : this.xAccelAir)*(keyStates["D"] ? -1 : 1), -this.xvelMax, this.xvelMax);
        }
        //horizontal deceleration
        else {
            let xDecel = this.grounded ? this.xDecelGround : this.xDecelAir;
            this.xvel -= Math.abs(this.xvel) <= (xDecel) ? this.xvel : Math.sign(this.xvel) * (xDecel);
        }
    }

    //apply final x velocity, stopping if we hit something
    this.x += this.xvel;
    if (this.moveOutsideCollisions(true,-Math.sign(this.xvel))) {
        this.wallDir = Math.sign(this.xvel);
        this.xvel = 0;
        this.wallSliding = true;
        if (this.yvel >= this.yVelSlide) {
            //maximum fall speed while wallsliding
            this.yvel = this.yVelSlide;
        }
    }
    else {
        this.wallSliding = false;
    }
    
    //vertical movement
    //apply gravity (unbounded rising speed, bounded falling speed)
    this.yvel = clamp(this.yvel + this.yAccel, -Number.MAX_VALUE, this.yVelMax);

    //apply final y velocity, stopping if we hit something
    this.y += this.yvel;
    if (this.moveOutsideCollisions(false,-Math.sign(this.yvel))) {
        this.yvel = 0;
    }

    //update grounded state + allow jumping & walljumping
    this.checkGrounded();
    if (this.grounded || this.wallSliding) {
        this.wallJumpTimer = 0;
        if (keyStates["W"] && !this.jumpPressed) {
            //jump
            if (this.grounded) {
                this.yvel = -this.jumpVel;
            }
            //walljump
            else {
                this.yvel = -this.wallJumpYVel;
                this.xvel = -Math.sign(this.wallDir) * this.walljumpXVel;
                this.wallJumpTimer = this.wallJumpMaxTimer;
            }
            this.grounded = false;
            this.wallSliding = false;
        }
    }

    //update jump hold state to allow acting only on press
    this.jumpPressed = keyStates["W"];
}