class WBishop extends Piece {
    constructor(x, y, flip) {
        super(x, y, flip);
        this.link = 'https://user-images.githubusercontent.com/43048491/87862977-09e17e80-c924-11ea-8bb7-2e0043200ff6.png';
        this.node = setPiece(this.x * 100, this.y * 100, this.link, this);
        this.diagonalMoves();
    }

    toString = () => {
        return 'B';
    }
}