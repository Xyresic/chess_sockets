class BQueen extends Piece {
    constructor(x, y, flip) {
        super(x, y, flip);
        this.link = 'https://user-images.githubusercontent.com/43048491/87862656-680c6280-c920-11ea-9433-f160d93d9fcf.png';
        this.node = setPiece(this.svgX(), this.svgY(), this.link, this);
        this.parallelMoves();
        this.diagonalMoves();
    }

    isWhite = () => {
        return false;
    }

    toString = () => {
        return 'q';
    }
}