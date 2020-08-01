class WPawn extends Piece {
    constructor(x, y, flip) {
        super(x, y, flip);
        this.link = 'https://user-images.githubusercontent.com/43048491/87862699-13b5b280-c921-11ea-9fd3-55836df163f6.png';
        this.node = setPiece(this.svgX(), this.svgY(), this.link, this);
        this.pawnMoves();
        this.doubleMove = y === 1 && flip || y === 6 && !flip;
    }
}