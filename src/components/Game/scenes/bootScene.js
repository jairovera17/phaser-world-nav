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
        this.load.setBaseURL("./phaser-world-nav")
        this.load.image('map', 'GameAssets/map.png');
        this.load.spritesheet('idle', 'GameAssets/idle.png', {
            frameWidth: 96,
            frameHeight: 160,
        })
        this.load.spritesheet('walk', 'GameAssets/walk.png', {
            frameWidth: 120,
            frameHeight: 192,
        })
        this.load.spritesheet('frontWalk', 'GameAssets/frontWalk.png', {
            frameWidth: 120,
            frameHeight: 192,
        })

        this.load.spritesheet('health', 'GameAssets/saveIcon.png', {
            frameWidth: 100,
            frameHeight: 90
        })
        this.load.tilemapTiledJSON('mappy', 'GameAssets/gameMap.json');
        this.load.on('progress', progress =>
            this.loadText.setText(`Loading ...${progress}`));
        this.load.on('complete', () => this.scene.start('mainScene'));
    }
}

export default BootScene;