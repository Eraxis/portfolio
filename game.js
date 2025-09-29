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
    // Tilesets
    this.load.image('tiles', 'assets/tiles/Tileset.png');

    // Personnage
    this.load.spritesheet('link', 'assets/sprites/Link_anim.png', { frameWidth: 16, frameHeight: 16 });

    // Coffre
    //this.load.image('chest', 'assets/sprites/chest.png');

    // Sons/Musique
    // this.load.audio('music', 'assets/audio/music.mp3');
}

function create() {
    // Carte simple
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('dungeon', 'tiles');
    map.createLayer('Ground', tileset, 0, 0);
    map.createLayer('Walls', tileset, 0, 0);

    // Personnage
    player = this.physics.add.sprite(400, 300, 'link', 0);
    player.setCollideWorldBounds(true);

    // Animations marche
    this.anims.create({
        key: 'walk-down',
        frames: this.anims.generateFrameNumbers('link', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
    });
    this.anims.create({
        key: 'walk-left',
        frames: this.anims.generateFrameNumbers('link', { start: 4, end: 7 }),
        frameRate: 8,
        repeat: -1
    });
    this.anims.create({
        key: 'walk-right',
        frames: this.anims.generateFrameNumbers('link', { start: 8, end: 11 }),
        frameRate: 8,
        repeat: -1
    });
    this.anims.create({
        key: 'walk-up',
        frames: this.anims.generateFrameNumbers('link', { start: 12, end: 15 }),
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

        // Interaction avec le coffre
        this.physics.add.overlap(player, chestSprite, () => {
            showPopup(chestSprite.content);
        });
    });

    // Popup HTML pour afficher le contenu
    popup = document.getElementById('popup');
    popup.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    // (Optionnel) musique d'ambiance
    // let music = this.sound.add('music', { loop: true });
    // music.play();
}

function update() {
    player.setVelocity(0);
    let moving = false;

    if (cursors.left.isDown) {
        player.setVelocityX(-100);
        player.anims.play('walk-left', true);
        moving = true;
    } else if (cursors.right.isDown) {
        player.setVelocityX(100);
        player.anims.play('walk-right', true);
        moving = true;
    } 

    if (cursors.up.isDown) {
        player.setVelocityY(-100);
        if (!moving) player.anims.play('walk-up', true);
        moving = true;
    } else if (cursors.down.isDown) {
        player.setVelocityY(100);
        if (!moving) player.anims.play('walk-down', true);
        moving = true;
    }

    if (!moving) {
        player.anims.stop();
    }
}

// Fonction pour afficher un popup HTML
function showPopup(text) {
    popup.innerText = text + "\n\n(Cliquez pour fermer)";
    popup.style.display = 'block';
}



