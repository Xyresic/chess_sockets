class BKing extends Piece {
    constructor(x, y, flip) {
        super(x, y, flip);
        this.link = 'https://user-images.githubusercontent.com/43048491/87862650-56c35600-c920-11ea-9d5a-b2d741ecddd8.png';
        this.node = setPiece(this.svgX(), this.svgY(), this.link, this);
        this.parallelMoves(true);
        this.diagonalMoves(true);
    }

    isWhite = () => {
        return false;
    }
}
