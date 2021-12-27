document.addEventListener("DOMContentLoaded", function () {


    /*    Class names for each position
        
          left top  |  center top   |   right top
    
        left middle | center middle |   right middle
    
        left bottom | center bottom |   right bottom        */

    const pieces = {
        leftTop: document.querySelector("#left__top"),
        centerTop: document.querySelector("#center__top"),
        rightTop: document.querySelector("#right__top"),
        leftMiddle: document.querySelector("#left__middle"),
        centerMiddle: document.querySelector("#center__middle"),
        rightMiddle: document.querySelector("#right__middle"),
        // leftBottom: document.querySelector("#left__bottom"), this one is the missing piece
        centerBottom: document.querySelector("#center__bottom"),
        rightBottom: document.querySelector("#right__bottom")
    };

    const btnShuffle = document.querySelector("#btn__shuffle");

    let freePlace = "left bottom";
    let allPositions = ["left top", "center top", "right top", "left middle", "center middle", "right middle", "left bottom", "center bottom", "right bottom"];

    function shuffleArray(array) {
        let currentIndex = array.length;
        let randomIndex;

        while (currentIndex != 0) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

    };

    function setColor(piece){
        if (piece.id.replace("__", " ") !== piece.className) {
            piece.style.border = ".5px solid rgb(202, 11, 11)";
            piece.style.boxShadow = "rgb(202, 11, 11) 0px 3px 8px";
        }else{
            piece.style.border = ".5px solid rgb(1, 4, 194)";
            piece.style.boxShadow = "rgb(74, 25, 250) 0px 3px 8px";
        }
    }
    
    function startingColors(){

        Object.entries(pieces).forEach((piece) => {
            setColor(piece[1]);
        });

    }

    function shuffleBoard() {

        shuffleArray(allPositions);
        freePlace = allPositions[0];
        let i = 1;

        Object.entries(pieces).forEach(async (piece) => {
            //piece -> [entry-name, respective-div]
            piece[1].className = allPositions[i];
            i++;
        });

        startingColors();
    };

    btnShuffle.addEventListener("click", shuffleBoard);

    function checkMovebility(piece) {

        let piecePosition = piece.className;

        //prevent middle pieces from moving diagonally
        if (!freePlace.includes("center") && !freePlace.includes("middle") && piecePosition == "center middle") return false;
        if (!piecePosition.includes("center") && !piecePosition.includes("middle") && freePlace == "center middle") return false;

        //prevent the middle pieces from moving diagonally
        const middlePieces = ["center top", "right middle", "center bottom", "left middle"];
        if (middlePieces.includes(piecePosition) && middlePieces.includes(freePlace)) return false;

        //prevent pieces non-neighbors of the free place from moving 
        let horizontally = false;

        if (piecePosition.includes("left")) {
            horizontally = freePlace.includes("left") || freePlace.includes("center") ? true : false;
        } else if (piecePosition.includes("center")) {
            horizontally = true;
        } else {
            horizontally = freePlace.includes("center") || freePlace.includes("right") ? true : false;
        }

        // ----------------------------------------------------------------------------------------------

        let vertically = false;

        if (piecePosition.includes("top")) {
            vertically = freePlace.includes("top") || freePlace.includes("middle") ? true : false;
        } else if (piecePosition.includes("middle")) {
            vertically = true;
        } else {
            vertically = freePlace.includes("middle") || freePlace.includes("bottom") ? true : false;
        }

        return (horizontally && vertically);
    }

    function checkFinished() {
        let finished = true;

        Object.entries(pieces).forEach((piece) => {
            p = piece[1];
            if (p.id.replace("__", " ") !== p.className) {
                finished = false;
            }
        });

        return finished;
    }

    function move(piece) {

        if (checkMovebility(piece)) {
            let temp = piece.className;
            piece.className = freePlace;
            freePlace = temp;

            setColor(piece);

            console.log(checkFinished());
        }
    }

    Object.entries(pieces).forEach((piece) => {
        piece[1].addEventListener("click", event => move(event.target.parentNode));
    });


});