class WKing extends Piece {
    constructor(x, y, flip) {
        super(x, y, flip);
        this.link = 'https://user-images.githubusercontent.com/43048491/87862562-802fb200-c91f-11ea-87a1-025bcc2d948f.png';
        this.node = setPiece(this.x * 100, this.y * 100, this.link, this);
        this.parallelMoves(true);
        this.diagonalMoves(true);
    }
}