class BBishop extends Piece {
    constructor(x, y, flip) {
        super(x, y, flip);
        this.link = 'https://user-images.githubusercontent.com/43048491/87862983-267db680-c924-11ea-89d1-dbe5d19cc4d1.png';
        this.node = setPiece(this.svgX(), this.svgY(), this.link, this);
        this.diagonalMoves();
    }

    isWhite = () => {
        return false;
    }

    toString = () => {
        return 'b';
    }
}