class BPawn extends Piece {
    constructor(x, y, flip) {
        super(x, y, flip);
        this.link = 'https://user-images.githubusercontent.com/43048491/89712862-9ac6db00-d961-11ea-9376-65d837ef867a.png';
        this.node = setPiece(this.svgX(), this.svgY(), this.link, this);
        this.pawnMoves();
        this.doubleMove = this.y === 6 && flip || this.y === 1 && !flip;
    }

    isWhite = () => {
        return false;
    }

    toString = () => {
        return 'p';
    }
}