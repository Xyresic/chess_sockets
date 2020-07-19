let board = document.getElementById('board');
state = state.split(' ');
state[0] = state[0].split('/');
let pt = board.createSVGPoint();
let selectedPiece;

let wKing = 'https://user-images.githubusercontent.com/43048491/87862562-802fb200-c91f-11ea-87a1-025bcc2d948f.png';
let wQueen = 'https://user-images.githubusercontent.com/43048491/87862639-3d220e80-c920-11ea-8e71-08437bc1811e.png';
let wRook = 'https://user-images.githubusercontent.com/43048491/87862968-d999e000-c923-11ea-9ad5-44f6d26e39fa.png';
let wBishop = 'https://user-images.githubusercontent.com/43048491/87862977-09e17e80-c924-11ea-8bb7-2e0043200ff6.png';
let wKnight = 'https://user-images.githubusercontent.com/43048491/87862988-35646900-c924-11ea-87bc-7590c08677cc.png';
let wPawn = 'https://user-images.githubusercontent.com/43048491/87862699-13b5b280-c921-11ea-9fd3-55836df163f6.png';
let bKing = 'https://user-images.githubusercontent.com/43048491/87862650-56c35600-c920-11ea-9d5a-b2d741ecddd8.png';
let bQueen = 'https://user-images.githubusercontent.com/43048491/87862656-680c6280-c920-11ea-9433-f160d93d9fcf.png';
let bRook = 'https://user-images.githubusercontent.com/43048491/87862792-f0d7ce00-c921-11ea-954d-96232b73ec09.png';
let bBishop = 'https://user-images.githubusercontent.com/43048491/87862983-267db680-c924-11ea-89d1-dbe5d19cc4d1.png';
let bKnight = 'https://user-images.githubusercontent.com/43048491/87862999-47dea280-c924-11ea-9a1f-36b3349a2a68.png';
let bPawn = 'https://user-images.githubusercontent.com/43048491/87862719-321bae00-c921-11ea-940c-4ae7ab173480.png';

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
    let pieceType = Math.floor((piece.type.charCodeAt() - 65) / 26);
    let squareType = Math.floor((state[0][y].charCodeAt(x) - 65) / 26);
    return pieceType !== squareType && (captureOptional || squareType > -1);
}

let pawnCheck = (piece) => {
    let ogX = piece.ogX;
    let ogY = piece.ogY;
    if (piece.type === 'P' && flip || piece.type === 'p' && !flip) {
        if (validSquare(piece, ogX / 100, ogY / 100 + 1) && state[0][ogY / 100 + 1][ogX / 100] === '.') {
            createCircle(ogX + 50, ogY + 150);
            if (ogY === 100 && validSquare(piece, ogX / 100, ogY / 100 + 2)) {
                createCircle(ogX + 50, ogY + 250);
            }
        }
        if (ogX > 0 && validSquare(piece, ogX / 100 - 1, ogY / 100 + 1, false)) {
            createCircle(ogX - 50, ogY + 150);
        }
        if (ogX < 700 && validSquare(piece, ogX / 100 + 1, ogY / 100 + 1, false)) {
            createCircle(ogX + 150, ogY + 150);
        }
    } else {
        if (validSquare(piece, ogX / 100, ogY / 100 - 1) && state[0][ogY / 100 - 1][ogX / 100] === '.') {
            createCircle(ogX + 50, ogY - 50);
            if (ogY === 600 && validSquare(piece, ogX / 100, ogY / 100 - 2)) {
                createCircle(ogX + 50, ogY - 150);
            }
        }
        if (ogX > 0 && validSquare(piece, ogX / 100 - 1, ogY / 100 - 1, false)) {
            createCircle(ogX - 50, ogY - 50);
        }
        if (ogX < 700 && validSquare(piece, ogX / 100 + 1, ogY / 100 - 1, false)) {
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
    for (let x = ogX / 100 + 1; x < 8; x++) {
        if (king && x > ogX / 100 + 1) {
            break;
        }
        if (validSquare(piece, x, ogY / 100)) {
            createCircle(x * 100 + 50, ogY + 50);
        }
        if (state[0][ogY / 100][x] !== '.') {
            break;
        }
    }
    for (let x = ogX / 100 - 1; x > -1; x--) {
        if (king && x < ogX / 100 - 1) {
            break;
        }
        if (validSquare(piece, x, ogY / 100)) {
            createCircle(x * 100 + 50, ogY + 50);
        }
        if (state[0][ogY / 100][x] !== '.') {
            break;
        }
    }
    for (let y = ogY / 100 + 1; y < 8; y++) {
        if (king && y > ogY / 100 + 1) {
            break;
        }
        if (validSquare(piece, ogX / 100, y)) {
            createCircle(ogX + 50, y * 100 + 50);
        }
        if (state[0][y][ogX / 100] !== '.') {
            break;
        }
    }
    for (let y = ogY / 100 - 1; y > -1; y--) {
        if (king && y < ogY / 100 - 1) {
            break;
        }
        if (validSquare(piece, ogX / 100, y)) {
            createCircle(ogX + 50, y * 100 + 50);
        }
        if (state[0][y][ogX / 100] !== '.') {
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
        if (validSquare(piece, ogX / 100 - i, ogY / 100 - i)) {
            createCircle(ogX - 50 - 100 * (i - 1), ogY - 50 - 100 * (i - 1));
        }
        if (state[0][ogY / 100 - i][ogX / 100 - i] !== '.') {
            break;
        }
    }
    for (let i = 1; i < Math.min(possibleAbove, possibleRight) + 1; i++) {
        if (king && i > 1) {
            break;
        }
        if (validSquare(piece, ogX / 100 + i, ogY / 100 - i)) {
            createCircle(ogX + 50 + 100 * i, ogY - 50 - 100 * (i - 1));
        }
        if (state[0][ogY / 100 - i][ogX / 100 + i] !== '.') {
            break;
        }
    }
    for (let i = 1; i < Math.min(possibleBelow, possibleLeft) + 1; i++) {
        if (king && i > 1) {
            break;
        }
        if (validSquare(piece, ogX / 100 - i, ogY / 100 + i)) {
            createCircle(ogX - 50 - 100 * (i - 1), ogY + 50 + 100 * i);
        }
        if (state[0][ogY / 100 + i][ogX / 100 - i] !== '.') {
            break;
        }
    }
    for (let i = 1; i < Math.min(possibleBelow, possibleRight) + 1; i++) {
        if (king && i > 1) {
            break;
        }
        if (validSquare(piece, ogX / 100 + i, ogY / 100 + i)) {
            createCircle(ogX + 50 + 100 * i, ogY + 50 + 100 * i);
        }
        if (state[0][ogY / 100 + i][ogX / 100 + i] !== '.') {
            break;
        }
    }
}

let selectPiece = (piece) => {
    selectedPiece = piece;
    $('svg circle').remove();
    let ogX = piece.ogX;
    let ogY = piece.ogY;
    switch (piece.type) {
        case 'P':
        case 'p':
            //TODO en passant
            pawnCheck(piece);
            break;
        case 'N':
        case 'n':
            knightCheck(piece, -200, -100);
            knightCheck(piece, -200, 100);
            knightCheck(piece, -100, -200);
            knightCheck(piece, -100, 200);
            knightCheck(piece, 100, -200);
            knightCheck(piece, 100, 200);
            knightCheck(piece, 200, -100);
            knightCheck(piece, 200, 100);
            break;
        case 'B':
        case 'b':
            diagCheck(piece);
            break;
        case 'R':
        case 'r':
            crossCheck(piece);
            break;
        case 'Q':
        case 'q':
            crossCheck(piece);
            diagCheck(piece);
            break;
        case 'K':
        case 'k':
            crossCheck(piece, true);
            diagCheck(piece, true);
            break;
    }
    board.appendChild(piece);
}

let deselectPiece = (piece) => {
    selectedPiece = null;
    let placed = false;
    let pieceX = parseFloat(piece.getAttribute('x')) + 50;
    let pieceY = parseFloat(piece.getAttribute('y')) + 50;
    let nearbySpaces = $('circle');
    for (let circle of nearbySpaces) {
        let circX = circle.getAttribute('cx');
        let circY = circle.getAttribute('cy');
        if (Math.abs(pieceX - circX) <= 50 && Math.abs(pieceY - circY) <= 50) {
            piece.setAttribute('x', circX - 50);
            piece.setAttribute('y', circY - 50);
            piece.ogX = circX - 50;
            piece.ogY = circY - 50;
            placed = true;
            break;
        }
    }
    if (!placed) {
        piece.setAttribute('x', piece.ogX);
        piece.setAttribute('y', piece.ogY);
    }
    $('svg circle').remove();
}

let setPiece = (x, y, type, link) => {
    let newPiece = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    let posX;
    let posY;
    if (flip) {
        posX = 700 - x;
        posY = 700 - y;
    } else {
        posX = x;
        posY = y;
    }
    newPiece.setAttribute('x', posX);
    newPiece.setAttribute('y', posY);
    newPiece.ogX = posX;
    newPiece.ogY = posY;
    newPiece.setAttribute('width', 100);
    newPiece.setAttribute('height', 100);
    newPiece.type = type;
    newPiece.setAttribute('href', link);
    newPiece.addEventListener('mousedown', () => {
        selectPiece(newPiece)
    });
    newPiece.addEventListener('mouseup', () => {
        deselectPiece(newPiece)
    });
    board.appendChild(newPiece);
}

for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
        switch (state[0][y][x]) {
            case 'P':
                setPiece(x * 100, y * 100, 'P', wPawn);
                break;
            case 'N':
                setPiece(x * 100, y * 100, 'N', wKnight);
                break;
            case 'B':
                setPiece(x * 100, y * 100, 'B', wBishop);
                break;
            case 'R':
                setPiece(x * 100, y * 100, 'R', wRook);
                break;
            case 'Q':
                setPiece(x * 100, y * 100, 'Q', wQueen);
                break;
            case 'K':
                setPiece(x * 100, y * 100, 'K', wKing);
                break;
            case 'p':
                setPiece(x * 100, y * 100, 'p', bPawn);
                break;
            case 'n':
                setPiece(x * 100, y * 100, 'n', bKnight);
                break;
            case 'b':
                setPiece(x * 100, y * 100, 'b', bBishop);
                break;
            case 'r':
                setPiece(x * 100, y * 100, 'r', bRook);
                break;
            case 'q':
                setPiece(x * 100, y * 100, 'q', bQueen);
                break;
            case 'k':
                setPiece(x * 100, y * 100, 'k', bKing);
                break;
        }
    }
}

let dragPiece = (event) => {
    if (selectedPiece != null) {
        pt.x = event.clientX;
        pt.y = event.clientY;
        let cursor = pt.matrixTransform(board.getScreenCTM().inverse());
        selectedPiece.setAttribute('x', cursor.x - 50);
        selectedPiece.setAttribute('y', cursor.y - 50);
    }
}

board.addEventListener('mousemove', e => {
    dragPiece(e)
});