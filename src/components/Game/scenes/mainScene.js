import Phaser from 'phaser';
import FollowerSprite from '../gameObjects/follower';

class MainScene extends Phaser.Scene {

    constructor() {
        super({ key: 'mainScene' });
    }

    preload() {
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames('idle'),
            frameRate: 8,
            repeat: -1,
        });
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('walk'),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: 'frontWalk',
            frames: this.anims.generateFrameNames('frontWalk'),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: 'rotateIcon',
            frames: this.anims.generateFrameNames('health'),
            frameRate: 10,
            repeat: -1
        })
    }

    create() {
        this.health = 0;
        this.text = this.add.text(0, 0, 'Health: 0', { fontFamily: 'Arial', fontSize: '5em' })
            .setDepth(1);
        const mappy = this.add.tilemap('mappy');
        const tileset = mappy.addTilesetImage('map');
        mappy.createStaticLayer('background', [tileset], 0, 0);
        const objectLayer = mappy.getObjectLayer('navMesh');
        const { x, y, width, height } = objectLayer.objects[0];
        console.log(objectLayer);
        const navMesh = this.navMeshPlugin.buildMeshFromTiled('mesh', objectLayer, 4);

        const items = mappy.createFromObjects('items', 3376, 'health')
            .map(sprite => sprite
                .play('rotateIcon')
                .setScale(1));
        const player = new FollowerSprite(this, x + width / 2, y + height / 2, navMesh, 'idle')
            .setOrigin(0.5, 0.9)
            .onTopLeftMovement(() => {
                player.play('frontWalk');
                player.setFlipX(false);
            }).onTopRightMovement(() => {
                player.play('frontWalk');
                player.setFlipX(true);
            }).onBottomLeftMovement(() => {
                player.play('walk');
                player.setFlipX(false);
            }).onBottomRightMovement(() => {
                player.play('walk');
                player.setFlipX(true);
            }).onMovementComplete(() => player.play('idle'))
        player.play('idle');
        items.forEach(item => this.physics.world.enable(item));

        this.physics.world.addOverlap(player, items,
            (player, item) => {
                this.physics.world.disable(item);
                this.health++;
                this.text.setText(`Health: ${this.health}`)
                this.tweens.add({
                    targets: item,
                    x: 0,
                    y: 0,
                    duration: 1500,
                    alpha: { from: 1, to: 0.25 },
                    onComplete: () => item.destroy()
                })
            });

        this.input.on('pointerdown', pointer => {
            player.goTo(new Phaser.Math.Vector2(pointer.x, pointer.y));
        })
    }
}

export default MainScene