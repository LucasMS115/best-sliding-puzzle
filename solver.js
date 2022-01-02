import checkMovebility from "./checkMovebility.js";

//to do: get this board from the "real board" state
let initialBoard = [[{ piece: { x: 0, y: 1 }, distance: 0 }, { piece: { x: 1, y: 1 }, distance: 0 }, { piece: { x: 0, y: 0 }, distance: 0 }],
[{ piece: { x: 2, y: 1 }, distance: 0 }, { piece: { x: 1, y: 2 }, distance: 0 }, { piece: null, distance: 0 }],
[{ piece: { x: 0, y: 2 }, distance: 0 }, { piece: { x: 1, y: 0 }, distance: 0 }, { piece: { x: 2, y: 0 }, distance: 0 }]];

//to do: change this to visited boards
let visitedNodes = [];

//src: https://stackoverflow.com/questions/42919469/efficient-way-to-implement-priority-queue-in-javascript
const top = 0;
const parent = i => ((i + 1) >>> 1) - 1;
const left = i => (i << 1) + 1;
const right = i => (i + 1) << 1;
class PriorityQueue {

    constructor(comparator = (a, b) => a > b) {
        this._heap = [];
        this._comparator = comparator;
    }
    size() {
        return this._heap.length;
    }
    isEmpty() {
        return this.size() == 0;
    }
    peek() {
        return this._heap[top];
    }
    push(...values) {
        values.forEach(value => {
            this._heap.push(value);
            this._siftUp();
        });
        return this.size();
    }
    pop() {
        const poppedValue = this.peek();
        const bottom = this.size() - 1;
        if (bottom > top) {
            this._swap(top, bottom);
        }
        this._heap.pop();
        this._siftDown();
        return poppedValue;
    }
    replace(value) {
        const replacedValue = this.peek();
        this._heap[top] = value;
        this._siftDown();
        return replacedValue;
    }
    _greater(i, j) {
        return this._comparator(this._heap[i], this._heap[j]);
    }
    _swap(i, j) {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
    }
    _siftUp() {
        let node = this.size() - 1;
        while (node > top && this._greater(node, parent(node))) {
            this._swap(node, parent(node));
            node = parent(node);
        }
    }
    _siftDown() {
        let node = top;
        while (
            (left(node) < this.size() && this._greater(left(node), node)) ||
            (right(node) < this.size() && this._greater(right(node), node))
        ) {
            let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
            this._swap(node, maxChild);
            node = maxChild;
        }
    }
}

function calcDistance(currentPosition, rightPosition) {
    return Math.sqrt(Math.pow((currentPosition.x - rightPosition.x), 2))
        + Math.sqrt(Math.pow((currentPosition.y - rightPosition.y), 2));
}

function setDistances(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (board[i][j].piece !== null) board[i][j].distance = calcDistance({ x: i, y: j }, board[i][j].piece);
        }
    }
}

function calcFullDistance(board) {
    let fullDistance = 0;
    for (let i = 0; i < board[0].length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (board[i][j].piece !== null) fullDistance += board[i][j].distance;
        }
    }

    return fullDistance;
}

function pieceStringToCoordinates(piece) {

    let x = piece.split(" ")[0];
    let y = piece.split(" ")[1];

    switch (x) {
        case 'left':
            x = 0;
            break;
        case 'center':
            x = 1;
            break;
        default:
            x = 2;
    }

    switch (y) {
        case 'top':
            y = 0;
            break;
        case 'middle':
            y = 1;
            break;
        default:
            y = 2;
    }

    return { x: x, y: y };
}

function pieceCoordinatesToString(piece) {

    let x, y;

    switch (piece.x) {
        case 0:
            x = "left";
            break;
        case 1:
            x = "center";
            break;
        default:
            x = "right";
    }

    switch (piece.y) {
        case 0:
            y = "top";
            break;
        case 1:
            y = "middle";
            break;
        default:
            y = "bottom";
    }

    return `${x} ${y}`;
}

//to do: optimize this function
function checkVisitedNode(board) {

    for (let visIndex = 0; visIndex < visitedNodes.length; visIndex++) {

        let visited = visitedNodes[visIndex];
        let wasVisited = true;

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {

                if (visited[i][j].piece === null && board[i][j].piece === null) continue
                else if (visited[i][j].piece === null || board[i][j].piece === null) {
                    wasVisited = false;
                    break;
                } else if ((visited[i][j].piece.x !== board[i][j].piece.x) || visited[i][j].piece.y !== board[i][j].piece.y) {
                    wasVisited = false;
                    break;
                }
            }
        }

        if (wasVisited) return true;
    }

    return false;
}

function printBoard(board) {
    for (let i = 0; i < board.length; i++) {
        let line = " | "
        for (let j = 0; j < board[0].length; j++) {
            let piece = board[i][j].piece;
            if (piece !== null) line += `(${piece.x},${piece.y}) |`
            else line += "(_,_) |"
        }
        console.log(line);
    }
}

class Node {

    constructor(board, freePlace, fullDistance, path) {
        this.board = board;
        this.fullDistance = fullDistance;
        this.lineEnd = false;
        this.path = path;
        this.freePlace = freePlace;
    }

    getMoveblePieces() {
        let res = [];

        for (let i = 0; i < this.board[0].length; i++) {
            for (let j = 0; j < this.board.length; j++) {
                let piece = { x: i, y: j };
                if (piece !== this.freePlace && checkMovebility(pieceCoordinatesToString(piece), pieceCoordinatesToString(this.freePlace)))
                    res.push(piece);
            }
        }

        return res;
    }

    swapPiece(piece) {

        let newBoard = this.board.map(function (arr) {
            return arr.slice();
        });

        newBoard[this.freePlace.x][this.freePlace.y] = newBoard[piece.x][piece.y];
        newBoard[piece.x][piece.y] = { piece: null, distance: 0 }

        setDistances(newBoard);

        return { newBoard: newBoard, newFreePlace: piece, newFullDistance: calcFullDistance(newBoard) }

    }

    getPossibleBoards() {
        const moveblePieces = this.getMoveblePieces();
        const possibleBoards = moveblePieces.map(piece => {
            return this.swapPiece(piece);
        });
        possibleBoards.forEach(pb => {
            setDistances(pb.newBoard);
        });

        return possibleBoards;
    }

}

function solvePuzzle(initialBoard) {
    const nextNodesQueue = new PriorityQueue((node1, node2) => node1.fullDistance < node2.fullDistance);
    setDistances(initialBoard);
    let currentNode = new Node(initialBoard, { x: 1, y: 2 }, calcFullDistance(initialBoard), "");

    // for(let i = 0; i < 10000; i++){
    while (currentNode.fullDistance !== 0) {

        visitedNodes.push(currentNode.board);
        const possibleBoards = currentNode.getPossibleBoards();
        const possibleNodes = possibleBoards.map(pb => {
            return new Node(pb.newBoard, pb.newFreePlace, pb.newFullDistance, "");
        });

        nextNodesQueue.push(...possibleNodes);
        currentNode = nextNodesQueue.pop();
        while (checkVisitedNode(currentNode.board)) {
            currentNode = nextNodesQueue.pop();
        }
    }

    printBoard(currentNode.board);
    //translate current node's path to class names 
    //return te path
}

solvePuzzle(initialBoard);




