const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let chests = [];
let popup;

function preload() {
    this.load.image('tiles', 'https://examples.phaser.io/assets/tilemaps/tiles/dungeon.png');
    this.load.tilemapTiledJSON('map', 'https://examples.phaser.io/assets/tilemaps/maps/dungeon.json');
    this.load.spritesheet('player', 'https://examples.phaser.io/assets/sprites/phaser-dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('chest', 'https://examples.phaser.io/assets/sprites/chest.png');
}

function create() {
    // Carte
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('dungeon', 'tiles');
    map.createLayer('Ground', tileset, 0, 0);
    map.createLayer('Walls', tileset, 0, 0);

    // Personnage
    player = this.physics.add.sprite(400, 300, 'player', 4);
    player.setCollideWorldBounds(true);

    // Animation marche simple
    this.anims.create({
        key: 'walk-down',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    // Coffres thématiques
    const chestData = [
        { x: 500, y: 300, content: "Compétences : HTML / CSS / JS / Phaser" },
        { x: 200, y: 400, content: "Formations : Bachelor en Informatique" },
        { x: 600, y: 500, content: "Projets : Mini-jeu CV interactif" }
    ];

    chestData.forEach(data => {
        let chestSprite = this.physics.add.staticSprite(data.x, data.y, 'chest');
        chestSprite.content = data.content;
        chests.push(chestSprite);

        // Interaction
        this.physics.add.overlap(player, chestSprite, () => {
            showPopup(chestSprite.content);
        });
    });

    popup = document.getElementById('popup');

    // Fermer le popup au clic
    popup.addEventListener('click', () => {
        popup.style.display = 'none';
    });
}

function update() {
    player.setVelocity(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-150);
        player.anims.play('walk-down', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(150);
        player.anims.play('walk-down', true);
    } else if (cursors.up.isDown) {
        player.setVelocityY(-150);
        player.anims.play('walk-down', true);
    } else if (cursors.down.isDown) {
        player.setVelocityY(150);
        player.anims.play('walk-down', true);
    } else {
        player.anims.stop();
    }
}

function showPopup(text) {
    popup.innerText = text + "\n\n(Cliquez pour fermer)";
    popup.style.display = 'block';
}
