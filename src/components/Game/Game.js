import React, { Component } from 'react';
import Phaser from 'phaser';
import BootScene from './scenes/bootScene';

class NavGame extends Component {

    componentDidMount() {
        const DPR = window.devicePixelRatio;
        this.game = new Phaser.Game({
            scene: [BootScene],
            backgroundColor: '#000000',
            type: Phaser.AUTO,
            scale: {
                parent: 'phaser-game',
                mode: Phaser.Scale.FIT,
                height: document.documentElement.clientHeight,// * DPR,
                width: document.documentElement.clientWidth //* DPR
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