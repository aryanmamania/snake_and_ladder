const n = 10;

let rollingSound = new Audio('assets/dice-142528.mp3');
let snakebitingsound = new Audio('assets/Snake Strike - QuickSounds.com.mp3')
let ladderClimb = new Audio('assets/Crowd Reactions Small Group Yeah  Happy - QuickSounds.com.mp3')
let winnerSound = new Audio('assets/mixkit-conference-audience-clapping-strongly-476.wav')

const matrixArray = [];

const ladderMap = {
    3: ["I question everything!", 22],
    7: ["I am regular and punctual!", 31],
    24: ["I work proactively!", 44],
    35: ["I work on the feedback given!", 80],
    43: ["I completed my 6 tasks on time!", 65],
    51: ["I participated in sessions!", 75],
    60: ["I mastered the BDD!", 87],
    67: ["I solved an allemp query!", 81],
};

const snakeMap = {
    16: ["I came late to work!", 4],
    39: ["It’s 10 am! I have not sent a leave application!", 19],
    48: ["My email has typos and errors!", 29],
    63: ["I did not cc Daily Interns Reporting!", 23],
    69: ["I missed my deadline!", 33],
    85: ["I was stuck but didn’t ask on allemp!", 47],
    88: ["I completed the task but did not submit it!", 28],
    99: ["Bad quality of work!", 20],
};

const winnerMap= {
    100: ["Congratualtions", 100]
};

const LADDER_CLASS = "ladder";
const SNAKE_CLASS = "snake";
const Winner_CLASS = "winner"


function createMatrix() {
    let block = n * n + 1;
    for (let column = 1; column <= n; column++) {
        let rows = [];
        if (column % 2 === 0) {
            block = block - n;
            let value = block;
            for (let row = 1; row <= n; row++) {
                rows.push(value);
                value++;
            }
        } else {
            for (let row = 1; row <= n; row++) {
                block = block - 1;
                rows.push(block);
            }
        }
        matrixArray.push(rows);
    }
    createBoard(matrixArray);
}

function createBoard(matrixArray) {
    const board = document.querySelector(".main-board");
    let str = "";
    matrixArray.map((row) => {
        str += `<div class="row">`;
        row.map((block) => {
            str += `
                    <div class="block ${ladderMap[block] ? LADDER_CLASS : ""} ${
                        snakeMap[block] ? SNAKE_CLASS : ""
                    } ${winnerMap[block] ? Winner_CLASS: ""} ${block === 1 ? "active" : ""} " data-value=${block}>
                    ${block}
                    </div>
                `;
        });
        str += `</div>`;
    });
    board.innerHTML = str;
}



function roll() {
    const dice = document.querySelector("img");
    rollingSound.play();
    dice.classList.add("rolling");

    setTimeout(() => {
        dice.classList.remove("rolling");
        const diceValue = Math.ceil(Math.random() * 6);
        document.querySelector("#dice-id").setAttribute("src", `assets/dice${diceValue}.png`);
        changeCurrentPosition(diceValue);
    }, 1000);
}

function changeCurrentPosition(diceValue) {
    const activeBlock = document.querySelector(".active");
    const activeBlockValue = parseInt(activeBlock.outerText);
    let presentValue = diceValue + activeBlockValue;

    function playLadderSound() {
     ladderClimb.play()   // Function to play ladder sound (removed for simplicity)
    }

    function playSnakeSound() {
        snakebitingsound.play();   // Function to play snake sound (removed for simplicity)
    }

    if (ladderMap[presentValue]) {
        playLadderSound();
        Swal.fire({
            title: "Progress!",
            html: `${ladderMap[presentValue][0].replace(/\n/g, "<br> <br>")} <br> <br> <b> I've moved up to: ${ladderMap[presentValue][1]} </b>`,
            confirmButtonText: "OK",
        });
        presentValue = ladderMap[presentValue][1];
    }

    if (snakeMap[presentValue]) {
        playSnakeSound();
        Swal.fire({
            title: "Regress!",
            html: `${snakeMap[presentValue][0].replace(/\n/g, "<br> <br>")}<br> <br> <b> I've gone down to: ${snakeMap[presentValue][1]} </b>`,
            confirmButtonText: "OK",
        });
        presentValue = snakeMap[presentValue][1];
    }

    if (presentValue <= n * n) {
        changeActiveClass(presentValue); 
    }

    if (isGameComplete()) {
        presentValue = isGameComplete;
        Swal.fire({
            title: "Congratulations!",
            text: "🚀You have successfully completed InternShip!🏆🌟",
            icon: "success ",
            confirmButtonText: "PlayAgain",
            imageUrl: "assets/cong.webp",
            imageAlt: "Image",
        }).then((result) => {
            if (result.isConfirmed) {
                redirect();
            }
        });
    }
}

function redirect() {
    window.location.replace("./index.html");
}


function changeActiveClass(presentValue) {
    const activeBlock = document.querySelector(".active");
    activeBlock.classList.remove("active");
    const block = document.querySelector(`[data-value="${presentValue}"]`);
    block.classList.add("active");
   
} 




function isGameComplete() {
    const activeBlock = document.querySelector(".active");
    const lastBlock = document.querySelector(`[data-value="${n * n}"]`);
    lastBlock.setAttribute("src", "assets/ladder.png");

    if (activeBlock === lastBlock) {
        // Play the winner sound
        playWinnerSound();
        return true;
    }
    return false;
}

function playWinnerSound() {

    winnerSound.play();
}


document.addEventListener("mousemove", highlightBlock);

const highlightPositions = {
    3: 22,
    7: 31,
    24: 44,
    35: 80,
    43: 65,
    51: 75,
    60: 87,
    67: 81,
};

function highlightBlock(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    for (const position in highlightPositions) {
        const block = document.querySelector(`[data-value="${position}"]`);
        const blockRect = block.getBoundingClientRect();

        if (
            mouseX >= blockRect.left &&
            mouseX <= blockRect.right &&
            mouseY >= blockRect.top &&
            mouseY <= blockRect.bottom
        ) {
            const targetBlock = document.querySelector(
                `[data-value="${highlightPositions[position]}"]`
            );
            if (targetBlock) {
                targetBlock.style.backgroundColor = "";
            }
        }
    }
}

document.getElementById("quitButton").addEventListener("click", quitGame);

function quitGame() {
    //window.location.replace("/");
    window.close();
}


