enum KeyBindings {
    UP = 38,
    DOWN = 40,
    KEY_W = 87,
    KEY_S = 83,
}

class Game {
    private gameCanvas: HTMLCanvasElement;
    private gameContext: CanvasRenderingContext2D;
    public static keysPressed: boolean[] = [];
    public static playerScore: number = 0;
    public static computerScore: number = 0;
    private player1: Paddle;
    private computerPlayer: Paddle;
    private ball: Ball;

    constructor() {
        this.gameCanvas = <HTMLCanvasElement>document.getElementById("game-canvas");

        const ctx = this.gameCanvas.getContext("2d");

        if (ctx == null) {
            throw new Error('Context is a null, cannot continue');
        }

        this.gameContext = ctx;
        this.gameContext.font = "30px Orbitron";

        window.addEventListener("keydown", (e) =>
            Game.keysPressed[e.which] = true
        );

        window.addEventListener("keyup", (e) =>
            Game.keysPressed[e.which] = false
        );

        var paddleWidth: number = 20, paddleHeight: number = 60, ballSize: number = 10, wallOffset: number = 20;

        this.player1 = new Paddle(paddleWidth, paddleHeight, wallOffset, this.gameCanvas.height / 2 - paddleHeight / 2, KeyBindings.KEY_W, KeyBindings.KEY_S);
        this.computerPlayer = new Paddle(paddleWidth, paddleHeight, this.gameCanvas.width - (wallOffset + paddleWidth), this.gameCanvas.height / 2 - paddleHeight / 2, KeyBindings.UP, KeyBindings.DOWN);
        //this.computerPlayer = new ComputerPaddle(paddleWidth, paddleHeight, this.gameCanvas.width - (wallOffset + paddleWidth), this.gameCanvas.height / 2 - paddleHeight / 2);
        this.ball = new Ball(ballSize, ballSize, this.gameCanvas.width / 2 - ballSize / 2, this.gameCanvas.height / 2 - ballSize / 2);

    }

    drawBoard() {

        //draw court outline
        this.gameContext.strokeStyle = "#fff";
        this.gameContext.lineWidth = 1;
        this.gameContext.strokeRect(10, 10, this.gameCanvas.width - 20, this.gameCanvas.height - 20);

        //draw center lines
        for (var i = 0; i + 30 < this.gameCanvas.height; i += 30) {
            this.gameContext.fillStyle = "#fff";
            this.gameContext.fillRect(this.gameCanvas.width / 2 - 10, i + 10, 5, 20);
        }

        //draw scores
        this.gameContext.fillText(Game.playerScore.toString(), 280, 50);
        this.gameContext.fillText(Game.computerScore.toString(), 390, 50);

    }

    update() {
        this.player1.update(this.gameCanvas);
        this.computerPlayer.update(this.gameCanvas);
        this.ball.update(this.player1, this.computerPlayer, this.gameCanvas);
    }
    draw() {
        this.gameContext.fillStyle = "#000";
        this.gameContext.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);

        this.drawBoard();
        this.player1.draw(this.gameContext);
        this.computerPlayer.draw(this.gameContext);
        this.ball.draw(this.gameContext);
    }
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}

class Entity {
    width: number;
    height: number;
    x: number;
    y: number;
    xVel: number = 0;
    yVel: number = 0;


    constructor(w: number, h: number, x: number, y: number) {
        this.width = w;
        this.height = h;
        this.x = x;
        this.y = y;
    }
    draw(context: CanvasRenderingContext2D) {
        context.fillStyle = "#fff";
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Paddle extends Entity {

    private speed: number = 10;
    upKey: number;
    downKey: number;

    constructor(w: number, h: number, x: number, y: number, upKey: number, downKey: number) {
        super(w, h, x, y);
        this.upKey = upKey;
        this.downKey = downKey;
    }

    update(canvas: HTMLCanvasElement) {
        if (Game.keysPressed[this.upKey]) {
            this.yVel = -1;
            if (this.y <= 20) {
                this.yVel = 0
            }
        } else if (Game.keysPressed[this.downKey]) {
            this.yVel = 1;
            if (this.y + this.height >= canvas.height - 20) {
                this.yVel = 0;
            }
        } else {
            this.yVel = 0;
        }

        this.y += this.yVel * this.speed;

    }
}

class ComputerPaddle extends Entity {

    private speed: number = 10;

    constructor(w: number, h: number, x: number, y: number) {
        super(w, h, x, y);
    }

    update(ball: Ball, canvas: HTMLCanvasElement) {

        //chase ball
        if (ball.y < this.y && ball.xVel == 1) {
            this.yVel = -1;

            if (this.y <= 20) {
                this.yVel = 0;
            }
        }
        else if (ball.y > this.y + this.height && ball.xVel == 1) {
            this.yVel = 1;

            if (this.y + this.height >= canvas.height - 20) {
                this.yVel = 0;
            }
        }
        else {
            this.yVel = 0;
        }
        this.y += this.yVel * this.speed;
    }

}

class Ball extends Entity {

    private speed: number = 5;

    constructor(w: number, h: number, x: number, y: number) {
        super(w, h, x, y);
        var randomDirection = Math.floor(Math.random() * 2) + 1;
        if (randomDirection % 2) {
            this.xVel = 1;
        } else {
            this.xVel = -1;
        }
        this.yVel = 1;
    }

    update(player: Paddle, computer: Paddle, canvas: HTMLCanvasElement) {

        //check top canvas bounds
        if (this.y <= 10) {
            this.yVel = 1;
        }

        //check bottom canvas bounds
        if (this.y + this.height >= canvas.height - 10) {
            this.yVel = -1;
        }

        //check left canvas bounds
        if (this.x <= 0) {
            this.x = canvas.width / 2 - this.width / 2;
            Game.computerScore += 1;
        }

        //check right canvas bounds
        if (this.x + this.width >= canvas.width) {
            this.x = canvas.width / 2 - this.width / 2;
            Game.playerScore += 1;
        }


        //check player collision
        if (this.x <= player.x + player.width) {
            if (this.y >= player.y && this.y + this.height <= player.y + player.height) {
                this.xVel = 1;
            }
        }

        //check computer collision
        if (this.x + this.width >= computer.x) {
            if (this.y >= computer.y && this.y + this.height <= computer.y + computer.height) {
                this.xVel = -1;
            }
        }

        this.x += this.xVel * this.speed;
        this.y += this.yVel * this.speed;
    }
}

const game = new Game();
game.gameLoop();
