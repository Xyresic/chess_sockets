let socket = io();
let room = $('title').text().slice(6);
socket.on('connect', () => {
   socket.emit('join', room);
});

let board = document.getElementById('board');
state = state.split(' ');
state[0] = state[0].split('/');
let boardState = [];
let pt = board.createSVGPoint();
let selectedPiece;
let wKingCoord;
let bKingCoord;

for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
        let square = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        square.setAttribute('x', x * 100);
        square.setAttribute('y', y * 100);
        square.setAttribute('width', 100);
        square.setAttribute('height', 100);
        if ((x + y) % 2) {
            square.setAttribute('fill', '#f0f0f0');
        } else {
            square.setAttribute('fill', 'white');
        }
        board.appendChild(square);

        let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x * 100 + 50);
        circle.setAttribute('cy', y * 100 + 50);
        circle.setAttribute('r', 20);
        circle.setAttribute('id', '' + x + y);
        circle.setAttribute('fill', '#c0c0c0');
        circle.setAttribute('visibility', 'hidden');
        board.appendChild(circle);
    }
}

let boardStateCheck = (self=false, castle=false) => {
    let attackedSquares = generateValidMoves(self, true);
    if (castle) {
        return attackedSquares;
    } else {
        let kingCoord = state[0] ^ self? bKingCoord:wKingCoord;
        return attackedSquares.includes(kingCoord.join(''));
    }
}

let check = (piece, target) => {
    let previous = piece.y * 8 + piece.x;
    let next = target[1] * 8 + target[0];
    let copy = boardState[next];
    boardState[previous] = 0;
    boardState[next] = piece;
    let kingCopy;
    if (piece instanceof WKing || piece instanceof BKing) {
        kingCopy = target;
    } else {
        kingCopy = state[0]? wKingCoord:bKingCoord;
    }
    let attackedSquares = generateValidMoves(true, true);
    boardState[previous] = piece;
    boardState[next] = copy;
    return attackedSquares.includes(kingCopy.join(''));
}

let enPassant = () => {
    let enPassantTarget = state[2];
    if (flip && enPassantTarget !== '-') {
        enPassantTarget = enPassantTarget.split('');
        enPassantTarget.forEach((e, i) => {
            enPassantTarget[i] = 7 - e;
        });
        enPassantTarget = enPassantTarget.join('');
    }
    return enPassantTarget;
}

let generateValidMoves = (opp=false, noCheck=false) => {
    let attackedSquares = [];
    for (let piece of boardState.filter(piece => {
        return piece && state[0] ^ !piece.isWhite() ^ opp;
    })) {
        for (let group of piece.moves) {
            for (let move of group) {
                if (piece.inBounds(move)) {
                    let moveX = piece.x + move[0];
                    let moveY = piece.y + move[1];
                    let target = boardState[moveY * 8 + moveX];
                    let circle = $(`circle[id=${moveX}${moveY}]`)[0];
                    if (target && piece.isWhite() === target.isWhite()) break;
                    if (piece instanceof WPawn || piece instanceof BPawn) {
                        if (move[0]) {
                            if (('' + moveX + moveY === enPassant() || target && piece.isWhite() !== target.isWhite()) && (noCheck || !check(piece, [moveX, moveY]))) {
                                attackedSquares.push('' + moveX + moveY);
                                if (!noCheck) piece.addMove(circle);
                            }
                        } else if (target) {
                            break;
                        } else if ((Math.abs(move[1]) === 1 || piece.doubleMove) && (noCheck || !check(piece, [moveX, moveY]))) {
                            if (!noCheck) piece.addMove(circle);
                        }
                    } else if (!noCheck && piece instanceof WKing && Math.abs(move[0]) === 2) {
                        let attackedSquares = boardStateCheck(true, true);
                        if (move[0] === 2) {
                            if (!state[1].includes('K')) break;
                            if (!(boardState[61] === 0 && boardState[62] === 0)) break;
                            if (!attackedSquares.some(e => {
                                return e === '47' || e === '57' || e === '67';
                            })) piece.addMove(circle);
                        } else {
                            if (!state[1].includes('Q')) break;
                            if (!(boardState[59] === 0 && boardState[58] === 0 && boardState[57] === 0)) break;
                            if (!attackedSquares.some(e => {
                                return e === '47' || e === '37' || e === '27';
                            })) piece.addMove(circle);
                        }
                    } else if (!noCheck && piece instanceof BKing && Math.abs(move[0]) === 2) {
                        let attackedSquares = boardStateCheck(true, true);
                        if (move[0] === 2) {
                            if (!state[1].includes('q')) break;
                            if (!(boardState[60] === 0 && boardState[61] === 0 && boardState[62] === 0)) break;
                            if (!attackedSquares.some(e => {
                                return e === '37' || e === '47' || e === '57';
                            })) piece.addMove(circle);
                        } else {
                            if (!state[1].includes('k')) break;
                            if (!(boardState[58] === 0 && boardState[57] === 0)) break;
                            if (!attackedSquares.some(e => {
                                return e === '37' || e === '27' || e === '17';
                            })) piece.addMove(circle);
                        }
                    } else if (noCheck || !check(piece, [moveX, moveY])) {
                        attackedSquares.push('' + moveX + moveY);
                        if (!noCheck) piece.addMove(circle);
                        if (target) break;
                    }
                }
            }
        }
    }
    return attackedSquares;
}

let toFEN = () => {
    let FEN = '';
    for (let i = 0; i < 64; i++) {
        if (!(i % 8)) FEN += '/';
        let piece = boardState[i];
        FEN += piece? piece.toString():'.';
    }
    FEN = FEN.slice(1);
    if (!state[0]) FEN = FEN.split('').reverse().join('');
    FEN += ' ' + (state[0]? 'b ':'w ') + state.slice(1).join(' ');
    return FEN
}

let selectPiece = (piece) => {
    selectedPiece = piece;
    piece.obj.showMoves();
    board.appendChild(piece);
}

let deselectPiece = (piece) => {
    selectedPiece = undefined;
    let obj = piece.obj;
    obj.hideMoves();
    let placed = false;
    let ogX = obj.x;
    let ogY = obj.y;
    let pieceX = parseFloat(piece.getAttribute('x')) + 50;
    let pieceY = parseFloat(piece.getAttribute('y')) + 50;
    for (let circle of obj.move_icons) {
        let circleX = circle.getAttribute('cx');
        let circleY = circle.getAttribute('cy');
        if (Math.abs(pieceX - circleX) <= 50 && Math.abs(pieceY - circleY) <= 50) {
            $(`image[x=${circleX - 50}][y=${circleY - 50}]`).remove();
            obj.x = (circleX - 50) / 100;
            obj.y = (circleY - 50) / 100;
            obj.updateNode();
            placed = true;
            break;
        }
    }
    if (placed) {
        boardState[ogY * 8 + ogX] = 0;
        boardState[obj.y * 8 + obj.x] = obj;
        boardState.forEach(piece => {
            if (piece) piece.clearMoves();
        });
        state[2] = '-';
        if (obj instanceof WKing) {
            wKingCoord = [obj.x, obj.y];
            if (obj.x - ogX ===  2) {
                boardState[63].x = 5;
                boardState[63].updateNode();
                boardState[61] = boardState[63];
                boardState[63] = 0;
            } else if (obj.x - ogX === -2) {
                boardState[56].x = 3;
                boardState[56].updateNode();
                boardState[59] = boardState[56];
                boardState[56] = 0;
            }
            state[1] = state[1].replace('K', '');
            state[1] = state[1].replace('Q', '');
        } else if (obj instanceof BKing) {
            bKingCoord = [obj.x, obj.y];
            if (obj.x - ogX ===  2) {
                boardState[63].x = 4;
                boardState[63].updateNode();
                boardState[60] = boardState[63];
                boardState[63] = 0;
            } else if (obj.x - ogX === -2) {
                boardState[56].x = 2;
                boardState[56].updateNode();
                boardState[58] = boardState[56];
                boardState[56] = 0;
            }
            state[1] = state[1].replace('k', '');
            state[1] = state[1].replace('q', '');
        } else if (obj instanceof WRook) {
            if (ogX === 7 && ogY === 7) state[1] = state[1].replace('K', '');
            if (ogX === 0 && ogY === 7) state[1] = state[1].replace('Q', '');
        } else if (obj instanceof BRook) {
            if (ogX === 7 && ogY === 7) state[1] = state[1].replace('q', '');
            if (ogX === 0 && ogY === 7) state[1] = state[1].replace('k', '');
        } else if (obj instanceof WPawn || obj instanceof BPawn) {
            let enPassantTarget = enPassant();
            if ('' + obj.x + obj.y === enPassantTarget) {
                boardState[(obj.y + 1) * 8 + obj.x] = 0;
                $(`image[x=${obj.x * 100}][y=${(obj.y + 1) * 100}]`).remove();
            } else if (obj.y === 0) {
                //TODO promotion
            } else if (ogY - obj.y === 2) {
                if (flip) {
                    state[2] = '' + (7 - obj.x) + (6 - obj.y);
                } else{
                    state[2] = '' + obj.x + (obj.y + 1);
                }
                obj.doubleMove = false;
            }
        }
        if (state[1] === '') state[1] = '-';
        for (let square of $('rect[fill="#add8e6"]')) {
            let x = square.getAttribute('x') / 100;
            let y = square.getAttribute('y') / 100;
            if ((x + y) % 2) {
                square.setAttribute('fill', '#f0f0f0');
            } else {
                square.setAttribute('fill', 'white');
            }
        }
        let checkedSquare = $('rect[fill="#ff6462"]');
        if ((checkedSquare.attr('x') / 100 + checkedSquare.attr('y') / 100) % 2) {
            checkedSquare.attr('fill', '#f0f0f0');
        } else {
            checkedSquare.attr('fill', 'white');
        }
        $(`rect[x=${ogX * 100}][y=${ogY * 100}]`).attr('fill', '#add8e6');
        $(`rect[x=${obj.x * 100}][y=${obj.y * 100}]`).attr('fill', '#add8e6');
        if (boardStateCheck()) {
            $(`rect[x=${king[0] * 100}][y=${king[1] * 100}]`).attr('fill', '#ff6462');
        }
        socket.emit('move', {room: room, board: toFEN()});
        state[0] = !state[0];
        //TODO checkmate
    } else {
        piece.setAttribute('x', piece.obj.svgX());
        piece.setAttribute('y', piece.obj.svgY());
    }
}

let setPiece = (x, y, link, obj) => {
    let newPiece = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    newPiece.setAttribute('x', x);
    newPiece.setAttribute('y', y);
    newPiece.setAttribute('width', 100);
    newPiece.setAttribute('height', 100);
    newPiece.setAttribute('href', link);
    newPiece.obj = obj;
    newPiece.addEventListener('mousedown', () => {
        selectPiece(newPiece)
    });
    newPiece.addEventListener('mouseup', () => {
        deselectPiece(newPiece)
    });
    board.appendChild(newPiece);
    return newPiece;
}

for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
        switch (state[0][y][x]) {
            case 'P':
                boardState.push(new WPawn(x, y, flip));
                break;
            case 'N':
                boardState.push(new WKnight(x, y, flip));
                break;
            case 'B':
                boardState.push(new WBishop(x, y, flip));
                break;
            case 'R':
                boardState.push(new WRook(x, y, flip));
                break;
            case 'Q':
                boardState.push(new WQueen(x, y, flip));
                break;
            case 'K':
                boardState.push(new WKing(x, y, flip));
                wKingCoord = [x, y];
                break;
            case 'p':
                boardState.push(new BPawn(x, y, flip));
                break;
            case 'n':
                boardState.push(new BKnight(x, y, flip));
                break;
            case 'b':
                boardState.push(new BBishop(x, y, flip));
                break;
            case 'r':
                boardState.push(new BRook(x, y, flip));
                break;
            case 'q':
                boardState.push(new BQueen(x, y, flip));
                break;
            case 'k':
                boardState.push(new BKing(x, y, flip));
                bKingCoord = [x, y];
                break;
            default:
                boardState.push(0);
        }
    }
}
if (flip) {
    boardState.reverse();
    wKingCoord = [7 - wKingCoord[0], 7 - wKingCoord[1]];
    bKingCoord = [7 - bKingCoord[0], 7 - bKingCoord[1]];
}
state.shift();
state[0] = state[0] === 'w';
if (state[0] ^ flip) generateValidMoves();
let king = state[0]? wKingCoord:bKingCoord;
if (boardStateCheck(true)) {
    $(`rect[x=${king[0] * 100}][y=${king[1] * 100}]`).attr('fill', '#ff6462');
}
king = state[0]? bKingCoord:wKingCoord;
if (boardStateCheck()) {
    $(`rect[x=${king[0] * 100}][y=${king[1] * 100}]`).attr('fill', '#ff6462');
}

let dragPiece = (event) => {
    if (selectedPiece !== undefined) {
        pt.x = event.clientX;
        pt.y = event.clientY;
        let cursor = pt.matrixTransform(board.getScreenCTM().inverse());
        selectedPiece.setAttribute('x', cursor.x - 50);
        selectedPiece.setAttribute('y', cursor.y - 50);
    }
}

let returnPiece = () => {
    if (selectedPiece !== undefined) {
        selectedPiece.obj.hideMoves();
        selectedPiece.setAttribute('x', selectedPiece.obj.svgX());
        selectedPiece.setAttribute('y', selectedPiece.obj.svgY());
        selectedPiece = undefined;
    }
}

board.addEventListener('mousemove', e => {
    dragPiece(e)
});
board.addEventListener('mouseout', returnPiece);
socket.on('update', () => {console.log('yep')});