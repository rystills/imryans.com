/**
 * GameObject class: serves as the base class for all objects which will be represented in-game
 * @param x: the starting center x coordinate
 * @param y: the starting center y coordinate
 * @param imgName: the name of our starting image (used for images dict lookup)
 * @param rot: the starting rotation (in degrees)
 */
function GameObject(x,y,imgName,rot=0) {
    this.x = x;
    this.y = y;
    this.rot = rot;
    this.imgName = imgName;
}

/**
 * check if this GameObject is colliding with another GameObject via AABB
 * @param o: the other object we wish to check for collision with
 * @returns whethr or not we are colliding with GameObject o
 */
GameObject.prototype.collide = function(o) {
    return collisionRect(this.x,this.y,images[this.imgName].width,images[this.imgName].height,
        o.x,o.y,images[o.imgName].width,images[o.imgName].height);
}

/**
 * get the amount of intersection on each axis between this object and another GameObject via AABB
 * @param o: the other object we wish to check for intersection with
 * @returns the degree of intersection with object o on each axis
 */
GameObject.prototype.intersect = function(o) {
    return intersectRectCenter(this.cx(),this.cy(),images[this.imgName].width,images[this.imgName].height,
        o.cx(),o.cy(),images[o.imgName].width,images[o.imgName].height);
}

/**
 * calculate our center x coordinate
 * @returns our center x coordinate
 */
GameObject.prototype.cx = function() {
    return this.x + images[this.imgName].width/2;
}

/**
 * calculate our center y coordinate
 * @returns our center y coordinate
 */
GameObject.prototype.cy = function() {
    return this.y + images[this.imgName].height/2;
}

/**
 * render this gameObject to the provided canvas
 * @param cnv: the canvas on which to render
 */
GameObject.prototype.render = function(ctx) {
    drawCentered(this.imgName,ctx,this.cx(),this.cy(),this.rot);
}

/**
 * stub method for children to override
 */
GameObject.prototype.update = function() {

}