import checkMovebility from './checkMovebility.js';

document.addEventListener("DOMContentLoaded", function () {


    /*    Class names for each position
        
          left top  |  center top   |   right top
    
        left middle | center middle |   right middle
    
        left bottom | center bottom |   right bottom        */


    /*  DOM elements ------------------------------------------------------------*/

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
    const startModal = document.querySelector("#start__modal");
    const btnStart = document.querySelector("#btn__start");
    const chronometerNumber = document.querySelector("#chronometer__number");
    const movesNumber = document.querySelector("#moves__counter");

    /*  DOM elements ------------------------------------------------------------*/

    /* chronometer --------------------------------------------------------------*/
    /* src: https://codepen.io/vanessametonini/pen/GMWEBv */

    let hours = `00`,
        minutes = `00`,
        seconds = `00`,
        chronometerCall;

    function chronometer() {

        seconds++;

        if (seconds < 10) seconds = `0` + seconds;

        if (seconds > 59) {
            seconds = `00`;
            minutes++;

            if (minutes < 10) minutes = `0` + minutes;
        };

        if (minutes > 59) {
            minutes = `00`;
            hours++;

            if (hours < 10) hours = `0` + hours;
        }

        chronometerNumber.textContent = `${hours}:${minutes}:${seconds}`;

    }

    /* chronometer --------------------------------------------------------------*/

    let freePlace = "left bottom";
    let allPositions = ["left top", "center top", "right top", "left middle", "center middle", "right middle", "left bottom", "center bottom", "right bottom"];
    let movesCounter = 0;

    function updateMoveCounter() {
        movesCounter++;
        movesNumber.textContent = movesCounter;
    }

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

    function setColor(piece) {
        if (piece.id.replace("__", " ") !== piece.className) {
            piece.style.border = ".5px solid rgb(202, 11, 11)";
            piece.style.boxShadow = "rgb(202, 11, 11) 0px 3px 8px";
        } else {
            piece.style.border = ".5px solid rgb(1, 4, 194)";
            piece.style.boxShadow = "rgb(74, 25, 250) 0px 3px 8px";
        }
    }

    function startingColors() {

        Object.entries(pieces).forEach((piece) => {
            setColor(piece[1]);
        });

    }

    function shuffleBoard() {

        /* reseting move counter & timer */
        movesCounter = 0;
        movesNumber.textContent = movesCounter;

        clearInterval(chronometerCall);
        chronometerNumber.textContent = `00:00:00`;
        hours = `00`,
        minutes = `00`,
        seconds = `00`;
        chronometerCall = setInterval(chronometer, 1000);
        /* reseting move counter & timer */

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

        if (checkMovebility(piece.className, freePlace)) {
            let temp = piece.className;
            piece.className = freePlace;
            freePlace = temp;

            setColor(piece);

            updateMoveCounter();
        }
    }

    /* event listeners ---------------------------------------------------------------*/

    btnStart.addEventListener("click", () => {
        startModal.style.display = "none";
        btnShuffle.style.display = "block";
        shuffleBoard();
    });

    btnShuffle.addEventListener("click", shuffleBoard);

    Object.entries(pieces).forEach((piece) => {
        piece[1].addEventListener("click", event => move(event.target.parentNode));
    });

});
