let board = document.getElementById('board');
state = state.split(' ');
state[0] = state[0].split('/');
let boardState = [];
let pt = board.createSVGPoint();
let selectedPiece;

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

let generateOppMoves = () => {

}

let check = (piece, move, opponent=false) => {
    return false;
}

let generateYourMoves = () => {
    let moveFound = false;
    for (let piece of boardState.filter(piece => {
        return piece && !(state[0] === 'w' ^ piece.isWhite());
    })) {
        for (let group of piece.moves) {
            for (let move of group) {
                if (piece.inBounds(move)) {
                    let moveX = piece.x + move[0];
                    let moveY = piece.y + move[1];
                    let target = boardState[moveY * 8 + moveX];
                    let circle = $(`circle[id=${moveX}${moveY}]`)[0];
                    if (target && piece.isWhite() === target.isWhite()) {
                        break;
                    } else if (piece instanceof WPawn || piece instanceof BPawn) {
                        //TODO en passant
                        if (move[0]) {
                            if (target && piece.isWhite() !== target.isWhite() && !check(piece, move)) {
                                moveFound = true;
                                piece.addMove(circle);
                            }
                        } else if (target) {
                            break;
                        } else if (Math.abs(move[1]) === 1 || piece.doubleMove && !check(piece, move)) {
                            moveFound = true;
                            piece.addMove(circle);
                        }
                    } else if(!check(piece, move)) {
                        moveFound = true;
                        piece.addMove(circle);
                        if (target) {
                            break;
                        }
                    }
                }
            }
        }
    }
    if (!moveFound) {
        //TODO checkmate
    }
}


let selectPiece = (piece) => {
    selectedPiece = piece;
    piece.obj.showMoves();
    board.appendChild(piece);
}

let deselectPiece = (piece) => {
    selectedPiece = undefined;
    piece.obj.hideMoves();
    let placed = false;
    let pieceX = parseFloat(piece.getAttribute('x')) + 50;
    let pieceY = parseFloat(piece.getAttribute('y')) + 50;
    for (let circle of piece.obj.move_icons) {
        let circleX = circle.getAttribute('cx');
        let circleY = circle.getAttribute('cy');
        if (Math.abs(pieceX - circleX) <= 50 && Math.abs(pieceY - circleY) <= 50) {
            piece.setAttribute('x', circleX - 50);
            piece.setAttribute('y', circleY - 50);
            piece.obj.x = (circleX - 50) / 100;
            piece.obj.y = (circleY - 50) / 100;
            placed = true;
            break;
        }
    }
    if (placed) {
        //TODO capturing
        //TODO switch players
        //TODO destroy moves
        //TODO blue squares
        //TODO check -> red square
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
                break;
            default:
                boardState.push(0);
        }
    }
}
state.shift();
generateYourMoves();

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