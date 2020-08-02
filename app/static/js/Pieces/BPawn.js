class BPawn extends Piece {
    constructor(x, y, flip) {
        super(x, y, flip);
        this.link = 'https://user-images.githubusercontent.com/43048491/87862719-321bae00-c921-11ea-940c-4ae7ab173480.png';
        this.node = setPiece(this.svgX(), this.svgY(), this.link, this);
        this.pawnMoves();
        this.doubleMove = this.y === 6 && flip || this.y === 1 && !flip;
    }

    isWhite = () => {
        return false;
    }
}