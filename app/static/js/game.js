let socket = io();
let room = $('title').text().slice(6);
socket.on('connect', () => {
   socket.emit('join', room);
});

let board = document.getElementById('board');
let promotions = document.getElementsByClassName('promotedPiece');
let promoteModal = document.getElementById('promote');
let boardState = new Array(64).fill(0);
let pt = board.createSVGPoint();
let selectedPiece;
let wKingCoord;
let bKingCoord;
let king;
let promotedPawn;

let drawGrid = () => {
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
                            if (noCheck || (('' + moveX + moveY === enPassant() || target && piece.isWhite() !== target.isWhite()) && !check(piece, [moveX, moveY]))) {
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

let markCheck = () => {
    $(`rect[x=${king[0] * 100}][y=${king[1] * 100}]`).attr('fill', '#ff6462');
}

let passTurn = () => {
    if (boardStateCheck()) markCheck();
    let prevMove = [];
    for (let square of $('rect[fill="#add8e6"]')) {
        let x = square.getAttribute('x') / 100;
        let y = square.getAttribute('y') / 100;
        prevMove.push([x, y]);
    }
    socket.emit('move', {room: room, user: flip, board: toFEN(), move: prevMove});
    state[0] = !state[0];
}

let selectPiece = (piece) => {
    selectedPiece = piece;
    piece.obj.showMoves();
    board.appendChild(piece);
}

let removePrevMove = () => {
    for (let square of $('rect[fill="#add8e6"]')) {
        let x = square.getAttribute('x') / 100;
        let y = square.getAttribute('y') / 100;
        if ((x + y) % 2) {
            square.setAttribute('fill', '#f0f0f0');
        } else {
            square.setAttribute('fill', 'white');
        }
    }
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
        let notPromoting = true;
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
                notPromoting = false;
                promotedPawn = piece;
                modal.style.display = 'inline';
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
        removePrevMove();
        let checkedSquare = $('rect[fill="#ff6462"]');
        if ((checkedSquare.attr('x') / 100 + checkedSquare.attr('y') / 100) % 2) {
            checkedSquare.attr('fill', '#f0f0f0');
        } else {
            checkedSquare.attr('fill', 'white');
        }
        $(`rect[x=${ogX * 100}][y=${ogY * 100}]`).attr('fill', '#add8e6');
        $(`rect[x=${obj.x * 100}][y=${obj.y * 100}]`).attr('fill', '#add8e6');
        if (notPromoting) passTurn();
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

let checkmate = (winner) => {
    $('#winner').text(`${winner} Wins`);
    $('#checkmate').modal('toggle');
}

let draw = () => {
    $('#draw').modal('toggle');
}

let setup = () => {
    state = state.split(' ');
    state[0] = state[0].split('/');
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            let i = y * 8 + x;
            let square = boardState[i];
            if (!square && state[0][y][x] !== '.' || square && square.toString() !== state[0][y][x]) {
                $(`image[x=${(flip? 7-x:x) * 100}][y=${(flip? 7-y:y) * 100}]`).remove();
                switch (state[0][y][x]) {
                    case 'P':
                        boardState[i] = new WPawn(x, y, flip);
                        break;
                    case 'N':
                        boardState[i] = new WKnight(x, y, flip);
                        break;
                    case 'B':
                        boardState[i] = new WBishop(x, y, flip);
                        break;
                    case 'R':
                        boardState[i] = new WRook(x, y, flip);
                        break;
                    case 'Q':
                        boardState[i] = new WQueen(x, y, flip);
                        break;
                    case 'K':
                        boardState[i] = new WKing(x, y, flip);
                        wKingCoord = flip? [7 - x, 7 - y]:[x, y];
                        break;
                    case 'p':
                        boardState[i] = new BPawn(x, y, flip);
                        break;
                    case 'n':
                        boardState[i] = new BKnight(x, y, flip);
                        break;
                    case 'b':
                        boardState[i] = new BBishop(x, y, flip);
                        break;
                    case 'r':
                        boardState[i] = new BRook(x, y, flip);
                        break;
                    case 'q':
                        boardState[i] = new BQueen(x, y, flip);
                        break;
                    case 'k':
                        boardState[i] = new BKing(x, y, flip);
                        bKingCoord = flip? [7 - x, 7 - y]:[x, y];
                        break;
                    default:
                        boardState[i] = 0;
                }
            }
        }
    }
    if (flip) boardState.reverse();
    state.shift();
    state[0] = state[0] === 'w';
    king = state[0] ? wKingCoord : bKingCoord;
    if (boardStateCheck(true)) markCheck();
    if (state[0] ^ flip) {
        let moves = generateValidMoves();
        if (moves.length === 0) {
            if ($(`rect[x=${king[0] * 100}][y=${king[1] * 100}]`).attr('fill') === '#ff6462') {
                socket.emit('endgame', {room: room, type: 'checkmate', loser: flip});
            } else {
                socket.emit('endgame', {room: room, type: 'draw'});
            }
        }
    }
    king = state[0] ? bKingCoord : wKingCoord;
    if (boardStateCheck()) markCheck();
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

let promote = function() {
    let newPiece;
    let pawn = promotedPawn.obj;
    switch (this.getAttribute('id')) {
        case 'promotedQueen':
            newPiece = flip? new BQueen(7 - pawn.x, 7 - pawn.y, flip):new WQueen(pawn.x, pawn.y, flip);
            break;
        case 'promotedRook':
            newPiece = flip? new BRook(7 - pawn.x, 7 - pawn.y, flip):new WRook(pawn.x, pawn.y, flip);
            break;
        case 'promotedBishop':
            newPiece = flip? new BBishop(7 - pawn.x, 7 - pawn.y, flip):new WBishop(pawn.x, pawn.y, flip);
            break;
        default:
            newPiece = flip? new BKnight(7 - pawn.x, 7 - pawn.y, flip):new WKnight(pawn.x, pawn.y, flip);
            break;
    }
    boardState[pawn.y * 8 + pawn.x] = newPiece;
    promotedPawn.remove();
    promotedPawn = undefined;
    promoteModal.style.display = 'none';
    passTurn();
}

let updateBoard = (user, board, move) => {
    if (user !== flip) {
        document.getElementById('moveSound').play();
        removePrevMove();
        $(`rect[x=${(7-move[0][0]) * 100}][y=${(7-move[0][1]) * 100}]`).attr('fill', '#add8e6');
        $(`rect[x=${(7-move[1][0]) * 100}][y=${(7-move[1][1]) * 100}]`).attr('fill', '#add8e6');
        state = board;
        if (flip) boardState.reverse();
        setup();
    }
}

drawGrid();
setup();
board.addEventListener('mousemove', e => {
    dragPiece(e)
});
board.addEventListener('mouseout', returnPiece);
for (let piece of promotions) {
    piece.addEventListener('click', promote);
}
socket.on('update', (u, b, m) => {updateBoard(u, b, m)});
socket.on('checkmate', winner => {checkmate(winner)});
socket.on('draw', draw);