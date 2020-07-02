import Phaser from 'phaser';
import FollowerSprite from '../gameObjects/follower';

class MainScene extends Phaser.Scene {

    constructor() {
        super({ key: 'mainScene' });
    }

    create() {
        const { width, height } = this.game.canvas;
        const mappy = this.add.tilemap('mappy');
        const tileset = mappy.addTilesetImage('map');

        const layer = mappy
            .createStaticLayer('background', [tileset], 0, 0)


        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames('idle'),
            frameRate: 8,
            repeat: -1,
        });

        const objectLayer = mappy.getObjectLayer('navMesh');
        const navMesh = this.navMeshPlugin.buildMeshFromTiled('mesh', objectLayer, 4);
        const graphics = this.add.graphics(0, 0).setAlpha(0.5);
        navMesh.enableDebug(graphics);

        // const player = this.add.follower( 0,0, navMesh);
        const player = new FollowerSprite(this, 120, 250, navMesh, 'idle')
            .setOrigin(0.5, 0.9);
        player.play('idle');

        this.input.on('pointerdown', pointer => {
            const start = new Phaser.Math.Vector2(player.x, player.y);
            const end = new Phaser.Math.Vector2(pointer.x, pointer.y);
            player.goTo(end);
        })
    }

    create2() {
        const { width, height } = this.game.canvas;
        this.gameMap = this.add.image(0, 0, 'map');
        this.gameMap.setOrigin(0).setInteractive({ useHandCursor: true });
        this.gameMap.setDisplaySize(width, height);

        const player = this.add.sprite(width / 2, height / 2, 'idle', 0)
            .setOrigin(0.5, 1);

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames('idle'),
            frameRate: 10,
            repeat: -1,

        });
        player.play('idle');
        this.gameMap.on('pointerdown', ({ x, y }) => this.tweens.add({
            targets: player,
            duration: 1000,
            ease: 'Linear',
            x, y
        }))
    }
}

export default MainScene