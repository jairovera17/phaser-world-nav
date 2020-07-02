import Phaser from 'phaser';

class MainScene extends Phaser.Scene {

    constructor() {
        super({ key: 'mainScene' });
    }

    create() {
        const { width, height } = this.game.canvas;
        this.gameMap = this.add.image(0, 0, 'map');
        this.gameMap.setOrigin(0).setInteractive({ useHandCursor: true });
        const min = Math.min(width, height);
        this.gameMap.setDisplaySize(min, min);

        const player = this.add.sprite(width / 2, height / 2, 'idle', 0)
            .setOrigin(0.5, 1)

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