class WKnight extends Piece {
    constructor(x, y, flip) {
        super(x, y, flip);
        this.link = 'https://user-images.githubusercontent.com/43048491/87862988-35646900-c924-11ea-87bc-7590c08677cc.png';
        this.node = setPiece(this.x * 100, this.y * 100, this.link, this);
        this.knightMoves();
    }

    toString = () => {
        return 'N';
    }
}
