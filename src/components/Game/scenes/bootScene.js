import Phaser from "phaser";

class BootScene extends Phaser.Scene {

    constructor() {
        super({ key: 'bootScene' });
    }

    init() {
        const { width, height } = this.game.canvas;
        this.loadText = this.add.text(width / 2, height / 2, "Loading", {
            fontFamily: 'Arial',
            fontSize: `${Math.min(width, height) / 10}px`
        }).setOrigin(0.5);
    }

    preload() {
        this.load.image('map', 'phaser-world-nav/GameAssets/map.png');
        this.load.spritesheet('idle', 'phaser-world-nav/GameAssets/idle.png', {
            frameWidth: 96,
            frameHeight: 160,
        })
        this.load.on('progress', progress =>
            this.loadText.setText(`Loading ...${progress}`));
        this.load.on('complete', () => this.scene.start('mainScene'));
    }
}

export default BootScene;