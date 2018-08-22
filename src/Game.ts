import Keys from './Keys';
export default class Game {
    private gameCanvas: HTMLCanvasElement;
    private gameContext: CanvasRenderingContext2D;
    public static keysPressed: boolean[] = [];
    public static player1Score: number = 0;
    public static player2Score: number = 0;
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
        this.gameContext.fillText(Game.player1Score.toString(), 280, 50);
        this.gameContext.fillText(Game.player2Score.toString(), 390, 50);
    }

    update() {


        if (Game.keysPressed[Keys.UP]) {
            Game.player2Score += 1;
        } else if (Game.keysPressed[Keys.DOWN]) {
            Game.player2Score -= 1;
        }

        if (Game.keysPressed[Keys.KEY_W]) {
            Game.player1Score += 1;
        } else if (Game.keysPressed[Keys.KEY_S]) {
            Game.player1Score -= 1;
        }
    }

    draw() {
        this.gameContext.fillStyle = "#000";
        this.gameContext.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);

        this.drawBoard();    
    }

    run() {
        this.update();
        this.draw();
        requestAnimationFrame(this.run.bind(this));
    }
}