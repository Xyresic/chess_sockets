let board = document.getElementById('board');
let pt = board.createSVGPoint();
let selected_piece;

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

let select_piece = (piece) => {
    selected_piece = piece;
}

let deselect_piece = () => {
    selected_piece = null;
}

let set_piece = (x, y, link) => {
    let new_piece = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    new_piece.setAttribute('x', x);
    new_piece.setAttribute('y', y);
    new_piece.setAttribute('width', 100);
    new_piece.setAttribute('height', 100);
    new_piece.setAttribute('href', link);
    new_piece.addEventListener('mousedown', () => {select_piece(new_piece)});
    new_piece.addEventListener('mouseup', deselect_piece);
    board.appendChild(new_piece);
}

let white_king = 'https://user-images.githubusercontent.com/43048491/87862562-802fb200-c91f-11ea-87a1-025bcc2d948f.png';
let white_queen = 'https://user-images.githubusercontent.com/43048491/87862639-3d220e80-c920-11ea-8e71-08437bc1811e.png';
let white_rook = 'https://user-images.githubusercontent.com/43048491/87862968-d999e000-c923-11ea-9ad5-44f6d26e39fa.png';
let white_bishop = 'https://user-images.githubusercontent.com/43048491/87862977-09e17e80-c924-11ea-8bb7-2e0043200ff6.png';
let white_knight = 'https://user-images.githubusercontent.com/43048491/87862988-35646900-c924-11ea-87bc-7590c08677cc.png';
let white_pawn = 'https://user-images.githubusercontent.com/43048491/87862699-13b5b280-c921-11ea-9fd3-55836df163f6.png';
let black_king = 'https://user-images.githubusercontent.com/43048491/87862650-56c35600-c920-11ea-9d5a-b2d741ecddd8.png';
let black_queen = 'https://user-images.githubusercontent.com/43048491/87862656-680c6280-c920-11ea-9433-f160d93d9fcf.png';
let black_rook = 'https://user-images.githubusercontent.com/43048491/87862792-f0d7ce00-c921-11ea-954d-96232b73ec09.png';
let black_bishop = 'https://user-images.githubusercontent.com/43048491/87862983-267db680-c924-11ea-89d1-dbe5d19cc4d1.png';
let black_knight = 'https://user-images.githubusercontent.com/43048491/87862999-47dea280-c924-11ea-9a1f-36b3349a2a68.png';
let black_pawn = 'https://user-images.githubusercontent.com/43048491/87862719-321bae00-c921-11ea-940c-4ae7ab173480.png';

let white_back_rank;
let black_back_rank;
if (flip) {
    white_back_rank = 0;
    black_back_rank = 700;
} else {
    white_back_rank = 700;
    black_back_rank = 0;
}

set_piece(400, white_back_rank, white_king);
set_piece(300, white_back_rank, white_queen);
set_piece(0, white_back_rank, white_rook);
set_piece(700, white_back_rank, white_rook);
set_piece(100, white_back_rank, white_bishop);
set_piece(600, white_back_rank, white_bishop);
set_piece(200, white_back_rank, white_knight);
set_piece(500, white_back_rank, white_knight);
for (let x = 0; x < 8; x++) {
    set_piece(x * 100, Math.abs(white_back_rank - 100), white_pawn);
}
set_piece(400, black_back_rank, black_king);
set_piece(300, black_back_rank, black_queen);
set_piece(0, black_back_rank, black_rook);
set_piece(700, black_back_rank, black_rook);
set_piece(100, black_back_rank, black_bishop);
set_piece(600, black_back_rank, black_bishop);
set_piece(200, black_back_rank, black_knight);
set_piece(500, black_back_rank, black_knight);
for (let x = 0; x < 8; x++) {
    set_piece(x * 100, Math.abs(black_back_rank - 100), black_pawn);
}

let drag_piece = (event) => {
    if (selected_piece != null) {
        pt.x = event.clientX;
        pt.y = event.clientY;
        let cursor = pt.matrixTransform(board.getScreenCTM().inverse());
        selected_piece.setAttribute('x', cursor.x - 50);
        selected_piece.setAttribute('y', cursor.y - 50);
    }
}

board.addEventListener('mousemove', e => {drag_piece(e)});