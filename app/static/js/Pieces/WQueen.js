class WQueen extends Piece {
    constructor(x, y, flip) {
        super(x, y, flip);
        this.link = 'https://user-images.githubusercontent.com/43048491/87862639-3d220e80-c920-11ea-8e71-08437bc1811e.png';
        this.node = setPiece(this.x * 100, this.y * 100, this.link, this);
        this.parallelMoves();
        this.diagonalMoves();
    }

    toString = () => {
        return 'Q';
    }
}