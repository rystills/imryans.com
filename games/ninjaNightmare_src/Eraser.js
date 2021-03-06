/**
 * the Eraser allows the user to remove elements in the level creator
 * @param ctx: the context to which the eraser belongs
 */
makeChild("Eraser","Placer");
function Eraser(cnv) {
    Placer.call(this,cnv);
    this.imgName = "eraser";
}

/**
 * activate the eraser
 */
Eraser.prototype.activate = function() {
    this.active = true;
}


/**
 * update the placer
 */
Eraser.prototype.update = function() {
    //deactivate on click off-screen / on UI
    if (mousePressedLeft && !pointInRect(this.cnv.mousePos.x,this.cnv.mousePos.y,this.cnv)) {
        this.active = false;
    }
    if (!this.active || activeRoom.running) {
        return;
    }
    //update position
    this.x = activeRoom.scrollX + this.cnv.mousePos.x - (images[this.imgName].width/2);
    this.y = activeRoom.scrollY + this.cnv.mousePos.y - (images[this.imgName].height/2);

    //erase blocks when left click is held
    if (mouseDownLeft) {
        let colTiles = getSurroundingTiles(this);
        for (let i = 0; i < colTiles.length; ++i) {
            if (this.collide(colTiles[i])) {
                activeRoom.removeTile(colTiles[i]);
                //alert tile below if it exists
                let belowTile = activeRoom.tiles[Math.floor(colTiles[i].x/gridSize) + "," + Math.floor(colTiles[i].y/gridSize+1)];
                if (belowTile != null && (belowTile.type == tileTypes.dirt || belowTile.type == tileTypes.grass)) {
                    belowTile.setType(tileTypes.grass);
                }
            }
        }

        for (let i = 0; i < activeRoom.updateObjects.length; ++i) {
            //don't erase player
            if (activeRoom.updateObjects[i] == player || activeRoom.updateObjects[i] == goal) {
                continue;
            }
            if (this.collide(activeRoom.updateObjects[i])) {
                activeRoom.removeObject(activeRoom.updateObjects[i]);
                --i;
            }
        }
    }
}