class BKnight extends Piece {
    constructor(x, y, flip) {
        super(x, y, flip);
        this.link = 'https://user-images.githubusercontent.com/43048491/87862999-47dea280-c924-11ea-9a1f-36b3349a2a68.png';
        this.node = setPiece(this.svgX(), this.svgY(), this.link, this);
        this.knightMoves();
    }

    toString = () => {
        return 'n';
    }

    isWhite = () => {
        return false;
    }
}