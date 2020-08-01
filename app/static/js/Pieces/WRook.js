class WRook extends Piece {
    constructor(x, y, flip) {
        super(x, y, flip);
        this.link = 'https://user-images.githubusercontent.com/43048491/87862968-d999e000-c923-11ea-9ad5-44f6d26e39fa.png';
        this.node = setPiece(this.x * 100, this.y * 100, this.link, this);
        this.parallelMoves();
    }
}
