const GameState = {
    PLAY: 'play',
    PAUSE: 'pause',
    GAME_OVER: 'game_over',
    SWAPPING: 'swapping',
};

class Game extends Phaser.Scene {
    constructor() {
        super('game');
    }

    init() {
        // Initialize game state variables
        this.playerCards = [];
        this.botCards = [];
        this.deckCards = [];
        this.discardPile = [];
        this.currentPlayer = 'player';
        this.currentColor = null;
        this.colorIndicator = null;
        this.cardSprites = new Map();
        this.isProcessing = false;
        this.state = GameState.PLAY;
        // Constants
        this.ANIMATION_SPEED = 250;
        this.CARD_SCALE = { width: 144, height: 216 };
        this.CARD_SPACING = 60;
        this.DEAL_DELAY = 100;
        this.DECK_OFFSET = 300;
    }

    create() {
        // Setup game background and UI
        const { width, height } = this.cameras.main;
        this.popup = this.add.group();
        
        // Create the visual deck pile immediately at game start
        this.deckPileVisual = this.add.image(this.CARD_SCALE.width + this.DECK_OFFSET, height / 2, 'cardback')
            .setDisplaySize(this.CARD_SCALE.width, this.CARD_SCALE.height);
        
        // Initialize deck and start game
        this.initializeDeck();
        this.shuffleDeck();
        this.dealInitialCards();
    
        // Add Pause button
        createButton(width - 75, 75, 'pause', this);
        let btnSound = createButton(75, 75, 'sound-on', this);
        setSoundButton(btnSound);
        this.buttonClick();
    
        this.stackingPlusCard = 0;
        this.lastSpecialCard = null;
    
        this.activeStackingPlusCard = false;
        if (gameMode === 'stacking'){
            this.activeStackingPlusCard = true;
        }
    
        this.txtBot = this.add.text(width/2, height/2-200, 'Bot turn', {  fontFamily: 'vanilla-extract', fontSize: '24px', fill: '#fff' }).setOrigin(0.5).setVisible(false);
        this.txtPlayer = this.add.text(width/2, height/2+200, 'Player turn', {  fontFamily: 'vanilla-extract', fontSize: '24px', fill: '#fff' }).setOrigin(0.5).setVisible(true);
    
        this.pausePanel();
        this.hoveredCard = [];
        this.iconBlock = this.add.image(width/2, height/2, 'icon-block').setVisible(false).setDepth(4);
        this.iconReverse = this.add.image(width/2, height/2, 'icon-reverse').setVisible(false).setDepth(4);
    }

    buttonClick() {
        this.input.on('gameobjectdown', (pointer, obj) => {
            //console.log(obj);
            if (obj.isButton) {
                this.tweens.add({
                    targets: obj,
                    scaleX: 0.9,
                    scaleY: 0.9,
                    yoyo: true,
                    ease: 'Linear',
                    duration: 100,
                    onComplete: () => {
                        if (obj.name === 'sound') {
                            toggleSound(obj);
                        }
                        if (this.state === GameState.PLAY) {

                            if (obj.name === 'pause') {
                                this.paused();
                            }

                        }
                        else if (this.state === GameState.PAUSE) {
                            this.anims.resumeAll();
                            if (obj.name === 'resume') {
                                this.popup.setVisible(false);
                                this.state = GameState.PLAY;
                            }
                            else if (obj.name === 'restart') {
                                this.tweens.killAll();
                                this.scene.restart();
                            }
                            else if (obj.name === 'exit') {
                                this.scene.start('home');
                            }
                        }
                    }
                });
            }
        });
    }


    initializeDeck() {
        const colors = ['red', 'blue', 'green', 'yellow'];
        const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        const specials = ['block', 'inverse', '2plus'];

        // Add number cards
        colors.forEach(color => {
            numbers.forEach(number => {
                this.deckCards.push({
                    key: `card-${color}-${number}`,
                    color: color,
                    value: number,
                    type: 'number'
                });
            });

            // Add special cards
            specials.forEach(special => {
                this.deckCards.push({
                    key: `card-${color}-${special}`,
                    color: color,
                    value: special,
                    type: 'special'
                });
            });
        });

        // Add wild cards
        ['color', '4plus'].forEach(wild => {
            this.deckCards.push({
                key: `card-wild-${wild}`,
                color: 'wild',
                value: wild,
                type: 'wild'
            });
        });
    }

    shuffleDeck() {
        for (let i = this.deckCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deckCards[i], this.deckCards[j]] = [this.deckCards[j], this.deckCards[i]];
        }
    }

    async dealInitialCards() {
        this.isProcessing = true;

        //await this.dealCardWithAnimation('player', this.getSpecificCard('card-red-2plus'));
        /// await this.dealCardWithAnimation('bot', this.getSpecificCard('card-blue-2plus'));

        // Deal 7 cards to each player with animation
        for (let i = 0; i < 6; i++) {
            await this.dealCardWithAnimation('player');
            await this.dealCardWithAnimation('bot');
        }

        // Place first card in discard pile
        let firstCard;
        do {
            firstCard = this.deckCards.pop();
            if (firstCard.type === 'wild') {
                this.deckCards.unshift(firstCard);
            }
        } while (firstCard.type === 'wild');

        this.discardPile.push(firstCard);
        this.currentColor = firstCard.color;

        // Animate first card placement
        await this.animateCardToDiscardPile(firstCard);

        // Setup interactive deck pile
        this.setupDeckPile();

        // Update color indicator
        this.updateColorIndicator();
        const playableCards = this.playerCards.filter(card => this.canPlayCard(card));
        if (playableCards.length > 0) {
            this.hoverCard(playableCards);
        }
        else {
            this.arrow.setVisible(true);
        }

        this.isProcessing = false;
    }

    async dealCardWithAnimation(target, card = null) {
        const { width, height } = this.cameras.main;
        if (card === null) {
            card = this.deckCards.pop();
        }
        if (target === 'player') {
            this.playerCards.push(card);
        } else {
            this.botCards.push(card);
        }

        const sprite = this.add.image(this.CARD_SCALE.width + this.DECK_OFFSET, height / 2,
            target === 'player' ? card.key : 'cardback')
            .setDisplaySize(this.CARD_SCALE.width, this.CARD_SCALE.height);

        const targetX = (width / 2) + ((target === 'player' ?
            this.playerCards : this.botCards).length / 2) * this.CARD_SPACING;


        const targetY = target === 'player' ?
            height - this.CARD_SCALE.height / 2 : this.CARD_SCALE.height / 2;

        await this.tweenCardMovement(sprite, targetX, targetY);
        sprite.destroy();
        this.updateCardLayouts();

        // Play appropriate sound effect
        if (target === 'player') {
            playSound('card_player', this);
        } else {
            playSound('card_bot', this);
        }

        return new Promise(resolve => setTimeout(resolve, this.DEAL_DELAY));
    }

    getSpecificCard(cardKey) {
        return this.deckCards.find(card => card.key === cardKey)
    }

    tweenCardMovement(sprite, targetX, targetY) {
        return new Promise(resolve => {
            this.tweens.add({
                targets: sprite,
                x: targetX,
                y: targetY,
                duration: this.ANIMATION_SPEED,
                ease: 'Power2',
                onComplete: resolve
            });
        });
    }

    setupDeckPile() {
        const { width, height } = this.cameras.main;
        
        // Remove the previous deck visual if it exists
        if (this.deckPileVisual) {
            this.deckPileVisual.destroy();
        }
        
        // Create a new interactive deck pile
        this.deckPileVisual = this.add.image(this.CARD_SCALE.width + this.DECK_OFFSET, height / 2, 'cardback')
            .setDisplaySize(this.CARD_SCALE.width, this.CARD_SCALE.height)
            .setInteractive()
            .on('pointerdown', () => this.onDeckClick());
        
        this.arrow = this.add.image(this.CARD_SCALE.width + this.DECK_OFFSET, height / 2 + 150, 'arrow').setVisible(false);
        this.tweens.add({
            targets: this.arrow,
            y: '+=10',
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    updateCardLayouts(card = null) {
        const { width, height } = this.cameras.main;



        // Clear existing card sprites
        this.hoveredCard.forEach(anim => anim.stop());
        this.hoveredCard = [];
        //  this.cardSprites.forEach(sprite => sprite.destroy());
        //  this.cardSprites.clear();



        // Update player cards

        //   console.log(this.playerCards);

        this.playerCards.forEach((card, index) => {

            const x = (width / 2) + (index - this.playerCards.length / 2) * this.CARD_SPACING;
            const y = height - 20 - this.CARD_SCALE.height / 2;

            if (this.cardSprites.get(card) === undefined) {
                const cardSprite = this.add.image(x, y, card.key)
                    .setDisplaySize(this.CARD_SCALE.width, this.CARD_SCALE.height)
                    .setInteractive();

                cardSprite.on('pointerdown', () => {
                    // Play card click sound on any card click
                    playSound('card_click', this);
                    this.onPlayerCardClick(card, cardSprite);
                });
                this.cardSprites.set(card, cardSprite);
            }

            //let cardSprite = this.cardSprites.get(card);


            this.tweens.add({
                targets: this.cardSprites.get(card),
                x: x,
                y: y,
                duration: 500,
                ease: 'Power2'
            });
        });

        // Update bot cards
        this.botCards.forEach((card, index) => {
            const x = (width / 2) + (index - this.botCards.length / 2) * this.CARD_SPACING;
            const y = this.CARD_SCALE.height / 2 + 20;

            if (this.cardSprites.get(card) === undefined) {
                const cardSprite = this.add.image(x, y, 'cardback')
                    .setDisplaySize(this.CARD_SCALE.width, this.CARD_SCALE.height);
                this.cardSprites.set(card, cardSprite);
            }

            this.tweens.add({
                targets: this.cardSprites.get(card),
                x: x,
                y: y,
                duration: 500,
                ease: 'Power2'
            });
        });

        // Update discard pile
        if (this.discardPile.length > 0) {
            const topCard = this.discardPile[this.discardPile.length - 1];
            this.add.image(width / 2, height / 2, topCard.key)
                .setDisplaySize(this.CARD_SCALE.width, this.CARD_SCALE.height);
        }
    }

    updateCardLayout() {
        const { width, height } = this.cameras.main;



        // Clear existing card sprites
        this.hoveredCard.forEach(anim => anim.stop());
        this.hoveredCard = [];
        this.cardSprites.forEach(sprite => sprite.destroy());
        this.cardSprites.clear();


        // Update player cards
        this.playerCards.forEach((card, index) => {
            const x = (width / 2) + (index - this.playerCards.length / 2) * this.CARD_SPACING;
            const y = height - 20 - this.CARD_SCALE.height / 2;

            const cardSprite = this.add.image(x, y, card.key)
                .setDisplaySize(this.CARD_SCALE.width, this.CARD_SCALE.height)
                .setInteractive();

            cardSprite.on('pointerdown', () => this.onPlayerCardClick(card, cardSprite));
            this.cardSprites.set(card, cardSprite);
        });

        // Update bot cards
        this.botCards.forEach((card, index) => {
            const x = (width / 2) + (index - this.botCards.length / 2) * this.CARD_SPACING;
            const y = this.CARD_SCALE.height / 2 + 20;

            const cardSprite = this.add.image(x, y, 'cardback')
                .setDisplaySize(this.CARD_SCALE.width, this.CARD_SCALE.height);
            this.cardSprites.set(card, cardSprite);
        });

        // Update discard pile
        if (this.discardPile.length > 0) {
            const topCard = this.discardPile[this.discardPile.length - 1];
            this.add.image(width / 2, height / 2, topCard.key)
                .setDisplaySize(this.CARD_SCALE.width, this.CARD_SCALE.height);
        }
    }

    updateColorIndicator() {
        const { width, height } = this.cameras.main;
        const colorMap = {
            'red': 0xff0000,
            'blue': 0x0000ff,
            'green': 0x00ff00,
            'yellow': 0xffff00
        };

        if (this.colorIndicator) {
            this.colorIndicator.destroy();
        }

        // this.colorIndicator = this.add.rectangle(
        //     width - 60, height / 2, 40, 40,
        //     colorMap[this.currentColor] || 0xffffff
        // );

        this.colorIndicator = this.add.sprite(width / 2 + 150, height / 2 - 50, `icon-${this.currentColor}`).setScale(0.7)
    }

    async onPlayerCardClick(card, cardSprite) {
        if (this.isProcessing || this.currentPlayer !== 'player') return;

        if (this.canPlayCard(card)) {
            if (this.lastSpecialCard === '2plus') {
                if (card.value !== '2plus') {
                    return;
                }
            }

            this.isProcessing = true;

            // Add played by information
            card.playedBy = 'player';

            // Animate card play
            await this.animateCardPlay(cardSprite);

            // Update game state
            this.playerCards = this.playerCards.filter(c => c !== card);
            this.discardPile.push(card);
            this.currentColor = card.type === 'wild' ? this.currentColor : card.color;

            // Handle special card effects
            await this.handleSpecialCard(card);

            // Update display
            this.cardSprites.delete(card);
            this.updateCardLayouts();
            this.updateColorIndicator();


            // Check win condition
            if (this.playerCards.length === 0) {
                await this.showWinScreen('player');
                return;
            }

            // Switch turns unless it was a block/inverse card
            if (!['block', 'inverse'].includes(card.value)) {
                this.currentPlayer = 'bot';
                this.txtBot.setVisible(true);
                this.txtPlayer.setVisible(false);
                setTimeout(() => this.botTurn(), 1000);

            }
            else {
                this.setTurnToPlayer();
            }

            this.isProcessing = false;
        }
    }

    async onDeckClick() {
        if (this.isProcessing || this.currentPlayer !== 'player') return;
        
        // Check if player has playable cards - if so, prevent drawing
        const playableCards = this.playerCards.filter(card => this.canPlayCard(card));
        
        // If there's a stacking +2 situation, allow drawing to take the penalty
        if (this.lastSpecialCard === '2plus') {
            this.isProcessing = true;
            // Hide the arrow immediately when drawing cards
            this.arrow.setVisible(false);
            
            for (let i = 0; i < this.stackingPlusCard; i++) {
                await this.drawCardWithAnimation('player');
            }
            this.stackingPlusCard = 0;
            this.lastSpecialCard = null;
            this.isProcessing = false;
            
            // Switch turns after taking the penalty
            this.currentPlayer = 'bot';
            this.txtBot.setVisible(true);
            this.txtPlayer.setVisible(false);
            setTimeout(() => this.botTurn(), 1000);
            return;
        }
        
        // Only allow drawing if the player has no playable cards
        if (playableCards.length === 0) {
            this.isProcessing = true;
            
            // Hide the arrow immediately when drawing cards
            this.arrow.setVisible(false);
    
            // Reshuffle if deck is empty
            if (this.deckCards.length === 0) {
                const lastCard = this.discardPile.pop();
                this.deckCards = this.discardPile;
                this.discardPile = [lastCard];
                this.shuffleDeck();
            }
    
            // Draw and animate new card
            await this.drawCardWithAnimation('player');
            
            // Switch turns
            this.currentPlayer = 'bot';
            this.txtBot.setVisible(true);
            this.txtPlayer.setVisible(false);
            setTimeout(() => this.botTurn(), 1000);
            
            this.isProcessing = false;
        } else {
            // Highlight playable cards again as a hint
            this.hoveredCard.forEach(anim => anim.stop());
            this.hoveredCard = [];
            this.hoverCard(playableCards);
        }
    }

    async botTurn() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        this.txtBot.setVisible(true);
        this.txtPlayer.setVisible(false);
        this.arrow.setVisible(false);

        // Find playable cards
        const playableCards = this.botCards.filter(card => this.canPlayCard(card));

        if (playableCards.length > 0) {
            let card = null;
            // Choose and play card
            if (this.lastSpecialCard === '2plus') {
                card = this.botCards.find(c => c.value === '2plus');
            }
            else {
                card = this.chooseBotCard(playableCards);
            }

            // Add played by information
            card.playedBy = 'bot';

            this.cardSprites.get(card).destroy();
            this.cardSprites.delete(card);

            // Create temporary sprite for animation
            const { width } = this.cameras.main;
            const sprite = this.add.image(
                (width / 2) + (this.botCards.indexOf(card) - this.botCards.length / 2) * this.CARD_SPACING,
                this.CARD_SCALE.height / 2,
                card.key
            ).setDisplaySize(this.CARD_SCALE.width, this.CARD_SCALE.height);

            await this.animateCardPlay(sprite);

            // Update game state
            this.botCards = this.botCards.filter(c => c !== card);
            this.discardPile.push(card);
            this.currentColor = card.type === 'wild' ? this.selectRandomColor() : card.color;


            await this.handleSpecialCard(card);

            // Update display
            this.updateCardLayouts();
            this.updateColorIndicator();
            console.log(this.botCards);
            if (this.botCards.length === 0) {
                console.log("Bot wins");
                console.log(this.botCards);
                await this.showWinScreen('bot');
                return;
            }

            // Switch turns unless it was a block/inverse card
            if (!['block', 'inverse'].includes(card.value)) {
                this.setTurnToPlayer()

            } else {
                // If it was a block/inverse card, bot plays again after a delay
                setTimeout(() => this.botTurn(), 1000);
            }
        } else {
            // Draw card if no playable cards
            if (this.deckCards.length === 0) {
                const lastCard = this.discardPile.pop();
                this.deckCards = this.discardPile;
                this.discardPile = [lastCard];
                this.shuffleDeck();
            }

            await this.drawCardWithAnimation('bot');
            this.setTurnToPlayer()
        }

        this.isProcessing = false;
    }

    setTurnToPlayer() {
        this.arrow.setVisible(false);
        this.currentPlayer = 'player';
        this.txtBot.setVisible(false);
        this.txtPlayer.setVisible(true);
        const playableCards = this.playerCards.filter(card => this.canPlayCard(card));
        console.log(playableCards);
        if (playableCards.length > 0) {
            this.hoverCard(playableCards);

        }
        else {
            this.arrow.setVisible(true);
        }

    }

    chooseBotCard(playableCards) {
        // Simple AI: Prioritize special cards and matching colors
        const specialCards = playableCards.filter(card => card.type === 'special');
        if (specialCards.length > 0) {
            return specialCards[Math.floor(Math.random() * specialCards.length)];
        }
        return playableCards[Math.floor(Math.random() * playableCards.length)];
    }

    canPlayCard(card) {
        const topCard = this.discardPile[this.discardPile.length - 1];

        return card.type === 'wild' ||
            card.color === this.currentColor ||
            (card.type === 'number' && topCard.value === card.value) ||
            (card.type === 'special' && topCard.value === card.value);
    }



    selectRandomColor() {
        const colors = ['red', 'blue', 'green', 'yellow'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    async handleSpecialCard(card) {
        switch (card.value) {
            case 'block':
                // Skip the next player's turn
                // If player plays block, bot gets skipped (stays on player)
                // If bot plays block, player gets skipped (stays on bot)
                playSound('skip', this);

                this.showIconBlock();
                this.currentPlayer = card.playedBy || this.currentPlayer;
                break;

            case 'inverse':
                // Reverse the turn order (in 2 player game, acts like block)
                // In a 2-player game, reverse acts the same as skip/block
                playSound('reverse', this);
                this.showIconReverse();
                this.currentPlayer = card.playedBy || this.currentPlayer;
                break;

            case '2plus':
                if (this.activeStackingPlusCard) {
                    this.stackingPlusCard += 2;
                    await this.modeStackingPlusCard(card);
                }
                else {
                    for (let i = 0; i < 2; i++) {
                        if (this.currentPlayer === 'player') {
                            await this.drawCardWithAnimation('bot');
                        } else {
                            await this.drawCardWithAnimation('player');
                        }
                    }
                }

                playSound('2plus', this);

                break;

            case '4plus':
                for (let i = 0; i < 4; i++) {
                    if (this.currentPlayer === 'player') {
                        await this.drawCardWithAnimation('bot');
                    } else {
                        await this.drawCardWithAnimation('player');
                    }
                }
                this.currentColor = this.currentPlayer === 'player'
                    ? await this.showColorPicker()
                    : this.selectRandomColor();
                
                playSound('2plus', this);
                break;

            case 'color':
                this.currentColor = this.currentPlayer === 'player'
                    ? await this.showColorPicker()
                    : this.selectRandomColor();
                playSound('wild', this);
                break;
        }
    }

    async modeStackingPlusCard(card) {
        this.lastSpecialCard = card.value;

        if (this.currentPlayer == 'bot') {

            const hasSpecialCards = this.hasSpecialCard(card);
            if (hasSpecialCards.length > 0) {
                console.log("Player has special card");
            }
            else {
                for (let i = 0; i < this.stackingPlusCard; i++) {
                    await this.drawCardWithAnimation('player');
                }
                this.stackingPlusCard = 0;
            }
        }
        else if (this.currentPlayer == 'player') {
            const hasSpecialCards = this.hasSpecialCard(card);
            if (hasSpecialCards.length > 0) {
                console.log("Bot has special card");

            }
            else {
                for (let i = 0; i < this.stackingPlusCard; i++) {
                    await this.drawCardWithAnimation('bot');
                }
                this.stackingPlusCard = 0;
            }
        }
    }

    hasSpecialCard(card) {
        if (this.currentPlayer == 'player') {
            // check deck bot has same special card
            return this.botCards.filter(c => c.value === card.value);
        }
        else {
            // check deck player has same special card
            return this.playerCards.filter(c => c.value === card.value);
        }
    }



    hoverCard(cards) {
        const { height } = this.cameras.main;
        if (this.modeStackingPlusCard && this.stackingPlusCard > 0) {
            cards = cards.filter(card => card.value === '2plus');
        }

        cards.forEach(card => {
            const sprite = this.cardSprites.get(card);
            sprite.y = height - 20 - this.CARD_SCALE.height / 2;
            const anim = this.tweens.add({
                targets: sprite,
                y: '-=20',
                duration: 500,
                yoyo: true,
                repeat: -1
            });
            this.hoveredCard.push(anim);
        });
        this.hoveredCard.forEach(anim => {
            anim.play();
        });
    }


    showColorPicker() {
        return new Promise(resolve => {
            const { width, height } = this.cameras.main;
            const container = this.add.container(width / 2, height + 200); // Start from below screen

            const popup = this.add.sprite(0, 0, 'popup');
            const txtColor = this.add.text(0, -80, 'Choose Color', {
                fontFamily: 'vanilla-extract',
                fontSize: '48px',
                fill: '#fff'
            }).setOrigin(0.5);

            const colors = ['red', 'blue', 'green', 'yellow'];
            const buttons = [];

            colors.forEach((color, index) => {
                const button = this.add.sprite(
                    -150 + index * 100,
                    20,
                    `icon-${color}`
                ).setInteractive();

                button.on('pointerdown', () => {
                    // Animate container down when color is selected
                    this.tweens.add({
                        targets: container,
                        y: height + 200,
                        duration: 500,
                        ease: 'Back.easeIn',
                        onComplete: () => {
                            container.destroy();
                            resolve(color);
                        }
                    });
                });

                buttons.push(button);
            });

            // Add all elements to container
            container.add([popup, txtColor, ...buttons]);
            container.setDepth(2);

            // Animate container up from below
            this.tweens.add({
                targets: container,
                y: height / 2 - 150,
                duration: 500,
                ease: 'Back.easeOut'
            });
        });
    }

    showIconBlock() {
        this.iconBlock.setScale(0.5);
        this.iconBlock.setVisible(true);
        const tween = this.tweens.add({
            targets: this.iconBlock,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Back.easeOut',
            yoyo: true,
            onComplete: () => {
                this.iconBlock.setVisible(false);

            }
        });

        tween.play();

    }

    showIconReverse() {

        this.iconReverse.setVisible(true);
        // Add rotation animation
        this.tweens.add({
            targets: this.iconReverse,
            rotation: Math.PI * 2, // Full 360-degree rotation
            duration: 500,
            ease: 'Power2',
            yoyo: true,
            onComplete: () => {
                this.iconReverse.setVisible(false);
                this.iconReverse.setRotation(0); // Reset rotation
            }
        });
    }

    async animateCardPlay(cardSprite) {
        const { width, height } = this.cameras.main;

        return new Promise(resolve => {
            // Add a slight "lift" animation
            cardSprite.setDepth(2);

            this.tweens.add({
                targets: cardSprite,
                y: '-=30',
                scaleX: 1.1,
                scaleY: 1.1,
                duration: this.ANIMATION_SPEED / 2,
                ease: 'Power2',
                onComplete: () => {
                    // Move to target position
                    this.tweens.add({
                        targets: cardSprite,
                        x: width / 2,
                        y: height / 2,
                        scaleX: 1,
                        scaleY: 1,
                        duration: this.ANIMATION_SPEED,
                        ease: 'Power2',
                        onComplete: () => {
                            playSound('card_drop', this)
                            cardSprite.destroy();
                            resolve();
                        }
                    });
                }
            });
        });
    }

    async animateCardToDiscardPile(card) {
        const { width, height } = this.cameras.main;
        const sprite = this.add.image(this.CARD_SCALE.width, height / 2, card.key)
            .setDisplaySize(this.CARD_SCALE.width, this.CARD_SCALE.height);

        playSound('first_card', this);
        return this.tweenCardMovement(sprite, width / 2, height / 2);
    }

    async drawCardWithAnimation(target) {
        const { width, height } = this.cameras.main;
        this.lastSpecialCard = null;

        console.log("Draw card with animation. deckCards: ", this.deckCards.length);
        if (this.deckCards.length === 0) {
            const lastCard = this.discardPile.pop();
            this.deckCards = this.discardPile;
            this.discardPile = [lastCard];
            this.shuffleDeck();
        }
        const card = this.deckCards.pop();

        const sprite = this.add.image(this.CARD_SCALE.width + this.DECK_OFFSET, height / 2,
            target === 'player' ? card.key : 'cardback')
            .setDisplaySize(this.CARD_SCALE.width, this.CARD_SCALE.height);

        const targetX = (width / 2) +
            ((target === 'player' ? this.playerCards : this.botCards).length / 2) *
            this.CARD_SPACING;
        const targetY = target === 'player' ?
            height - this.CARD_SCALE.height / 2 : this.CARD_SCALE.height / 2;

        await this.tweenCardMovement(sprite, targetX, targetY);
        sprite.destroy();

        if (target === 'player') {
            this.playerCards.push(card);
            playSound('card_player', this);
        } else {
            this.botCards.push(card);
            playSound('card_bot', this);
        }

        this.updateCardLayouts();
    }

    async showWinScreen(winner) {
        const { width, height } = this.cameras.main;
        const bgDark = this.add.rectangle(0, 0, width, height, 0x000000, 0.5).setOrigin(0);
        bgDark.setInteractive();
        let txtWin;
        if (winner === 'player') {
            txtWin = this.add.image(width / 2, height / 2 - 100, 'txt-win').setScale(0.5);
        }
        else {
            txtWin = this.add.image(width / 2, height / 2 - 100, 'txt-lose').setScale(0.5);
        }

        if (winner === 'player') {
            playSound('win', this);
        } else {
            playSound('lose', this);
        }

        // Animate winning text
        await new Promise(resolve => {
            this.tweens.add({
                targets: txtWin,
                alpha: 1,
                scale: 1,
                duration: 1000,
                ease: 'Bounce',
                onComplete: resolve
            });
        });

        const btnRestart = createButton(width / 2, height / 2 + 100, 'newgame', this);
        btnRestart.on('pointerdown', () => {
            txtWin.destroy();
            btnRestart.destroy();
            this.scene.restart();
        });

    }


    pausePanel() {
        const { width, height } = this.cameras.main;

        const darkLayer = this.add.rectangle(0, 0, width, height, 0x000000, 0.2).setOrigin(0).setInteractive();
        const panel = this.add.image(width / 2, height / 2, 'popup');
        const txtPause = this.add.text(panel.x, panel.y - 80, 'Pause', { fontFamily: 'vanilla-extract', fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
        const btnResume = createButton(width / 2 - 130, height / 2 + 30, 'resume', this);
        const btnRestart = createButton(width / 2, height / 2 + 30, 'restart', this);
        const btnExit = createButton(width / 2 + 130, height / 2 + 30, 'exit', this);

        this.popup.addMultiple([darkLayer, panel, txtPause, btnResume, btnRestart, btnExit]).setDepth(2).setVisible(false);
    }

    paused() {
        this.popup.setVisible(true);
        this.state = GameState.PAUSE;
        this.anims.pauseAll();

    }
}

var config = {
    type: Phaser.AUTO,
    transparent: true,
    width: 1280,
    height: 1080,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game-content',
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [Boot, Load, Home, Game]
}
var game = new Phaser.Game(config);