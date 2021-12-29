//const missingPiece = piece

//map = { piece => position}

//initial state => object of pieces translated using the map

//import function that tells the possible movements

let board = [ [{piece: {x: 0, y: 1}, distance: 0}, {piece: {x:1, y:1}, distance: 0}, {piece: {x: 0, y: 0}, distance: 0}],
              [{piece: {x:2, y: 1}, distance: 0}, {piece: {x: 1, y: 2}, distance: 0},{piece: null, distance: 0} ],
              [{piece: {x: 0, y: 2}, distance: 0},{piece: {x: 1, y: 0}, distance: 0},{piece: {x: 2, y: 0}, distance: 0}]];

function calcDistance(currentPosition, rightPosition){
    return Math.sqrt(Math.pow( (currentPosition.x - rightPosition.x), 2))
     + Math.sqrt(Math.pow((currentPosition.y - rightPosition.y), 2 ));
}

function setDistances(board){
    for(let i = 0; i < board[0].length; i++){
        for(let j = 0; j < board[0].length; j++){
            if(board[i][j].piece !== null) board[i][j].distance = calcDistance({x: i, y: j}, board[i][j].piece);
        }
    }
}

function calcFullDistance(board){
    let fullDistance = 0;
    for(let i = 0; i < board[0].length; i++){
        for(let j = 0; j < board[0].length; j++){
            if(board[i][j].piece !== null) distance += board[i][j].distance;
        }
    }

    return fullDistance;
}

function checkVisitedNodes(){
    //check the visited nodes at the knowledge bank
}

class Node{
    
    constructor(board, freePlace, path){
        this.fullDistance = calcFullDistance(board);
        this.lineEnd = false;
        this.path = path;
        this.freePlace = freePlace;
    }

    createChild(){
        //calc next possible boards (check wich pieces can be swapped, create a board for each possibility swapping the piece with the free space)
        //select the board with the minimum distance
        //create child node
        //update knowledge bank
        //return node
    }
    
}

function solvePuzzle(initialState){
    //create first node
    //loop until full distance = 0
        //create next node, 
    //
    //translate current node's path to class names 
    //return te path
}
