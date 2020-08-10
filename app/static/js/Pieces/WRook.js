class WRook extends Piece {
    constructor(x, y, flip) {
        super(x, y, flip);
        this.link = 'https://user-images.githubusercontent.com/43048491/89712835-6c490000-d961-11ea-933d-b355a6249aad.png';
        this.node = setPiece(this.x * 100, this.y * 100, this.link, this);
        this.parallelMoves();
    }

    toString = () => {
        return 'R';
    }

    place = (ogX, ogY) => {
        state[2] = '-';
        if (ogX === 7 && ogY === 7) state[1] = state[1].replace('K', '');
        if (ogX === 0 && ogY === 7) state[1] = state[1].replace('Q', '');
    }
}
