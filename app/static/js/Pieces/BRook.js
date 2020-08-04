class BRook extends Piece {
    constructor(x, y, flip) {
        super(x, y, flip);
        this.link = 'https://user-images.githubusercontent.com/43048491/87862792-f0d7ce00-c921-11ea-954d-96232b73ec09.png';
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