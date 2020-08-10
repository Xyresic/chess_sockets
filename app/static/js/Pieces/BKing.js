class BKing extends Piece {
    constructor(x, y, flip) {
        super(x, y, flip);
        this.link = 'https://user-images.githubusercontent.com/43048491/89712870-a7e3ca00-d961-11ea-95ec-dd4b20c10f42.png';
        this.node = setPiece(this.svgX(), this.svgY(), this.link, this);
        this.parallelMoves(true);
        this.diagonalMoves(true);
        this.castling();
    }

    toString = () => {
        return 'k';
    }

    isWhite = () => {
        return false;
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
                            if (!state[1].includes('q')) break;
                            if (!(boardState[60] === 0 && boardState[61] === 0 && boardState[62] === 0)) break;
                            if (!attackedSquares.some(e => {
                                return e === '37' || e === '47' || e === '57';
                            })) this.addMove(circle);
                        } else {
                            if (!state[1].includes('k')) break;
                            if (!(boardState[58] === 0 && boardState[57] === 0)) break;
                            if (!attackedSquares.some(e => {
                                return e === '37' || e === '27' || e === '17';
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
        bKingCoord = [this.x, this.y];
        if (this.x - ogX === 2) {
            boardState[63].x = 4;
            boardState[63].updateNode();
            boardState[60] = boardState[63];
            boardState[63] = 0;
        } else if (this.x - ogX === -2) {
            boardState[56].x = 2;
            boardState[56].updateNode();
            boardState[58] = boardState[56];
            boardState[56] = 0;
        }
        state[1] = state[1].replace('k', '');
        state[1] = state[1].replace('q', '');
    }
}
