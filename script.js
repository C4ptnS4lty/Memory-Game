const start = document.getElementById("start");
const restart = document.getElementById("restart");
const displayrRecord = document.getElementById("record");
const displayTime = document.getElementById("time");
const gameContainer = document.getElementById("game");


let card1;
let card2;
let time = 0;
let timesUp;
let done;
let record = JSON.parse(localStorage.getItem('record')) || 'No record';
displayrRecord.innerText = `Fastest Time: ${record} seconds`;
let play = false;


const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];



// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors;

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!
function handleCardClick(event) {
  // you can use event.target to see which element was clicked
  console.log("you just clicked", event.target);
if (play) {
  if (card1 != null) {
    card2 = event.target;
    event.target.style.backgroundColor = card2.getAttribute('class');
    card2.removeEventListener("click", handleCardClick);

    //Stops handler from executing code on click until timeout and cards are processed.
    //This is to prevent more than 2 cards being flipped before checking.
    play = false;

    setTimeout(function() {
      if(card1.getAttribute('class') == card2.getAttribute('class')) {
        //cards are confirmed to match and so no eventlisteners will be reinitialized.
        console.log(card1.getAttribute('class') + ' matches ' + card2.getAttribute('class'));
        done -= 2;
      } else {
        console.log(card1.getAttribute('class') + ' does not match ' + card2.getAttribute('class'));
        //reset cards to default appearance and hide faces.
        card1.style.backgroundColor = 'white';
        card2.style.backgroundColor = 'white';
        //reinitialize event listeners as cards have been confirmed to not match.
        card1.addEventListener("click", handleCardClick);
        card2.addEventListener("click", handleCardClick);
      }
      //Remove tracking cards for storage of a new pair.
      card1 = null;
      card2 = null;
      //resumes play if all cards have not been flipped over.
      if (done != 0){
        play = true;
      } else {
        //Implement for score storage.
        clearInterval(timesUp);
        if (time < record) {
          record = time;
          displayrRecord.innerText = `Fastest Time: ${record} seconds`;
          localStorage.setItem('record', JSON.stringify(record));
        }
        
        time = 0;
      }
    }, 1000);

  } else {
    
    card1 = event.target;
    event.target.style.backgroundColor = card1.getAttribute('class');

    //Removes listener event so card cannot be clicked twice for false positive.
    card1.removeEventListener("click", handleCardClick);

    console.log(`Card: ` + card1.getAttribute('class'));

  }
}
}

function timeKeeper () {
  timesUp = setInterval(function() {
    time++;
    displayTime.innerText = `Current Time: ${time} seconds`;
  },1000)
}

// when the DOM loads
start.addEventListener('click', function(){
  if(!play) {
    gameContainer.innerHTML = "";
    play = true;
    done = COLORS.length;
    shuffledColors = shuffle(COLORS);
    createDivsForColors(shuffledColors);
    timeKeeper();
  }
}
);

restart.addEventListener('click', function(){
  gameContainer.innerHTML = "";
  play = true;
  time = 0;
  displayTime.innerText = `Current Time: ${time} seconds`;
  done = COLORS.length;
  clearInterval(timesUp);

  shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
  timeKeeper();
}
);
