class WKing extends Piece {
    constructor(x, y, flip) {
        super(x, y, flip);
        this.link = 'https://user-images.githubusercontent.com/43048491/89712851-88e53800-d961-11ea-9bce-4b9e0653c1d9.png';
        this.node = setPiece(this.x * 100, this.y * 100, this.link, this);
        this.parallelMoves(true);
        this.diagonalMoves(true);
        this.castling();
    }

    toString = () => {
        return 'K';
    }

    generateMoves = (noCheck) => {
        let attackingSquares = [];
        for (let group of this.moves) {
            for (let move of group) {
                if (this.inBounds(move)) {
                    let moveX = this.x + move[0];
                    let moveY = this.y + move[1];
                    let target = boardState[moveY * 8 + moveX];
                    let circle = $(`circle[id=${moveX}${moveY}]`)[0];
                    if (target && this.isWhite() === target.isWhite()) break;
                    if (!noCheck && Math.abs(move[0]) === 2) {
                        let attackedSquares = boardStateCheck(true, true);
                        if (move[0] === 2) {
                            if (!state[1].includes('K')) break;
                            if (!(boardState[61] === 0 && boardState[62] === 0)) break;
                            if (!attackedSquares.some(e => {
                                return e === '47' || e === '57' || e === '67';
                            })) this.addMove(circle);
                        } else {
                            if (!state[1].includes('Q')) break;
                            if (!(boardState[59] === 0 && boardState[58] === 0 && boardState[57] === 0)) break;
                            if (!attackedSquares.some(e => {
                                return e === '47' || e === '37' || e === '27';
                            })) this.addMove(circle);
                        }
                    } else if (noCheck || !check(this, [moveX, moveY])) {
                        attackingSquares.push('' + moveX + moveY);
                        if (!noCheck) this.addMove(circle);
                        if (target) break;
                    }
                }
            }
        }
        return attackingSquares;
    }

    place = (ogX, ogY) => {
        state[2] = '-';
        wKingCoord = [this.x, this.y];
        if (this.x - ogX === 2) {
            boardState[63].x = 5;
            boardState[63].updateNode();
            boardState[61] = boardState[63];
            boardState[63] = 0;
        } else if (this.x - ogX === -2) {
            boardState[56].x = 3;
            boardState[56].updateNode();
            boardState[59] = boardState[56];
            boardState[56] = 0;
        }
        state[1] = state[1].replace('K', '');
        state[1] = state[1].replace('Q', '');
    }
}