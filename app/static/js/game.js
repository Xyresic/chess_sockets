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

let createCircle = (node, cx, cy) => {
    let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', 20);
    circle.setAttribute('fill', '#d3d3d3');
    board.insertBefore(circle, node); //TODO fix this
}

let selectPiece = (piece) => {
    selectedPiece = piece;
    $('svg circle').remove();
    let ogX = piece.ogX;
    let ogY = piece.ogY;
    switch (piece.type) {
        case 'P':
            if (flip) {
                createCircle(piece, ogX + 50, ogY + 150);
                if (ogY == 100) {
                    createCircle(piece, ogX + 50, ogY + 250);
                }
            } else {
                createCircle(piece, ogX + 50, ogY - 50);
                if (ogY == 600) {
                    createCircle(piece, ogX + 50, ogY - 150);
                }
            }
            break;
        case 'p':
            if (flip) {
                createCircle(piece, ogX + 50, ogY - 50);
                if (ogY == 600) {
                    createCircle(piece, ogX + 50, ogY - 150);
                }
            } else {
                createCircle(piece, ogX + 50, ogY + 150);
                if (ogY == 100) {
                    createCircle(piece, ogX + 50, ogY + 250);
                }
            }
            break;
    }
}

let deselectPiece = () => {
    selectedPiece = null;
}

let setPiece = (x, y, type, link) => {
    let newPiece = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    if (flip) {
        var posX = 700 - x;
        var posY = 700 - y;
    } else {
        var posX = x;
        var posY = y;
    }
    newPiece.setAttribute('x', posX);
    newPiece.setAttribute('y', posY);
    newPiece.ogX = posX;
    newPiece.ogY = posY;
    newPiece.setAttribute('width', 100);
    newPiece.setAttribute('height', 100);
    newPiece.type = type;
    newPiece.setAttribute('href', link);
    newPiece.addEventListener('mousedown', () => {selectPiece(newPiece)});
    newPiece.addEventListener('mouseup', deselectPiece);
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

board.addEventListener('mousemove', e => {dragPiece(e)});