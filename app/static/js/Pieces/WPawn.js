class WPawn extends Piece {
    constructor(x, y, flip) {
        super(x, y, flip);
        this.link = 'https://user-images.githubusercontent.com/43048491/89712845-7bc84900-d961-11ea-9d0d-78c54efc07e5.png';
        this.node = setPiece(this.svgX(), this.svgY(), this.link, this);
        this.pawnMoves();
        this.doubleMove = this.y === 1 && flip || this.y === 6 && !flip;
    }

    toString = () => {
        return 'P';
    }
}