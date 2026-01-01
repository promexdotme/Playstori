const GameState = {
    PLAY: 'play',
    PAUSE: 'pause',
    GAME_OVER: 'game_over',
    SWAPPING: 'swapping',
};

class Game extends Phaser.Scene {
    constructor() {
        super('game');
        
        this.gridWidth = 14;
        this.gridHeight = 16;
        this.bubbleSize = 48;
        this.bubbleThreshold = 5;
        this.bubbleOffsetTop = 40;
        this.maxColor = 8;
        this.shootSpeed = 1500;
        this.soreMultipler = 10;
        this.minMatchSize = 3;
        this.pushDistance = 60; // Distance for the push effect
        this.pushDuration = 200; // Duration of the push animation in milliseconds
        this.returnDuration = 200; // Duration of the return animation in milliseconds
        this.currentAngle = 0; // Store the current angle (aim or after bounce)
        this.hasBounced = false;
        this.shotsUntilDrop = 5; // Number of shots before bubbles drop
        this.currentShots = 0; // Counter for shots taken
        this.animationDelay = 350;
        this.canShoot = true;
        this.isAnimating = false;
        this.nextBubbleColor = null;
        this.nextNextBubbleColor = null;
        this.maxTreshold = 0.6;
        //
        this.touchStartTime = 0;
        this.isDragging = false;
        this.touchThreshold = 200; // Time in ms to distinguish between tap and drag
        this.dragStarted = false;
    }

    create() {
        const self = this;
        this.state = GameState.PLAY;
        this.add.sprite(config.width/2, config.height/2, 'background').setDepth(-1);
		this.popup = this.add.group();
        this.debugcircle = [];
        // Create the game variables
        this.score = 0;
        this.colors = 4; // Number of different bubble colors
        // Create bubble grid
        this.bubbleGroup = this.physics.add.staticGroup();
        this.grid = Array(this.gridHeight).fill().map(() => Array(this.gridWidth).fill(null));
        this.createBubbleGrid();

        // Create shooter
        this.add.sprite(370, 1000, 'ground');
        this.shooter = this.add.sprite(360, 980, 'cannon');
        this.shooter.setOrigin(0.5, 0.9); // set origin to bottom center
        // Create aim line
        this.aimLine = this.add.sprite(this.shooter.x, this.shooter.y - 170, 'line').setDepth(2);
        this.aimLine.setOrigin(0.5, 1);
        this.ballLocation = {x: this.shooter.x, y: this.shooter.y };

        // Create shootable bubble
        this.shootableBubble = this.physics.add.sprite(this.shooter.x, this.shooter.y, 'bubble', 0);
        this.shootableBubble.setCircle((this.bubbleSize) / 3);
        this.shootableBubble.setDepth(3);
        this.shootableBubble.disableBody(true, true);

        // Create next bubble preview & chest
        this.chest = this.add.sprite(100, 945, 'chest');
        this.nextBubblePreview = this.add.sprite(this.shooter.x - 30, this.shooter.y + 60, 'bubble', 0).setOrigin(0.52, 0.5);

        // Create next next bubble preview
        this.nextNextBubblePreview = this.add.sprite(this.chest.x, this.chest.y-15, 'bubble', 0);

        // Prepare the next two bubble colors
        this.nextBubbleColor = Phaser.Math.Between(0, this.colors - 1);
        this.nextNextBubbleColor = Phaser.Math.Between(0, this.colors - 1);
        this.updateBubblePreviews();

        this.canShoot = true;

        this.updateAimLine(this.input.activePointer);
        // Set up input
        this.input.on('pointerdown', this.onPointerDown, this);
        this.input.on('pointermove', this.onPointerMove, this);
        this.input.on('pointerup', this.onPointerUp, this);

        // Set up collision
        this.physics.add.collider(this.shootableBubble, this.bubbleGroup, this.handleCollision, null, this);

        // Prepare the next bubble color
        this.nextBubbleColor = Phaser.Math.Between(0, this.colors - 1);
        this.nextBubblePreview.setFrame(this.nextBubbleColor);
       
        // Set up world bounds
        this.physics.world.setBounds(0, 0, this.game.config.width, this.game.config.height);

        // Enable world bounds collision for the shootable bubble
        this.shootableBubble.setCollideWorldBounds(true);
        this.shootableBubble.setBounce(1, 0);

        // Only collide with left and right bounds
        this.shootableBubble.body.onWorldBounds = true;
        this.physics.world.on('worldbounds', this.handleWorldBoundsCollision, this);
        this.currentShots = 0;

         // Create the game UI
        // this.add.sprite(0, 20, 'top-offset').setOrigin(0, 0).setDepth(2);
        this.add.sprite(0, -10, 'top-shadow').setOrigin(0, 0).setDepth(2);
        this.add.text(config.width/2 - 200, 10, 'HighScore: ', {fontFamily: 'alphakind', fontSize: 24, color: '#FFFFFF'}).setDepth(2);
        this.add.text(config.width - 200, 10, 'Score: ', {fontFamily: 'alphakind', fontSize: 24, color: '#FFFFFF'}).setDepth(2);
        this.highScoreText = this.add.text(config.width/2-50, 10, '0 ', {fontFamily: 'alphakind', fontSize: 24, color: '#FFFFFF'}).setDepth(2);
        this.scoreText = this.add.text(config.width-100, 10, '0 ', {fontFamily: 'alphakind', fontSize: 24, color: '#FFFFFF'}).setDepth(2);
        this.updateTextScore();

         createButton(75, game.config.height - 75, 'resuffle', this);
         createButton(game.config.width -75 , game.config.height - 75, 'pause', this);

         // create panel 
        this.panelPause();
        this.makeInput();

        const animations = [
            { key: 'break-0', frames: [0, 1, 2, 3] },
            { key: 'break-1', frames: [4, 5, 6, 7] },
            { key: 'break-2', frames: [8, 9, 10, 11] },
            { key: 'break-3', frames: [12, 13, 14, 15] },
            { key: 'break-4', frames: [16, 17, 18, 19] },
            { key: 'break-5', frames: [20, 21, 22, 23] },
            { key: 'break-6', frames: [24, 25, 26, 27] },
            { key: 'break-7', frames: [28, 29, 30, 31] },
        ];
        
        animations.forEach(anim => {
            if (!this.anims.exists(anim.key)) {
                this.anims.create({
                    key: anim.key,
                    frameRate: 15,
                    frames: this.anims.generateFrameNumbers('breaks', { frames: anim.frames })
                });
            }
        });
    }

    onPointerDown(pointer) {
        if (!this.canShoot || this.state !== GameState.PLAY) return;
        
        this.touchStartTime = pointer.time;
        this.isDragging = false;
        this.dragStarted = false;
        
        // Start aiming immediately on touch
        this.updateAimLine(pointer);
    }

    onPointerMove(pointer) {
        if (!this.canShoot || this.state !== GameState.PLAY) return;

        const timeSinceStart = pointer.time - this.touchStartTime;
        
        // If we've moved far enough and held long enough, it's a drag
        if (timeSinceStart > this.touchThreshold) {
            this.isDragging = true;
            this.dragStarted = true;
            this.updateAimLine(pointer);
        }
    }

    onPointerUp(pointer) {
        if (!this.canShoot || this.state !== GameState.PLAY) return;

        const timeSinceStart = pointer.time - this.touchStartTime;

        // If it was a quick tap or we weren't dragging, shoot immediately
        if (!this.dragStarted || timeSinceStart <= this.touchThreshold) {
            this.shootBubble(pointer);
        } else if (this.isDragging) {
            // If we were dragging, shoot in the aimed direction
            this.shootBubble(pointer);
        }

        // Reset touch state
        this.isDragging = false;
        this.dragStarted = false;
    }

    updateAimLine(pointer) {
        if (!this.canShoot || this.state !== GameState.PLAY) return;

        let angle = Phaser.Math.Angle.Between(this.shooter.x, this.shooter.y, pointer.x, pointer.y);
        
        // Apply angle constraints
        if (angle > -this.maxTreshold && angle < Math.PI/2) angle = -this.maxTreshold;
        if (angle < (-Math.PI + this.maxTreshold) || angle > Math.PI/2) angle = (-Math.PI + this.maxTreshold);
        
        this.shooter.setRotation(angle + Math.PI / 2);
        
        // Update aim line visualization
        let distance = 125;
        let ballDistance = 31;
        let endX = this.shooter.x + Math.cos(angle) * distance;
        let endY = this.shooter.y + Math.sin(angle) * distance;
        
        this.aimLine.setRotation(angle + Math.PI / 2);
        this.aimLine.setPosition(endX, endY);

        // Update preview bubble position
        this.nextBubblePreview.setVisible(true);
        this.nextBubblePreview.setRotation(angle + Math.PI / 2);
        this.nextBubblePreview.setPosition(
            this.shooter.x + Math.cos(angle) * ballDistance,
            this.shooter.y + Math.sin(angle) * ballDistance
        );
    }

    makeInput(){
        this.input.on('gameobjectdown', (pointer, gameObject) => {
            if (gameObject.isButton){
                playSound('click', this);
                this.tweens.add({
                    targets: gameObject,
                    scaleX: 0.8,
                    scaleY: 0.8,
                    duration: 100,
                    yoyo: true,
                    onComplete: () => {
                        if (GameState.PLAY === this.state || GameState.PAUSE === this.state){
                            switch (gameObject.name) {
                                case 'resuffle':
                                    if (this.canShoot){
                                        this.swapBubbleColors();
                                    }
                                    //this.dropBubblesAndAddNewLine();
                                    break;
                                case 'pause':
                                    this.paused();
                                    break;
                                case 'play':
                                    this.popup.setVisible(false);
                                    this.anims.resumeAll();
                                    this.physics.resume();
                                    this.state = GameState.PLAY;
                                    break;
                                case 'sound':
                                    toggleSound(gameObject);
                                    break;
                                case 'restart':
                                    this.state = GameState.PLAY;
                                    this.anims.resumeAll();
                                    this.physics.resume();
                                    this.scene.restart();
                                    break;
                                case 'exit':
                                    score = this.score
                                    this.scene.start('home');
                                    this.anims.resumeAll();
                                    this.physics.resume();
                                    break;
                                default:
                                    break;
                            }
                        }
                        if (GameState.GAME_OVER === this.state){
                            switch (gameObject.name) {
                                case 'restart':
                                    this.state = GameState.PLAY;
                                    this.scene.restart();
                                    break;
                                case 'exit':
                                    score = this.score
                                    this.scene.start('home');
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                });
            }
        });
    }

    createBubbleGrid() {
        // Determine a random number of initial rows (between 3 and 5)
        const initialRows = Phaser.Math.Between(3, 5);

        for (let y = 0; y < initialRows; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                // Add some randomness to bubble placement
                if (Phaser.Math.FloatBetween(0, 1) > 0.1) { // 90% chance to place a bubble
                    let xPos = x * this.bubbleSize  + this.bubbleSize / 2;
                    let yPos = (y * (this.bubbleSize - this.bubbleThreshold) + this.bubbleSize / 2)  +this.bubbleOffsetTop; 
                    if (y % 2 === 1) xPos += this.bubbleSize / 2;

                    // Random color
                    let bubbleColor = Phaser.Math.Between(0, this.colors - 1);
                    
                    let bubble = this.bubbleGroup.create(xPos, yPos, 'bubble', bubbleColor);
                    bubble.setCircle(this.bubbleSize / 2);
                    bubble.setData('gridX', x);
                    bubble.setData('gridY', y);
                    
                    // Update the grid array
                    this.grid[y][x] = bubble;
                }
            }
        }
    }

    updateAimLine(pointer) {
        if (!this.canShoot || this.state !== GameState.PLAY) return;

        let angle = Phaser.Math.Angle.Between(this.shooter.x, this.shooter.y, pointer.x, pointer.y);
        if (angle > -this.maxTreshold  && angle < Math.PI/2) angle =  -this.maxTreshold;
        if (angle < (-Math.PI + this.maxTreshold)  || angle > Math.PI/2) angle =  (-Math.PI + this.maxTreshold);
        
        this.shooter.setRotation( angle + Math.PI / 2);
        let distance = 125;  // Adjust this value to change the length of the aim line
        let ballDistance = 31;
        let endX = this.shooter.x + Math.cos(angle) * distance;
        let endY = this.shooter.y + Math.sin(angle) * distance;
        
        //this.aimLine.setTo(this.shooter.x, this.shooter.y, endX, endY);
        this.aimLine.setRotation(angle + Math.PI / 2);
        this.aimLine.setPosition(endX, endY);

        // Update the position of the next bubble preview
        this.nextBubblePreview.setVisible(true);
       
        this.nextBubblePreview.setRotation(angle + Math.PI / 2);
        this.nextBubblePreview.setPosition(
            this.shooter.x + Math.cos(angle) * ballDistance,
            this.shooter.y + Math.sin(angle) * ballDistance
        );
    }

    updateBubblePreviews() {
        this.nextBubblePreview.setFrame(this.nextBubbleColor);
        this.nextNextBubblePreview.setFrame(this.nextNextBubbleColor);
    }

    shootBubble(pointer) {
        if (!this.canShoot || this.isAnimating || this.state !== GameState.PLAY) return;
        this.aimLine.setVisible(false);
        let angle = Phaser.Math.Angle.Between(this.shooter.x, this.shooter.y, pointer.x, pointer.y);
        
        if (angle > -this.maxTreshold && angle < Math.PI/2) return;
        if (angle < (-Math.PI + this.maxTreshold) || angle > Math.PI/2) return;
        
        this.shootableBubble.setFrame(this.nextBubbleColor);
        this.shootableBubble.enableBody(true, this.shooter.x, this.shooter.y, true, true);
        this.shootableBubble.setCollideWorldBounds(true);
        this.shootableBubble.setBounce(1, 0);
        
        this.physics.velocityFromRotation(angle, this.shootSpeed, this.shootableBubble.body.velocity);
        
        this.canShoot = false;
        this.nextBubblePreview.setVisible(false);
        this.currentAngle = angle;
        this.hasBounced = false;

        playSound('shot', this);
    }

    handleWorldBoundsCollision(body, up, down, left, right) {
        if (body.gameObject === this.shootableBubble) {
            if (up) {
                // Ball has hit the top of the screen
                this.repositionShootableBubble();
            } else if (left || right) {
                // Ball has hit the left or right side of the screen
                this.hasBounced = true;
                this.currentAngle = Math.atan2(body.velocity.y, body.velocity.x);
               // console.log(`Bubble bounced, new angle: ${Phaser.Math.RadToDeg(this.currentAngle).toFixed(2)}°`);
            }
        }
    }

    repositionShootableBubble() {
        // Disable the shootable bubble's body
        this.shootableBubble.disableBody(true, true);

        // Reset the shootable bubble to the shooter's position
        // this.shootableBubble.enableBody(true, this.shooter.x, this.shooter.y, true, true);
        // Allow the next shot and show the preview
        this.canShoot = true;
        this.nextBubblePreview.setVisible(true);

        // Reset bounce tracking
        this.hasBounced = false;

        this.aimLine.setVisible(true);

        console.log('Shootable bubble repositioned due to hitting top boundary');
    }

    onBubbleBounce(body, up, down, left, right) {
        if (body.gameObject === this.shootableBubble) {
            this.hasBounced = true;
            this.currentAngle = Math.atan2(body.velocity.y, body.velocity.x);
         //   console.log(`Bubble bounced, new angle: ${Phaser.Math.RadToDeg(this.currentAngle).toFixed(2)}°`);
        }
    }

    handleCollision(shootableBubble, gridBubble) {
        playSound('bubble-hit', this);
        // Stop the bubble's movement
        shootableBubble.body.stop();

        // Get the collision point
        const collisionPoint = {
            x: shootableBubble.x,
            y: shootableBubble.y
        };

        // Snap the bubble to the grid
        let position = this.snapBubbleToGrid(shootableBubble, gridBubble);

        if (position) {
            // Check for game over condition
            if (this.isGameOverCondition(position, collisionPoint)) {
                this.gameOver();
                return;
            }

            const newBubble = this.grid[position.y][position.x];
            
            // Set the animating flag
            this.isAnimating = true;
            this.canShoot = false;

            // Animate the collision effect using the current angle
            this.animateCollision(collisionPoint, this.currentAngle).then(() => {
                // Update the physics body position of the new bubble
                this.updateBubblePhysicsBody(newBubble);
                
                // Check for matches after the animation completes
                this.checkForMatches(position.x, position.y);
                // Check for floating bubbles
                this.checkFloatingBubbles();

                // Set a timeout to ensure all animations are complete
                this.time.delayedCall(this.animationDelay, () => {
                    this.isAnimating = false;
                    
                    // Increment the shot counter
                    this.currentShots++;

                    // Check if it's time to drop bubbles
                    if (this.currentShots >= this.shotsUntilDrop) {
                       // console.log('Adding new bubble color: ', + this.colors + 1);
                        this.colors = Math.min(this.colors + 1, this.maxColor);
                        this.dropBubblesAndAddNewLine();
                        this.currentShots = 0; // Reset the counter
                    } else {
                        // If not dropping bubbles, allow shooting
                        this.canShoot = true;
                        this.setNextBubbleAttributes();
                        this.aimLine.setVisible(true);
                    }
                });
            });
        }
        else{
            this.canShoot = true;
            this.aimLine.setVisible(true);
        }

        // Reset shootable bubble
        this.shootableBubble.disableBody(true, true);

        // Reset bounce tracking
        this.hasBounced = false;
    }

    setNextBubbleAttributes() {
        this.nextBubblePreview.setVisible(true);
        this.nextBubbleColor = this.nextNextBubbleColor;
        this.nextNextBubbleColor = Phaser.Math.Between(0, this.colors - 1);
        this.updateBubblePreviews();
    }

    isGameOverCondition(position, collisionPoint) {
        // Check if the collision happened at the bottom row
        if (position.y === this.gridHeight - 1) {
            // Calculate the vertical center of the bottom row
            const bottomRowCenterY = (this.gridHeight - 0.5) * (this.bubbleSize - this.bubbleThreshold) - this.bubbleOffsetTop;
            
            // If the collision point is below the center of the bottom row, it's game over
            if (collisionPoint.y > bottomRowCenterY) {
            //    console.log("Game Over: Bubble stuck at the bottom!");
                return true;
            }
        }
        return false;
    }

    animateCollision(collisionPoint, collisionAngle) {
        return new Promise((resolve) => {
            // Find affected bubbles (bubbles above the collision point)
            const affectedBubbles = this.findAffectedBubbles(collisionPoint);

            let completedAnimations = 0;
            const totalAnimations = affectedBubbles.length;

            // Animate push effect
            affectedBubbles.forEach((bubble, index) => {
                const distance = Phaser.Math.Distance.Between(
                    bubble.x, bubble.y,
                    collisionPoint.x, collisionPoint.y
                );
                const pushScale = 1 - (distance / (this.bubbleSize * 3)); // Adjust push intensity based on distance
                const pushX = Math.cos(collisionAngle) * this.pushDistance * pushScale;
                const pushY = Math.sin(collisionAngle) * this.pushDistance * pushScale;

                const gridX = bubble.getData('gridX');
                const gridY = bubble.getData('gridY');
                const originalX = gridX * this.bubbleSize + this.bubbleSize / 2 + (gridY % 2 === 1 ? this.bubbleSize / 2 : 0);
                const originalY = (gridY * (this.bubbleSize - this.bubbleThreshold) + this.bubbleSize / 2) +this.bubbleOffsetTop;

                const pushTween = this.tweens.add({
                    targets: bubble,
                    x: bubble.x + pushX,
                    y: bubble.y + pushY,
                    duration: this.pushDuration,
                    ease: 'Quad.easeOut',
                    yoyo: true,
                    onComplete: () => {
                        // Ensure the bubble returns to its exact grid position
                        const returnTween = this.tweens.add({
                            targets: bubble,
                            x: originalX,
                            y: originalY,
                            duration: this.returnDuration,
                            ease: 'Bounce.easeOut',
                            onComplete: () => {
                                this.updateBubblePhysicsBody(bubble);
                                completedAnimations++;
                                if (completedAnimations === totalAnimations) {
                                //    console.log('Animation completed for all affected bubbles');
                                    resolve();
                                }
                            }
                        });
                    }
                });
            });

            // If no bubbles were affected, resolve immediately
            if (totalAnimations === 0) {
                //console.log('No bubbles affected by the collision');
                resolve();
            }
        });
    }

    findAffectedBubbles(collisionPoint) {
        const affectedBubbles = [];
        const affectRadius = this.bubbleSize * 3; // Adjust this value to change the affect area

        this.bubbleGroup.getChildren().forEach(bubble => {
            if (Phaser.Math.Distance.Between(
                bubble.x, bubble.y,
                collisionPoint.x, collisionPoint.y
            ) <= affectRadius) {
                affectedBubbles.push(bubble);
            }
        });

        return affectedBubbles;
    }

    snapBubbleToGrid(shootableBubble, gridBubble) {
        // Find the closest grid position
        let closestGridX = Math.round((shootableBubble.x - this.bubbleSize / 2) / this.bubbleSize);
        let closestGridY = Math.round((shootableBubble.y  - this.bubbleOffsetTop - (this.bubbleSize- this.bubbleThreshold) /2) / (this.bubbleSize  ));
        //let debugCircle;
        
        // check if occupty and Adjust for the top row
        if (closestGridY % 2 === 1) closestGridX =  Math.round((shootableBubble.x - this.bubbleSize / 2 - this.bubbleSize / 2) / this.bubbleSize);
        if (this.grid[closestGridY][closestGridX] !== null){
            closestGridY = Math.round((shootableBubble.y - this.bubbleThreshold  - this.bubbleOffsetTop - this.bubbleSize/2) / (this.bubbleSize - this.bubbleThreshold));
           // debugCircle =this.add.circle(closestGridX * this.bubbleSize + this.bubbleSize / 2, closestGridY * (this.bubbleSize - this.bubbleThreshold) + this.bubbleSize / 2 + this.bubbleOffsetTop, this.bubbleSize/2, 0xff00ff, 0.5).setDepth(2);
        }
        else {
            //debugCircle = this.add.circle(closestGridX * this.bubbleSize + this.bubbleSize / 2, closestGridY * (this.bubbleSize - this.bubbleThreshold) + this.bubbleSize / 2 + this.bubbleOffsetTop, this.bubbleSize/2, 0xff0000, 0.5);
        }
        closestGridY = Math.max(0, closestGridY);

        // Create a debug circle at the collision point
        // this.debugcircle.push(debugCircle);
        

        // Check surrounding positions
        const directions = [
            {dx: 0, dy: 0},   // current position
            {dx: -1, dy: 0},  // left
            {dx: 1, dy: 0},   // right
            {dx: 0, dy: -1},  // up
            {dx: -1, dy: -1}, // up-left
            {dx: 1, dy: -1},  // up-right
        ];

        let shortestDistance = Infinity;
        let bestPosition = null;

        for (let dir of directions) {
            let newX = closestGridX + dir.dx;
            let newY = closestGridY + dir.dy;

            const checkNeighbors = this.checkBubbleNotFloating(newX, newY);
            if (!checkNeighbors) continue;

            // Adjust x-coordinate for odd rows
            if (newY % 2 !== 0) {
                newX += 0.5;
            }

            // Check if the position is within bounds
            if (newX >= 0 && newX <= this.gridWidth && newY >= 0 && newY < this.gridHeight) {
                let xPos = newX * this.bubbleSize + this.bubbleSize / 2;
                let yPos = (newY * (this.bubbleSize - this.bubbleThreshold) + this.bubbleSize / 2) +this.bubbleOffsetTop;
                let distance = Phaser.Math.Distance.Between(
                    shootableBubble.x, 
                    shootableBubble.y, 
                    xPos, 
                    yPos
                );       

                // Check if the position is empty or it's the position of the collided bubble
                if (distance < shortestDistance && 
                    (!this.grid[newY][Math.floor(newX)] || this.grid[newY][Math.floor(newX)] !== null || 
                    (this.grid[newY][Math.floor(newX)] === gridBubble))) {
                    
                    shortestDistance = distance;
                    bestPosition = {x: newX, y: newY};
                    
                    // Create a debug circle at the best position
                    // let debugDot = this.add.circle(xPos, yPos, 5, 0x0000ff, 1).setDepth(2);
                    //this.debugcircle.push(debugDot);
                }
            }
        }

        if (bestPosition) {
            // Calculate the exact position
            let xPos = bestPosition.x * this.bubbleSize + this.bubbleSize / 2;
            let yPos = (bestPosition.y * (this.bubbleSize - this.bubbleThreshold) + this.bubbleSize / 2) +this.bubbleOffsetTop;
            
            if (bestPosition.y % 2 === 1) xPos += this.bubbleSize / 2;

            // Create a new static bubble at the calculated position
            let newBubble = this.bubbleGroup.create(xPos, yPos, 'bubble', shootableBubble.frame.name);
            newBubble.setCircle(this.bubbleSize / 2);
            newBubble.setData('gridX', Math.floor(bestPosition.x));
            newBubble.setData('gridY', bestPosition.y);

            // Update the grid array
            this.grid[bestPosition.y][Math.floor(bestPosition.x)] = newBubble;

            // Immediately update the physics body
            this.updateBubblePhysicsBody(newBubble);
            return {x: Math.floor(bestPosition.x), y: bestPosition.y};
        } else {
           // console.log("No valid position found to snap the bubble!");
            // Handle the case where no valid position is found (e.g., game over condition)
            return null;
        }
    }

    updateBubblePhysicsBody(bubble) {
        const gridX = bubble.getData('gridX');
        const gridY = bubble.getData('gridY');
        const xPos = gridX * this.bubbleSize + this.bubbleSize / 2 + (gridY % 2 === 1 ? this.bubbleSize / 2 : 0);
        const yPos = (gridY * (this.bubbleSize - this.bubbleThreshold) + this.bubbleSize / 2) +this.bubbleOffsetTop;
        bubble.setPosition(xPos, yPos);
        bubble.body.reset(xPos, yPos);
    }

    checkForMatches(x, y) {
        let color = this.grid[y][x].frame.name;
        let visited = new Set();
        let toCheck = [{x, y}];
        let matches = [];

        while (toCheck.length > 0) {
            let current = toCheck.pop();
            let key = `${current.x},${current.y}`;

            if (visited.has(key)) continue;
            visited.add(key);

            if (this.grid[current.y][current.x] && this.grid[current.y][current.x].frame.name === color) {
                matches.push(current);
                this.getNeighbors(current.x, current.y).forEach(neighbor => toCheck.push(neighbor));
            }
        }

        if (matches.length >= this.minMatchSize) {
            this.addScore(matches.length*this.soreMultipler);
            this.applyPushEffect(matches).then(() => {
                this.removeBubbles(matches).then(() => { 
                  //  console.log('Bubbles removed, checking for floating bubbles');
                    this.checkFloatingBubbles();
                });
            });
        }
    }

    applyPushEffect(matches) {
        return new Promise((resolve) => {
            let affectedBubbles = new Set();
            matches.forEach(match => {
                this.getNeighbors(match.x, match.y).forEach(neighbor => {
                    if (this.grid[neighbor.y][neighbor.x]) {
                        affectedBubbles.add(this.grid[neighbor.y][neighbor.x]);
                    }
                });
            });

            let tweens = [];
            affectedBubbles.forEach(bubble => {
                let originX = bubble.x;
                let originY = bubble.y;
                let angle = Phaser.Math.Angle.Between(
                    matches[0].x * this.bubbleSize, 
                    matches[0].y * this.bubbleSize, 
                    bubble.x, 
                    bubble.y
                );

                let pushTween = this.tweens.add({
                    targets: bubble,
                    x: bubble.x + Math.cos(angle) * this.pushDistance/4,
                    y: bubble.y + Math.sin(angle) * this.pushDistance/4,
                    duration: this.pushDuration,
                    ease: 'Quad.easeOut',
                    onComplete: () => {
                        this.tweens.add({
                            targets: bubble,
                            x: originX,
                            y: originY,
                            duration: this.returnDuration,
                            ease: 'Back.easeOut'
                        });
                    }
                });
                tweens.push(pushTween);
            });

            this.tweens.add({
                targets: {},
                duration: this.pushDuration + this.returnDuration,
                onComplete: resolve
            });
        });
    }

    getNeighbors(x, y) {
        let neighbors = [];
        let directions = y % 2 === 0 ? 
            [{dx: -1, dy: 0}, {dx: 1, dy: 0}, {dx: 0, dy: -1}, {dx: -1, dy: -1}, {dx: 0, dy: 1}, {dx: -1, dy: 1}] :
            [{dx: -1, dy: 0}, {dx: 1, dy: 0}, {dx: 1, dy: -1}, {dx: 0, dy: -1}, {dx: 1, dy: 1}, {dx: 0, dy: 1}];

        directions.forEach(dir => {
            let newX = x + dir.dx;
            let newY = y + dir.dy;
            if (newX >= 0 && newX <= this.gridWidth && newY >= 0 && newY < this.gridHeight) {
                neighbors.push({x: newX, y: newY});
            }
        });

        return neighbors;
    }

    checkBubbleNotFloating(x,y) {
        const neighbors = this.getNeighbors(x, y);
        let hasBubble = false;
        for (const tile of neighbors) {
            const bubble = this.grid[tile.y][tile.x];
            if (bubble) {
            hasBubble = true;
            break;
            }
        }
        return hasBubble;
    }

    removeBubbles(bubbles) {
        playSound('bubble-match', this);
        return new Promise((resolve) => {
            let totalBubbles = bubbles.length;
            bubbles.forEach(bubble => {
                this.grid[bubble.y][bubble.x].play(`break-${this.grid[bubble.y][bubble.x].frame.name}`);
                    this.grid[bubble.y][bubble.x].once('animationcomplete', () => {
                        this.grid[bubble.y][bubble.x].destroy();
                        this.grid[bubble.y][bubble.x] = null;
                        totalBubbles--;
                        if (totalBubbles === 0) resolve();
                        
                });
            });
        });
    }

    checkFloatingBubbles() {
        let visited = new Set();
        let connected = new Set();

        // First, find all bubbles connected to the top row
        for (let x = 0; x <= this.gridWidth; x++) {
            if (this.grid[0][x]) {
                this.floodFill(x, 0, visited, connected);
            }
        }

        // Collect all bubbles that are not connected to the top
        let fallingBubbles = [];
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x <= this.gridWidth; x++) {
                if (this.grid[y][x] && !connected.has(`${x},${y}`)) {
                    fallingBubbles.push({
                        x: this.grid[y][x].x,
                        y: this.grid[y][x].y,
                        frame: this.grid[y][x].frame.name
                    });
                    this.grid[y][x].destroy(); // Remove the static bubble
                    this.grid[y][x] = null;
                }
            }
        }

        // Animate the falling bubbles
        this.animateFallingBubbles(fallingBubbles);
        this.addScore(fallingBubbles.length*this.soreMultipler);
    }

    animateFallingBubbles(bubbleData) {
        bubbleData.forEach(data => {
            // Create a new sprite for the falling bubble
            let fallingBubble = this.physics.add.sprite(data.x, data.y, 'bubble', data.frame);
            
            // Set the bubble's physics properties
            fallingBubble.setCircle(this.bubbleSize / 2);
            fallingBubble.setBounce(0.5);
            fallingBubble.setCollideWorldBounds(false);
            
            // Set gravity for the bubble
            fallingBubble.body.setGravityY(400);
            
            // Add some random horizontal velocity for a more natural fall
            fallingBubble.setVelocityX(Phaser.Math.Between(-100, 100));
            
            // Add rotation for visual effect
            this.tweens.add({
                targets: fallingBubble,
                angle: Phaser.Math.Between(-360, 360),
                duration: 1000,
                ease: 'Linear'
            });

            // Destroy the bubble when it goes off-screen
            this.time.delayedCall(2000, () => {
                fallingBubble.destroy();
            });
        });
        if(bubbleData.length){
            playSound('bubble-falling', this);
        }
    }

    floodFill(x, y, visited, connected) {
        let key = `${x},${y}`;
        if (visited.has(key)) return;
        visited.add(key);
        if (!this.grid[y][x]) return;
        connected.add(key);

        this.getNeighbors(x, y).forEach(neighbor => {
            this.floodFill(neighbor.x, neighbor.y, visited, connected);
        });
    }

    dropBubblesAndAddNewLine() {
        if (this.isAnimating) {
           // console.log("Animations in progress, delaying bubble drop");
            return;
        }

        playSound('bubbles-down', this);

        this.isAnimating = true;
        this.canShoot = false;

        // Step 1: Move all existing bubbles down by one row
        for (let y = this.gridHeight - 1; y > 0; y--) {
            for (let x = 0; x < this.gridWidth; x++) {
                if (this.grid[y - 1][x]) {
                    // Move the bubble down
                    this.grid[y][x] = this.grid[y - 1][x];
                    this.grid[y][x].setData('gridY', y);
                    
                    // Update the bubble's position
                    let xPos = x * this.bubbleSize + this.bubbleSize / 2;
                    let yPos = (y * (this.bubbleSize - this.bubbleThreshold) + this.bubbleSize / 2) +this.bubbleOffsetTop;
                    if (y % 2 === 1) xPos += this.bubbleSize / 2;
                    
                    this.tweens.add({
                        targets: this.grid[y][x],
                        x: xPos,
                        y: yPos,
                        duration: 500,
                        ease: 'Cubic.easeInOut'
                    });
                } else {
                    this.grid[y][x] = null;
                }
            }
        }

        // Step 2: Add a new line of bubbles at the top
        for (let x = 0; x < this.gridWidth; x++) {
            if (Phaser.Math.FloatBetween(0, 1) > 0.3) { // 70% chance to place a bubble
                let xPos = x * this.bubbleSize + this.bubbleSize / 2;
                let yPos = (-this.bubbleThreshold+this.bubbleSize / 2) +this.bubbleOffsetTop;
                let bubbleColor = Phaser.Math.Between(0, this.colors - 1);
                
                let newBubble = this.bubbleGroup.create(xPos, -this.bubbleSize, 'bubble', bubbleColor);
                newBubble.setCircle(this.bubbleSize / 2);
                newBubble.setData('gridX', x);
                newBubble.setData('gridY', 0);

                this.grid[0][x] = newBubble;

                // Animate the new bubble dropping into place
                this.tweens.add({
                    targets: newBubble,
                    y: yPos,
                    duration: 500,
                    ease: 'Bounce.easeOut'
                });
            } else {
                this.grid[0][x] = null;
            }
        }

        // Set a timeout to ensure all drop animations are complete
        this.time.delayedCall(600, () => {
            // Update physics bodies for all bubbles
            this.updateAllBubblePhysicsBodies();

            this.isAnimating = false;
            this.canShoot = true;
            this.aimLine.setVisible(true);
            this.setNextBubbleAttributes();
            this.checkFloatingBubbles();
            this.checkGameOver();
        });
    }

    updateAllBubblePhysicsBodies() {
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                if (this.grid[y][x]) {
                    this.updateBubblePhysicsBody(this.grid[y][x]);
                }
            }
        }
    }

    updateBubblePhysicsBody(bubble) {
        const gridX = bubble.getData('gridX');
        const gridY = bubble.getData('gridY');
        const xPos = gridX * this.bubbleSize + this.bubbleSize / 2 + (gridY % 2 === 1 ? this.bubbleSize / 2 : 0);
        const yPos = (gridY * (this.bubbleSize - this.bubbleThreshold) + this.bubbleSize / 2) +this.bubbleOffsetTop;

        bubble.setPosition(xPos, yPos);
        bubble.body.reset(xPos, yPos);
    }

    swapBubbleColors() {
        this.state = GameState.SWAPPING;
        // Swap the colors of the next two bubbles
        let temp = this.nextBubbleColor;
        const tempBubble = {
            x: this.nextBubblePreview.x,
            y: this.nextBubblePreview.y,
          
        };
        const tempNextBubble = {
            x: this.nextNextBubblePreview.x, 
            y: this.nextNextBubblePreview.y,
        };
        
        
        // Swap animation
        this.tweens.add({
            targets: this.nextBubblePreview,
            x: tempNextBubble.x,
            y: tempNextBubble.y, 
            duration: 200,
            ease: 'Quad.easeInOut'
        });
    
        this.tweens.add({
            targets: this.nextNextBubblePreview,
            x: tempBubble.x,
            y: tempBubble.y,
            duration: 200,
            ease: 'Quad.easeInOut'
        });
        
        this.time.delayedCall(220, () => {
            this.state = GameState.PLAY;
            this.nextBubbleColor = this.nextNextBubbleColor;
            this.nextNextBubbleColor = temp;
            this.nextBubblePreview.setPosition(tempBubble.x, tempBubble.y);
            this.nextNextBubblePreview.setPosition(tempNextBubble.x, tempNextBubble.y);
            this.updateBubblePreviews();
        });
        playSound('switch-bubble', this);
    }
    

    checkGameOver() {
        // Check if any bubbles have reached the bottom row
        for (let x = 0; x < this.gridWidth; x++) {
            if (this.grid[this.gridHeight - 1][x]) {
             //   console.log("Game Over: Bubbles have reached the bottom!");
                this.gameOver();
                return;
            }
        }
    }
    
    gameOver(){
        if(this.state == GameState.GAME_OVER) return;

        playSound('gameover', this);
        this.state = GameState.GAME_OVER;
        this.popup.clear(true, true);
        let dark = this.add.rectangle(0,0,config.width,config.height,0x000000).setOrigin(0);
        dark.setInteractive();
        dark.alpha = 0;
        this.tweens.add({
            targets: dark,
            alpha: 0.5,
            duration: 200,
        });
        let bgPopup = this.add.sprite(this.game.config.width/2, this.game.config.height/2, 'panel-gameOver');
        let txtTitle = this.add.text(bgPopup.x+10, bgPopup.y-200, `GameOver `, {fontFamily: 'alphakind', fontSize: 38, align: 'right',color: '#FFFFFF'}).setOrigin(0.5);
        let txtScore = this.add.text(bgPopup.x-90, bgPopup.y-90, `Score: `, {fontFamily: 'alphakind', fontSize: 32, align: 'right',color: '#FFFFFF'}).setOrigin(0.5);
        let txtValueScore = this.add.text(bgPopup.x+90, bgPopup.y-90, this.score, {fontFamily: 'alphakind', fontSize: 32, align: 'right',color: '#FFFFFF'}).setOrigin(0.5);
        let txtHighscore = this.add.text(bgPopup.x-60, bgPopup.y, `BestScore: `, {fontFamily: 'alphakind', fontSize: 32, align: 'right',color: '#FFFFFF'}).setOrigin(0.5);
        let txtValueHighscore = this.add.text(bgPopup.x+90, bgPopup.y, bestscore, {fontFamily: 'alphakind', fontSize: 32, align: 'right',color: '#FFFFFF'}).setOrigin(0.5);
        let bRestart = createButton(bgPopup.x-100, bgPopup.y+120, 'restart', this);
        let btnExit = createButton(bgPopup.x+100, bgPopup.y+120, 'exit', this);
        
        this.popup.addMultiple([dark, bgPopup, txtScore, txtTitle, txtValueScore, txtValueHighscore, txtHighscore, bRestart, btnExit]).setDepth(4);
    }

    addScore(amount){
        this.score += amount;
        if(this.score > bestscore){
            bestscore = this.score;
            saveData('bestScore',bestscore);
        }
        this.updateTextScore();
    }
    updateTextScore(){
        this.highScoreText.setText(bestscore);
        this.scoreText.setText(this.score);
    }

    panelPause(){ 
        let dark = this.add.rectangle(0,0,config.width,config.height,0x000000).setOrigin(0);
        dark.setInteractive();
        dark.alpha = 0;
        let bgPopup = this.add.sprite(this.game.config.width/2, this.game.config.height/2, 'panel-pause').setDepth(4);
        let txtPause = this.add.text(bgPopup.x, bgPopup.y-170, 'PAUSE', {fontFamily: 'alphakind', fontSize: 48, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
        let btnPlay = createButton(bgPopup.x, bgPopup.y-50, 'play', this);
        let btnSound = createButton(bgPopup.x-150, bgPopup.y+100, 'sound-on', this);
        setSoundButton(btnSound);
        let btnRestart = createButton(bgPopup.x, bgPopup.y+100, 'restart', this);
        let btnExit = createButton(bgPopup.x+150, bgPopup.y+100, 'exit', this);
        
        this.popup.addMultiple([dark, bgPopup, txtPause, btnPlay, btnSound, btnRestart, btnExit]).setDepth(4).setVisible(false);
    
    }

    paused(){
        this.state = GameState.PAUSE;   
         this.anims.pauseAll();
         this.physics.pause();
 
        this.popup.setVisible(true);
        let popup = this.popup.getChildren()[0];
        popup.alpha = 0;
        this.tweens.add({
            targets: popup,
            alpha: 0.5,
            duration: 200,
        });
    }
}

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 720,
    height: 1080,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game-content',
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [Boot, Load, Home, Game]
};

const game = new Phaser.Game(config);