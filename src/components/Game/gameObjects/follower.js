import Phaser from 'phaser';
class FollowerSprite extends Phaser.GameObjects.Sprite {
    /**
     * @param {Phaser.Scene} scene
     * @param {*} x
     * @param {*} y
     * @param {*} navMesh
     * @param {*} wallLayer
     * @memberof FollowerSprite
     */
    constructor(scene, x, y, navMesh, texture) {
        super(scene, x, y, texture);

        this.navMesh = navMesh;
        this.path = null;
        this.currentTarget = null;
        this.scene = scene;

        // Enable arcade physics for moving with velocity
        scene.physics.world.enable(this);

        scene.add.existing(this);
        scene.events.on("update", this.update, this);
        scene.events.once("shutdown", this.destroy, this);
    }

    goTo(targetPoint) {
        // Find a path to the target
        this.path = this.navMesh.findPath(new Phaser.Math.Vector2(this.x, this.y), targetPoint);

        // If there is a valid path, grab the first point from the path and set it as the target
        if (this.path && this.path.length > 0) this.currentTarget = this.path.shift();
        else this.currentTarget = null;
    }

    update(time, deltaTime) {
        // Bugfix: Phaser's event emitter caches listeners, so it's possible to get updated once after
        // being destroyed
        if (!this.body) return;

        // Stop any previous movement
        this.body.velocity.set(0);

        if (this.currentTarget) {
            // Check if we have reached the current target (within a fudge factor)
            const { x, y } = this.currentTarget;
            const distance = Phaser.Math.Distance.Between(this.x, this.y, x, y);
            this.emitMovement(x, y);
            if (distance < 5) {
                // If there is path left, grab the next point. Otherwise, null the target.
                if (this.path.length > 0) this.currentTarget = this.path.shift();
                else {
                    this.currentTarget = null;
                    this.emit('onMovementComplete');
                }
            }

            // Still got a valid target?
            if (this.currentTarget) this.moveTowards(this.currentTarget, 200, deltaTime / 1000);
        }
    }

    emitMovement(x, y) {
        const isGoingDown = y > this.y;
        const isGoingRight = x > this.x;
        if (isGoingDown && isGoingRight)
            this.emit('bottomRightMovement');
        else if (isGoingDown && !isGoingRight)
            this.emit('bottomLeftMovement')
        else if (!isGoingDown && isGoingRight)
            this.emit('topRightMovement');
        else
            this.emit('topLeftMovement');
    }

    onTopLeftMovement(callback) {
        return this.on('topLeftMovement', () => {
            if (this.directionState !== FollowerDirection.TOP_LEFT) {
                callback();
                this.directionState = FollowerDirection.TOP_LEFT;
            }
        });
    }

    onTopRightMovement(callback) {
        return this.on('topRightMovement', () => {
            if (this.directionState !== FollowerDirection.TOP_RIGHT) {
                callback();
                this.directionState = FollowerDirection.TOP_RIGHT;
            }
        });
    }

    onBottomLeftMovement(callback) {
        return this.on('bottomLeftMovement', () => {
            if (this.directionState !== FollowerDirection.BOTTOM_LEFT) {
                callback();
                this.directionState = FollowerDirection.BOTTOM_LEFT;
            }
        });
    }

    onBottomRightMovement(callback) {
        return this.on('bottomRightMovement', () => {
            if (this.directionState !== FollowerDirection.BOTTOM_RIGHT) {
                callback();
                this.directionState = FollowerDirection.BOTTOM_RIGHT;
            }
        });
    }

    onMovementComplete(callback) {
        return this.on('onMovementComplete', ()=>{
            this.directionState = null;
            callback()
        });
    }

    moveTowards(targetPosition, maxSpeed = 200, elapsedSeconds) {
        const { x, y } = targetPosition;
        const angle = Phaser.Math.Angle.Between(this.x, this.y, x, y);
        const distance = Phaser.Math.Distance.Between(this.x, this.y, x, y);
        const targetSpeed = distance / elapsedSeconds;
        const magnitude = Math.min(maxSpeed, targetSpeed);
        this.scene.physics.velocityFromRotation(angle, magnitude, this.body.velocity);
    }

    destroy() {
        if (this.scene) this.scene.events.off("update", this.update, this);
        super.destroy();
    }
}

const FollowerDirection = {
    TOP_LEFT: 0,
    TOP_RIGHT: 1,
    BOTTOM_LEFT: 2,
    BOTTOM_RIGHT: 3

}

export default FollowerSprite;