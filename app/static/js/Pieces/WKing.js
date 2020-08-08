class WKing extends Piece {
    constructor(x, y, flip) {
        super(x, y, flip);
        this.link = 'https://user-images.githubusercontent.com/43048491/89712851-88e53800-d961-11ea-9bce-4b9e0653c1d9.png';
        this.node = setPiece(this.x * 100, this.y * 100, this.link, this);
        this.parallelMoves(true);
        this.diagonalMoves(true);
        this.castling();
    }

    toString = () => {
        return 'K';
    }
}