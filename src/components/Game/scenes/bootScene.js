import Phaser from "phaser";

class BootScene extends Phaser.Scene {

    constructor() {
        super({ key: 'bootScene' });
    }

    create() {
        const { width, height } = this.game.canvas;
        const text = this.add.text(width / 2, height / 2, "Loading", {
            fontFamily: 'Arial',
            fontSize: `${Math.min(width, height) / 10}px`
        }).setOrigin(0.5);
    }
}

export default BootScene;