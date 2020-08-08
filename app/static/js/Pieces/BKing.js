class BKing extends Piece {
    constructor(x, y, flip) {
        super(x, y, flip);
        this.link = 'https://user-images.githubusercontent.com/43048491/89712870-a7e3ca00-d961-11ea-95ec-dd4b20c10f42.png';
        this.node = setPiece(this.svgX(), this.svgY(), this.link, this);
        this.parallelMoves(true);
        this.diagonalMoves(true);
        this.castling();
    }

    isWhite = () => {
        return false;
    }

    toString = () => {
        return 'k';
    }
}
