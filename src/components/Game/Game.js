import React, { Component } from 'react';
import Phaser from 'phaser';
import PhaserNavMeshPlugin from 'phaser-navmesh';
import BootScene from './scenes/bootScene';
import MainScene from './scenes/mainScene';

class NavGame extends Component {

    componentDidMount() {
        const DPR = window.devicePixelRatio;
        this.game = new Phaser.Game({
            plugins: {
                scene: [
                    {
                        key: "PhaserNavMeshPlugin",
                        plugin: PhaserNavMeshPlugin,
                        mapping: "navMeshPlugin",
                        start: true
                    }
                ]
            },
            scene: [BootScene, MainScene],
            backgroundColor: '#000000',
            type: Phaser.AUTO,
            scale: {
                parent: 'phaser-game',
                mode: Phaser.Scale.FIT,
                height: 720,//document.documentElement.clientHeight, //* DPR,
                width: 1200, //document.documentElement.clientWidth// * DPR,
                //zoom: 1 / DPR
            },
            physics: {
                default: "arcade",
                arcade: {
                    gravity: 0
                }
            }
        });
    }

    render() {
        return <div id="phaser-game" />;
    }

    shouldComponentUpdate() {
        return false;
    }
}

export default NavGame;