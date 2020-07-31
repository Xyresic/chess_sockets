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
        circle.setAttribute('fill', '#c0c0c0');
        board.appendChild(circle);
    }
}

let createCircle = (cx, cy) => {
    let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', 20);
    circle.setAttribute('fill', '#c0c0c0');
    board.appendChild(circle);
}

let validSquare = (piece, x, y, captureOptional = true) => {
    //TODO check if own king would be in check
    let pieceType = Math.floor((piece.type.charCodeAt() - 65) / 26);
    let squareType = Math.floor((state[0][y].charCodeAt(x) - 65) / 26);
    return pieceType !== squareType && (captureOptional || squareType > -1);
}

let pawnCheck = (piece) => {
    let ogX = piece.ogX;
    let ogY = piece.ogY;
    if (piece.type === 'P' && flip || piece.type === 'p' && !flip) {
        if (validSquare(piece, ogX/100, ogY/100 + 1) && state[0][ogY/100 + 1][ogX/100] === '.') {
            createCircle(ogX + 50, ogY + 150);
            if (ogY === 100 && validSquare(piece, ogX/100, ogY/100 + 2) && state[0][ogY/100 + 2][ogX/100] === '.') {
                createCircle(ogX + 50, ogY + 250);
            }
        }
        if (ogX > 0 && validSquare(piece, ogX/100 - 1, ogY/100 + 1, false)) {
            createCircle(ogX - 50, ogY + 150);
        }
        if (ogX < 700 && validSquare(piece, ogX/100 + 1, ogY/100 + 1, false)) {
            createCircle(ogX + 150, ogY + 150);
        }
    } else {
        if (validSquare(piece, ogX/100, ogY/100 - 1) && state[0][ogY/100 - 1][ogX/100] === '.') {
            createCircle(ogX + 50, ogY - 50);
            if (ogY === 600 && validSquare(piece, ogX/100, ogY/100 - 2) && state[0][ogY/100 - 2][ogX/100] === '.') {
                createCircle(ogX + 50, ogY - 150);
            }
        }
        if (ogX > 0 && validSquare(piece, ogX/100 - 1, ogY/100 - 1, false)) {
            createCircle(ogX - 50, ogY - 50);
        }
        if (ogX < 700 && validSquare(piece, ogX/100 + 1, ogY/100 - 1, false)) {
            createCircle(ogX + 150, ogY - 50);
        }
    }
}

let knightCheck = (piece, offsetX, offsetY) => {
    let posX = piece.ogX + offsetX;
    let posY = piece.ogY + offsetY;
    if (posX <= 700 && posX >= 0 && posY <= 700 && posY >= 0 && validSquare(piece, posX / 100, posY / 100)) {
        createCircle(posX + 50, posY + 50);
    }
}

let crossCheck = (piece, king = false) => {
    let ogX = piece.ogX;
    let ogY = piece.ogY;
    for (let x = ogX/100 + 1; x < 8; x++) {
        if (king && x > ogX/100 + 1) {
            break;
        }
        if (validSquare(piece, x, ogY/100)) {
            createCircle(x * 100 + 50, ogY + 50);
        }
        if (state[0][ogY/100][x] !== '.') {
            break;
        }
    }
    for (let x = ogX/100 - 1; x > -1; x--) {
        if (king && x < ogX/100 - 1) {
            break;
        }
        if (validSquare(piece, x, ogY/100)) {
            createCircle(x * 100 + 50, ogY + 50);
        }
        if (state[0][ogY/100][x] !== '.') {
            break;
        }
    }
    for (let y = ogY/100 + 1; y < 8; y++) {
        if (king && y > ogY/100 + 1) {
            break;
        }
        if (validSquare(piece, ogX/100, y)) {
            createCircle(ogX + 50, y * 100 + 50);
        }
        if (state[0][y][ogX/100] !== '.') {
            break;
        }
    }
    for (let y = ogY/100 - 1; y > -1; y--) {
        if (king && y < ogY/100 - 1) {
            break;
        }
        if (validSquare(piece, ogX/100, y)) {
            createCircle(ogX + 50, y * 100 + 50);
        }
        if (state[0][y][ogX/100] !== '.') {
            break;
        }
    }
}

let diagCheck = (piece, king = false) => {
    let ogX = piece.ogX;
    let ogY = piece.ogY;
    let possibleLeft = piece.ogX / 100;
    let possibleRight = 7 - possibleLeft;
    let possibleAbove = piece.ogY / 100;
    let possibleBelow = 7 - possibleAbove;
    for (let i = 1; i < Math.min(possibleAbove, possibleLeft) + 1; i++) {
        if (king && i > 1) {
            break;
        }
        if (validSquare(piece, ogX/100 - i, ogY/100 - i)) {
            createCircle(ogX - 50 - 100 * (i - 1), ogY - 50 - 100 * (i - 1));
        }
        if (state[0][ogY/100 - i][ogX/100 - i] !== '.') {
            break;
        }
    }
    for (let i = 1; i < Math.min(possibleAbove, possibleRight) + 1; i++) {
        if (king && i > 1) {
            break;
        }
        if (validSquare(piece, ogX/100 + i, ogY/100 - i)) {
            createCircle(ogX + 50 + 100 * i, ogY - 50 - 100 * (i - 1));
        }
        if (state[0][ogY/100 - i][ogX/100 + i] !== '.') {
            break;
        }
    }
    for (let i = 1; i < Math.min(possibleBelow, possibleLeft) + 1; i++) {
        if (king && i > 1) {
            break;
        }
        if (validSquare(piece, ogX/100 - i, ogY/100 + i)) {
            createCircle(ogX - 50 - 100 * (i - 1), ogY + 50 + 100 * i);
        }
        if (state[0][ogY/100 + i][ogX/100 - i] !== '.') {
            break;
        }
    }
    for (let i = 1; i < Math.min(possibleBelow, possibleRight) + 1; i++) {
        if (king && i > 1) {
            break;
        }
        if (validSquare(piece, ogX/100 + i, ogY/100 + i)) {
            createCircle(ogX + 50 + 100 * i, ogY + 50 + 100 * i);
        }
        if (state[0][ogY/100 + i][ogX/100 + i] !== '.') {
            break;
        }
    }
}

let selectPiece = (piece) => {
    selectedPiece = piece;
    piece.obj.showMoves();
    board.appendChild(piece);
}

let deselectPiece = (piece) => {
    //TODO capturing, check for checkmate
    selectedPiece.obj.hideMoves();
    selectedPiece = undefined;
    let placed = false;
    let pieceX = piece.obj.svgX() + 50;
    let pieceY = piece.obj.svgY() + 50;
    let circles = $('circle');
    for (let circle of circles) {
        let circX = circle.getAttribute('cx');
        let circY = circle.getAttribute('cy');
        if (Math.abs(pieceX - circX) <= 50 && Math.abs(pieceY - circY) <= 50) {
            piece.setAttribute('x', circX - 50);
            piece.setAttribute('y', circY - 50);
            piece.obj.ogX = (circX - 50) / 100;
            piece.obj.ogY = (circY - 50) / 100;
            placed = true;
            break;
        }
    }
    if (!placed) {
        piece.setAttribute('x', piece.obj.svg_ogX());
        piece.setAttribute('y', piece.obj.svg_ogY());
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
        selectedPiece.setAttribute('x', selectedPiece.obj.svg_ogX());
        selectedPiece.setAttribute('y', selectedPiece.obj.svg_ogY());
        selectedPiece = undefined;
    }
}

board.addEventListener('mousemove', e => {
    dragPiece(e)
});
board.addEventListener('mouseout', returnPiece);