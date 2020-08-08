class BRook extends Piece {
    constructor(x, y, flip) {
        super(x, y, flip);
        this.link = 'https://user-images.githubusercontent.com/43048491/89712879-b4682280-d961-11ea-83ea-e2e699f29b19.png';
        this.node = setPiece(this.svgX(), this.svgY(), this.link, this);
        this.parallelMoves();
    }

    isWhite = () => {
        return false;
    }

    toString = () => {
        return 'r';
    }
}