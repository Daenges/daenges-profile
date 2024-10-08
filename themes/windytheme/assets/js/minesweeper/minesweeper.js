// Game Settings
var fieldEdgeSize = 16;
var mineCount = Math.floor((fieldEdgeSize**2)*0.16);
var flagCounter = mineCount
var revealedCounter = 0;
var currentTime = 0;
var timerInterval;
var gameboard = [];
var gameLost = false;
var endscreen = false;

// Get the html elements
const gameboardHtml = document.getElementById("gameboard");
const leftDisplayHtml = document.getElementById("left-display");
const rightDisplayHtml = document.getElementById("right-display");
const emojiDisplayHtml = document.getElementById("game-status-emoji");
const hintButtonHtml = document.getElementById("hint-button-div");
const endScreenHtml = document.getElementById("endscreen");
const emoji = {
    HAPPY: "🙂",
    DEAD: "💀",
    COOL: "😎",
    OMOUTH: "😮"
}
const hiddenCellHtml = `{{- partial "minesweeper/cells/hiddencell.html" . -}}`;
const flaggedCellHtml = `{{- partial "minesweeper/cells/hiddencell.html" (dict "text" "🚩") -}}`;
const crossedCellHtml = `{{- partial "minesweeper/cells/hiddencell.html" (dict "text" "❌") -}}`;

class Cell {
    constructor (x, y, elem) {
        this.x = x;
        this.y = y;
        this.elem = elem;

        this.isMine = false;
        this.isRevealed = false;
        this.isFlagged=false;

        this.prepareElem()
    }

    reveal() {
        this.elem.click();
    }

    setMine() {
        this.isMine = true;
    }

    isMine() {
        return this.isMine;
    }

    prepareElem() {
        this.elem.addEventListener("click", (e) => { 
                // Prevent click on flagged
                if (this.isFlagged) {
                    if (!this.isMine && gameLost) {
                        this.elem.innerHTML = crossedCellHtml
                    }
                }
                // Reset game on clicked mine
                else if(!this.isRevealed) {
                    this.isRevealed = true;
                    revealedCounter++;

                    if (this.isMine) {
                        emojiDisplayHtml.textContent = emoji.DEAD;
                        this.elem.innerHTML = this.getRevealedHtml(-1);
                        

                        // Prevent message for clearing
                        if(!gameLost) {
                            gameLost = true;
                            toggleEndscreen();
                        }

                        gameboard.forEach(row => {row.forEach(cell =>{ cell.reveal(); })})
                    }
                    else {

                        // start timer on first click
                        if(revealedCounter === 1 && !gameLost) {
                            emojiDisplayHtml.textContent = emoji.OMOUTH;
                            hintButtonHtml.style.display = "none";
                            startTimer()
                        }

                        let mines = 0;

                        // count surrounding mines
                        let neighbors = this.getNeighbors()
                        neighbors.forEach(n => { if (n.isMine){mines++;} })

                        this.elem.innerHTML = this.getRevealedHtml(mines);

                        // reveal more cells if there are no surrounding mines
                        if (mines===0) {neighbors.forEach(n => {n.reveal()})}
                    }
                }


                // Player revealed all cells without a mine
                if((revealedCounter === (fieldEdgeSize**2 - mineCount)) && !gameLost) {
                    emojiDisplayHtml.textContent = emoji.COOL;
                    toggleEndscreen();
                }
            }
        );
        // Toggle flag and counter on right click
        this.elem.addEventListener("contextmenu", (e) => { 
                e.preventDefault();
                if (this.isFlagged) {
                    this.elem.innerHTML = hiddenCellHtml;
                    flagCounter++;
                    this.isFlagged = false;
                }
                else if(!gameLost && !this.isRevealed) {
                    this.elem.innerHTML = flaggedCellHtml;
                    flagCounter--;
                    this.isFlagged = true;
                }
                leftDisplayHtml.innerText = Math.max(0, flagCounter);
            }
        );
    }

    // returns existing surrounding cells
    getNeighbors() {
        let neighborList = []
        for(let i=-1; i<2; i++) {
            let checkY = this.y + i;
            if (checkY >= 0 && checkY < gameboard.length) {
                for(let j=-1; j<2; j++) {
                    let checkX = this.x + j;
                    if (checkX >= 0 && checkX < gameboard[checkY].length) {
                        neighborList.push(gameboard[checkY][checkX])
                    }
                }
            }
        }
        return neighborList;
    }

    getRevealedHtml(number) {
        let revealedCellHtml = `{{ partial "minesweeper/cells/revealedcell.html" }}`
        let color = ""
        switch (number) {
            case 1:
                color = "color: blue;";
                break;
            case 2:
                color = "color: green;";
                break;
            case 3:
                color = "color: red;";
                break;
            case 4:
                color = "color: darkblue;";
                break;
            case 5:
                color = "color: darkred;";
                break;
            case 6:
                color = "color: darkcyan;"
                break;
            case 7:
                color = "color: black;";
                break;
            case 8:
                color = "color: gray;";
                break;
            case -1:
                return revealedCellHtml.replace("##TC##", "").replace("##TEXT##", "💣");
            default:
                return revealedCellHtml.replace("##TC##", "").replace("##TEXT##", "");
        }

        return revealedCellHtml.replace("##TC##", color).replace("##TEXT##", number)
    }
}

// Implement random function for list access
function randInt(mn, mx) {
    return Math.floor(Math.random() * (mx - mn) + mn);
}

// select random cell that is not surrounded by mines and mark it as hint
function giveHint() {
    hintButtonHtml.style.display = "none";
    currentTime = 50;
    startTimer();
    let emptyCells = gameboard.flat().filter(cell => cell.getNeighbors().filter(n => n.isMine).length === 0);
    if (emptyCells.length > 0) { emptyCells[randInt(0, emptyCells.length)].elem.style.backgroundColor = 'darkgreen'; }
}

function toggleEndscreen() {
    var time = resetTimer();
    document.getElementById("endscreen-time").innerText = time;
    document.getElementById("endscreen-score").innerText = gameLost ? "/" : (1000 - time) * 2
    endScreenHtml.style.display = endscreen ?  "none" : "flex";
    endscreen = !endscreen;
}

// Game Startup
function initGame() {
    gameboard = [];
    gameboardHtml.innerHTML = ""
    flagCounter = mineCount;
    revealedCounter = 0;
    leftDisplayHtml.textContent = flagCounter;
    rightDisplayHtml.textContent = "000"
    emojiDisplayHtml.textContent = emoji.HAPPY;
    endScreenHtml.style.display = "none";
    hintButtonHtml.style.display = "block";
    endscreen = false;
    gameLost = false;
    resetTimer();
    timer = 0;

    // Fill the field list with bool values
    for(let y = 0; y < fieldEdgeSize; y++) {
        gameboard.push([]);
        for(let x = 0; x < fieldEdgeSize; x++) {
            let cellDiv = document.createElement('div');
            cellDiv.innerHTML = hiddenCellHtml;
            gameboard[y].push(new Cell(x, y, cellDiv, false));

            gameboardHtml.appendChild(cellDiv)
        }
    }

    // Select a certain percentage of the fields and place a bomb there
    for(let i = 0; i < mineCount; i++) {
        let x, y = 0;
        do {x = randInt(0, fieldEdgeSize); y = randInt(0, fieldEdgeSize);} while(gameboard[y][x].isMine);
        
        gameboard[y][x].setMine();

        // activate cheat mode
        //gameboard[y][x].elem.innerHTML = flaggedCellHtml;
    }
}

function startTimer() {
    if (timerInterval) {
      return;
    }
  
    timerInterval = setInterval(() => {
      if (currentTime < 999) {
        currentTime++;
        rightDisplayHtml.textContent = currentTime.toString().padStart(3, '0');
      }
    }, 1000);
  }

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    var temp = currentTime;
    currentTime = 0;
    rightDisplayHtml.textContent = currentTime.toString().padStart(3, '0');
    return temp;
}

registerCallOnLoad(initGame);