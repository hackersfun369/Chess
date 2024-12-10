
  let board =null;
  const game = new Chess();
  const moveHistory = document.getElementById('move-history');
  let moveCount = 1;
  let userColor = 'w';

  const audio = document.querySelector(".audio");
  const container = document.querySelector(".container");
  const makeRandomMove=()=>{
    const possibleMoves = game.moves();
    console.log(possibleMoves);
    audio.play();
    startTimer();

    if(game.game_over()){
      endGame();
      document.getElementById("slide1").checked = false;
      document.getElementById("slide3").checked = true;
      window.scrollTo(0, 0);
    }
    else{
      const randomIdx = Math.floor(Math.random()*possibleMoves.length);
      const move = possibleMoves[randomIdx];
      game.move(move);
      board.position(game.fen());
      recordMove(move,moveCount);
      moveCount++;
    }
  };

  const recordMove = (move,count)=>{
    const formattedMove = count%2 === 1?`${Math.ceil(count/2)}.${move}`:`${move}`;
    moveHistory.textContent += formattedMove + ' ';
    moveHistory.scrollTop = moveHistory.scrollHeight;
  }

  const onDragStart = (source,piece)=>{
    return !game.game_over() && piece.search(userColor) === 0;
  }
  const onDrop = (source,target)=>{
    audio.play();
   const move = game.move({
    from: source,
    to: target,
    promotion: 'q',
   })

    console.log(move);
  
  if(move === null) return 'snapback';
  window.setTimeout(makeRandomMove, 250);
  recordMove(move.san, moveCount);
  moveCount++;
  }

  const onSnapEnd = ()=>{
    board.position(game.fen());
  }

  
  const boardConfig = {
    showNotation: true,
    draggable: true,
    position: 'start',
    onDragStart,
    onDrop,
    onSnapEnd,
    moveSpeed: 'fast',
    snapBackSpeed: 500,
    snapSpeed: 100,
};

// Initialize the chessboard
board = Chessboard('board', boardConfig);

document.querySelector('.play-again').addEventListener('click', () => {
  game.reset();
  board.start();
  moveHistory.textContent = '';
  moveCount = 1;
  userColor = 'w';
});


document.querySelector('.flip-board').addEventListener('click', () => {
  board.flip();
  makeRandomMove();
  userColor = userColor === 'w' ? 'b' : 'w';
});

let hour = 0;
let minute = 0;
let second = 0;
let interval;

document.getElementById('start').onclick = startTimer;
document.getElementById('pause').onclick = pauseTimer;
document.getElementById('reset').onclick = resetTimer;

function startTimer() {
    clearInterval(interval);
    interval = setInterval(() => {
        second++;
        if (second === 60) {
            second = 0;
            minute++;
            if (minute === 60) {
                minute = 0;
                hour++;
            }
        }
        displayTime();
    }, 1000);
}

function pauseTimer() {
    clearInterval(interval);
}

function resetTimer() {
    clearInterval(interval);
    hour = minute = second = 0;
    displayTime();
}

function endGame() {
  if(game.game_over()){
    document.getElementById("resultH2").innerHTML = "You won the gamee!";
    document.getElementById("resultH2").style.color = "green";
  }
  else{
    document.getElementById("resultH2").innerHTML = "You lost the game!";
    document.getElementById("resultH2").style.color = "red";
  }
  game.reset();
  board.start();
  moveHistory.textContent = '';
  moveCount = 1;
  userColor = 'w';
  window.scrollTo(0,0);
  const formattedHour = String(hour).padStart(2, '0');
  const formattedMinute = String(minute).padStart(2, '0');
  const formattedSecond = String(second).padStart(2, '0');
  
  document.getElementById('totalTime').innerText = `${formattedHour}:${formattedMinute}:${formattedSecond}`;
  resetTimer();
}

function displayTime() {
    const formattedHour = String(hour).padStart(2, '0');
    const formattedMinute = String(minute).padStart(2, '0');
    const formattedSecond = String(second).padStart(2, '0');
    
    document.getElementById('display').innerText = `${formattedHour}:${formattedMinute}:${formattedSecond}`;
}

