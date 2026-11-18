/* ~~~~~~~~GLOBAL VARIABLES~~~~~~~~ */

var diffuculty = 0; // <---- "0" means no diffuculty selected. 1 = easy, 2 = med, 3 = hard.
var startButtonLock = true;
var gameOver = false; // stops the game from starting if End is clicked during the countdown

var fruitsCutPoints = []; // array storing data about how many points gained from each fruit
var points = 0;
var totalFruitsCut = 0; // variable storing the total amounts of fruits cut
var pointsValueWatermelon = 15; // declares baseline value of watermelon cut
var pointsValueCherries = 25;
var avgPoints = 0;
var highScore = 0; // checks score at games end. only updates if next score is higher

var watermelonSliced = false; // stops player from clicking invisible fruit
var cherriesSliced = false;
var bombSliced = false;
var bombsCut = 0; // counts how many bombs have been sliced. game ends at 10

var updateInterval = 8; // how often screen refreshes
var gameSpeed = 1; //variable declaring speed of fruits falling. 1 is baseline and is used for EZ diffuculty.
var pointsMultiplier = 1; //variable determining how many multiples of the fruit points are earned. 1.0 for EZ, 1.5 for MED, 2.0 for HARD.

var fruitX = 160; //sets starting X value for falling fruit
var fruitY = -100; //sets starting Y value for falling fruit
var fruit2X = 160; //sets starting X value for falling fruit
var fruit2Y = -100; //sets starting Y value for falling fruit
var directionOfFruit =0; //determines direction of falling fruit
var fallDirectionBomb = randomNumber(1,4);
var bombY = -100;
var bombX = 160;
var fruitType = ""; // sets type of fruit that will fall
var cherriesOrWatermelon = 1;
var isBombPresent = randomNumber(1,4);

playSound("assets/category_background/progression.mp3", false);
/* ~~~~~~~~ELEMENTS BELOW CONTROL GAME STARTING~~~~~~~~ */

onEvent("diffuculty_button_easy", "click", function( ) { //clicks EZ button
  diffuculty = 1; //EZ DIffuculty Selected
  playSound("assets/category_achievements/lighthearted_bonus_objective_1.mp3", false);
  setTimeout(function() {
    hideElement("diffuculty_button_easy");
    hideElement("diffuculty_button_medium");
    hideElement("diffuculty_button_hard");
    showElement("how_to_play");
  }, 600);
  setTimeout(function() { //sets delay so user reads instructions
    startButtonLock = false; //unlocks start button
  }, 800);
});
onEvent("diffuculty_button_medium", "click", function( ) { //clicks MED button
  diffuculty = 2; //MED DIffuculty Selected
  playSound("assets/category_achievements/melodic_win_2.mp3", false);
  setTimeout(function() {
    hideElement("diffuculty_button_easy");
    hideElement("diffuculty_button_medium");
    hideElement("diffuculty_button_hard");
    showElement("how_to_play");
  }, 600);
  setTimeout(function() { //sets delay so user reads instructions
    startButtonLock = false; //unlocks start button
  }, 800);
});
onEvent("diffuculty_button_hard", "click", function( ) { //clicks HARD button
  diffuculty = 3; //HARD DIffuculty Selected
  playSound("assets/category_achievements/melodic_win_2.mp3", false);
  setTimeout(function() {
    hideElement("diffuculty_button_easy");
    hideElement("diffuculty_button_medium");
    hideElement("diffuculty_button_hard");
    showElement("how_to_play");
  }, 600);
  setTimeout(function() { //sets delay so user reads instructions
    startButtonLock = false; //unlocks start button
  }, 800);
});
onEvent("start_button", "click", function( ) {
  if (startButtonLock == false){ // checks that user has selected diffuculty and read instructions
    stopSound("assets/category_background/progression.mp3");
    playSound("assets/category_achievements/puzzle_game_achievement_02.mp3", false);
    setScreen("gameplay_screen");

  }

});
onEvent("gameplay_start_button", "click", function( ) {
  gameOver = false;
  playSound("assets/category_achievements/puzzle_game_achievement_01.mp3", false);
  hideElement("gameplay_start_button");
  startCountdown(); // starts 3 second countdown
  setTimeout(function() {
    // waits 3 secs before executing rest of function
    if (gameOver == false) { // only starts if End wasn't clicked during the countdown
      hideElement("begin_dialog");
      runGame(diffuculty);
    }
  },3000);
});

function startCountdown(){ //countdown before startGame
  showElement("countdown_3");
  playSound("assets/category_male_voiceover/three_male.mp3", false);
  setTimeout(function() {
    hideElement("countdown_3");
    playSound("assets/category_male_voiceover/two_male.mp3", false);
    showElement("countdown_2");
    setTimeout(function() {
      hideElement("countdown_2");
      playSound("assets/category_male_voiceover/one_male.mp3", false);
      showElement("countdown_1");
      setTimeout(function() {
        hideElement("countdown_1");
        showElement("countdown_GO");
        playSound("assets/category_male_voiceover/go_male.mp3", false);
        playSound("assets/category_loops/faultering_desicion_loop1.mp3", true);
        setTimeout(function() {
          hideElement("countdown_GO");
        },1000);
      }, 1000);
    }, 1000);
  }, 1000);
}
function initializeGame(diffuculty) {
  //set up gameplay after ready button is pressed (goes inside startGame)
  if(diffuculty == 1) {
    gameSpeed = 1;          //easy diffuculty
    pointsMultiplier = 1.0;
  }else if(diffuculty == 2) {
    gameSpeed = 1.5;          // med diffuculty
    pointsMultiplier = 1.5;
  }else if(diffuculty == 3) {
    gameSpeed = 2.5;         // hard diffuculty
    pointsMultiplier = 2.0;
  }
  fruitX = randomNumber(0, 220); // sets random value for falling fruit (fruit width 100)
  fruitY = -100; //sets offscreen
  fruit2X = randomNumber(0, 220); // sets random value for falling fruit (fruit width 100)
  fruit2Y = -100; //sets offscreen
  pointsValueWatermelon = Math.round(15 * pointsMultiplier); // determines points based on diffuctulty
  pointsValueCherries = Math.round(25 * pointsMultiplier); // determines points based on diffuctulty
  setPosition("falling_fruit_1", fruitX, fruitY, 100, 100);
  setPosition("falling_fruit_2", fruit2X, fruit2Y, 100, 100);
  setPosition("falling_bomb_1", bombX, bombY, 100, 100);
  showElement("falling_fruit_1");
  showElement("falling_fruit_2");
  showElement("falling_bomb_1");


}

/* ~~~~~~~~ELEMENTS BELOW CONTROL GAMEPLAY~~~~~~~~ */
onEvent("falling_fruit_1", "mouseover", function(){
  // CONTINUE HERE TO START REGISTERING POINTS GAINED
  // MAKE FRUIT DISSAPEAR AFER
  givePoints("falling_fruit_1");
  playSound("assets/334238-liamg-sfx-sword-slice_ZaoAh76F.mp3", false);

});
onEvent("falling_fruit_2", "mouseover", function(){
  // CONTINUE HERE TO START REGISTERING POINTS GAINED
  // MAKE FRUIT DISSAPEAR AFER
  givePoints("falling_fruit_2");
  playSound("assets/334238-liamg-sfx-sword-slice_ZaoAh76F.mp3", false);
});
onEvent("falling_bomb_1", "mouseover", function(){
  // CONTINUE HERE TO START REGISTERING POINTS GAINED
  // MAKE FRUIT DISSAPEAR AFER
  givePoints("falling_bomb_1");
  playSound("assets/category_explosion/radioactive_zombie_explode_2.mp3", false);

});
onEvent("falling_fruit_1", "click", function(){
  // CONTINUE HERE TO START REGISTERING POINTS GAINED
  // MAKE FRUIT DISSAPEAR AFER
  givePoints("falling_fruit_1");
  playSound("assets/334238-liamg-sfx-sword-slice_ZaoAh76F.mp3", false);

});
onEvent("falling_fruit_2", "click", function(){
  // CONTINUE HERE TO START REGISTERING POINTS GAINED
  // MAKE FRUIT DISSAPEAR AFER
  givePoints("falling_fruit_2");
  playSound("assets/334238-liamg-sfx-sword-slice_ZaoAh76F.mp3", false);
});
onEvent("falling_bomb_1", "click", function(){
  // CONTINUE HERE TO START REGISTERING POINTS GAINED
  // MAKE FRUIT DISSAPEAR AFER
  givePoints("falling_bomb_1");
  playSound("assets/category_explosion/radioactive_zombie_explode_2.mp3", false);

});

function runGame(diffuculty){
  //gets game running once "ready" button is pressed.
  stopTimedLoop(); // makes sure an old game's loops can never run at the same time as this one
  initializeGame(diffuculty);
  updateInterval = 8 * (1/gameSpeed); //makes game faster according to diffuculty
  directionOfFruit = randomNumber(1,4);
  fallDirectionBomb = randomNumber(1,3);
  resetFruitPosition();
  resetBombPosition();
  setNewDirection();
  setNewDirectionBomb();
  timedLoop(updateInterval, function() {
    if (cherriesOrWatermelon == 1 ){ // decides type of fruit falling
      fruitType = "Cherries"; //decides type of falling fruit
      hideElement("falling_fruit_1");
      if(cherriesSliced == false){
        showElement("falling_fruit_2");
      }
    }else{
      fruitType = "Watermelon";
      hideElement("falling_fruit_2");
      if(watermelonSliced == false){
        showElement("falling_fruit_1");
      }

    }
    fallDownOrUp(directionOfFruit, fruitType); //controls up/down motion
    fallLeftOrRight(directionOfFruit, fruitType); //controls left/right motion
  });
  timedLoop(updateInterval, function(){
    addBomb(fallDirectionBomb);
  }); // trying to get bomb to only fall 1/4 of the time
}

onEvent("end_button", "click", function (){
  endGame();
});

function endGame(){ // ends the game (used by the End button and when 10 bombs are sliced)
  stopTimedLoop(); // stops the game first
  gameOver = true;
  
  stopSound("assets/category_loops/faultering_desicion_loop1.mp3");
  playSound("assets/category_music/game_over_2.mp3", false);
  setTimeout(function() {
    playSound("assets/category_background/repitition.mp3", false);
  }, 3000);
  setScreen("game_over_screen");
  checkHighScore();
  
  caculateStats();
}

onEvent("restart_bttn", "click", function () { // button on the game over screen
  resetGame();
  setScreen("start_menu"); // back to the diffuculty selection
  playSound("assets/category_achievements/melodic_win_2.mp3", false);
  stopSound("assets/category_background/repitition.mp3");
  playSound("assets/category_background/progression.mp3", false);

});

/* ~~~~~~~~ELEMENTS BELOW MANAGE BACKEND~~~~~~~~ */

function addBomb(fallDirectionBomb){
  if (fallDirectionBomb == 1) { // 1 = bomb falling
    bombY = bombY + gameSpeed/2;
    setProperty("falling_bomb_1", "y", bombY);
    if (bombY >= 450) { // bomb at bottom
      setNewDirectionBomb();
      bombSliced = false;
    }
  }else if (fallDirectionBomb == 2) { // 2 = bomb rising
    bombY = bombY - gameSpeed;
    setProperty("falling_bomb_1", "y", bombY);
    if (bombY <= -100) { // bomp at top
      setNewDirectionBomb();
      bombSliced = false;
    }
  }else if (fallDirectionBomb ==3){ // 3 = bomb from left
    bombX = bombX + gameSpeed;
    setProperty("falling_bomb_1", "x", bombX);
    if (bombX >= 420) { // bomb at right
      setNewDirectionBomb();
      bombSliced = false;
    }
  }else if (fallDirectionBomb == 4){ //4 = bomb from right
    bombX = bombX - gameSpeed;
    setProperty("falling_bomb_1", "x", bombX);
    if (bombX <= -100) { // bomb at right
      setNewDirectionBomb();
      bombSliced = false;
    }
  }
}
function fallDownOrUp(directionOfFruit, typeOfFruit){
  if(typeOfFruit == "Watermelon"){
    if (directionOfFruit == 1) { // 1 = fruit falling
      fruitY = fruitY + gameSpeed;
      setProperty("falling_fruit_1", "y", fruitY);
      if (fruitY >= 450) { // fruit at bottom
        setNewDirection();
        cherriesOrWatermelon = randomNumber(1,2);
        watermelonSliced= false;
      }
    }else if (directionOfFruit == 2) { // 2 = fruit rising
      fruitY = fruitY - gameSpeed;
      setProperty("falling_fruit_1", "y", fruitY);
      if (fruitY <= -100) { // fruit at top
        setNewDirection();
        cherriesOrWatermelon = randomNumber(1,2);
        watermelonSliced= false;
      }
    }
  }else if(typeOfFruit == "Cherries"){
    if (directionOfFruit == 1) { // 1 = fruit falling
      fruit2Y = fruit2Y + gameSpeed;
      setProperty("falling_fruit_2", "y", fruit2Y);
      if (fruit2Y >= 450) { // fruit at bottom
        setNewDirection();
        cherriesOrWatermelon = randomNumber(1,2);
        cherriesSliced= false;
      }
    }else if (directionOfFruit == 2) { // 2 = fruit rising
      fruit2Y = fruit2Y - gameSpeed;
      setProperty("falling_fruit_2", "y", fruit2Y);
      if (fruit2Y <= -100) { // fruit at top
        setNewDirection();
        cherriesOrWatermelon = randomNumber(1,2);
        cherriesSliced= false;
      }
    }
  }

}
function fallLeftOrRight(directionOfFruit, typeOfFruit){
  if(typeOfFruit == "Watermelon"){
    if(directionOfFruit == 3){ // 3 = fruit from left
      fruitX = fruitX + gameSpeed;
      setProperty("falling_fruit_1", "x", fruitX);
      if (fruitX >= 420) { // fruit at right
        setNewDirection();
        cherriesOrWatermelon = randomNumber(1,2);
        watermelonSliced= false;
      }
    }else if (directionOfFruit == 4){ //4 = fruit from right
      fruitX = fruitX - gameSpeed;
      setProperty("falling_fruit_1", "x", fruitX);
      if (fruitX <= -100) {
        // 3 = fruit from left// fruit at right
        setNewDirection();
        cherriesOrWatermelon = randomNumber(1,2);
        watermelonSliced= false;
      }
    }
  }else if(typeOfFruit == "Cherries"){
    if(directionOfFruit == 3){
      fruit2X = fruit2X + gameSpeed;
      setProperty("falling_fruit_2", "x", fruit2X);
      if (fruit2X >= 420) { // fruit at right
        setNewDirection();
        cherriesOrWatermelon = randomNumber(1,2);
        cherriesSliced= false;
      }
    }else if (directionOfFruit == 4){ //4 = fruit from right
      fruit2X = fruit2X - gameSpeed;
      setProperty("falling_fruit_2", "x", fruit2X);
      if (fruit2X <= -100) { // fruit at right
        setNewDirection();
        cherriesOrWatermelon = randomNumber(1,2);
        cherriesSliced= false;
      }
    }
  }
}//change to match fallDownOrUp (work w cherries)
function resetFruitPosition(){
  if (directionOfFruit == 1) { // set at top
    fruitY = -100;
    fruitX = randomNumber(0, 220);
    fruit2Y = -100;
    fruit2X = randomNumber(0, 220);
  }else if (directionOfFruit == 2) { // set at bottom
    fruitY = 550;
    fruitX = randomNumber(0, 220);
    fruit2Y = 550;
    fruit2X = randomNumber(0, 220);
  }else if (directionOfFruit == 3) { // set at left side
    fruitX = -100;
    fruitY = randomNumber(0, 350);
    fruit2X = -100;
    fruit2Y = randomNumber(0, 350);
  }else if (directionOfFruit == 4) { // set at right side
    fruitX = 350;
    fruitY = randomNumber(0, 350);
    fruit2X = 350;
    fruit2Y = randomNumber(0, 350);
  }
  setProperty("falling_fruit_1", "x", fruitX);
  setProperty("falling_fruit_1", "y", fruitY);
  setProperty("falling_fruit_2", "x", fruit2X);
  setProperty("falling_fruit_2", "y", fruit2Y);
  showElement("falling_fruit_1");
  showElement("falling_fruit_2");
}
function resetBombPosition(){
  if (fallDirectionBomb == 1) { // set at top
    bombY = -100;
    bombX = randomNumber(0, 220);
  }else if (fallDirectionBomb == 2) { // set at bottom
    bombY = 550;
    bombX = randomNumber(0, 220);
  }else if (fallDirectionBomb == 3) { // set at left side
    bombX = -100;
    bombY = randomNumber(0, 350);
  }else if (fallDirectionBomb == 4) { // set at right side
    bombX = 350;
    bombY = randomNumber(0, 350);
  }
  setProperty("falling_bomb_1", "x", bombX);
  setProperty("falling_bomb_1", "y", bombY);
  bombSliced = false;
}
function setNewDirection(){
  directionOfFruit = randomNumber(1, 4);// change direction of fruit to be different for fruit1 v fruit2
  resetFruitPosition();
}
function setNewDirectionBomb(){
  fallDirectionBomb = randomNumber(1, 4);
  isBombPresent = randomNumber(1, 2);
  if (isBombPresent == 2) {
    showElement("falling_bomb_1");
  }else{
    hideElement("falling_bomb_1");
  }

  resetBombPosition();
}
function givePoints(fruitType){
  if (fruitType == "falling_bomb_1"){ // checks for the bomb first
    if (bombSliced == false){
      bombSliced = true;
      hideElement("falling_bomb_1");
      fruitsCutPoints.push(-50);
      points = points - 50;
      bombsCut++;
      if (bombsCut >= 10){ // game ends after 10 bombs
        endGame();
      }
    }
  }else if (fruitType == "falling_fruit_1"){
    if (watermelonSliced == false){
      fruitsCutPoints.push(pointsValueWatermelon);
      points = points + pointsValueWatermelon;
      totalFruitsCut++;
      setNewDirection(); // sends the next fruit right away instead of waiting for the sliced one to finish crossing
      cherriesOrWatermelon = randomNumber(1,2);
    }
  }else if (fruitType == "falling_fruit_2"){
    if (cherriesSliced == false){
      fruitsCutPoints.push(pointsValueCherries);
      points = points + pointsValueCherries;
      totalFruitsCut++;
      setNewDirection(); // sends the next fruit right away instead of waiting for the sliced one to finish crossing
      cherriesOrWatermelon = randomNumber(1,2);
    }
  }
  updateScoreLabels(); // updates labels every time, including after a bomb


} // IS ONLY GIVING POINTS THE FIRST TIME ?? DEBUG

function updateScoreLabels(){
  if(totalFruitsCut > 999){
    setProperty("fruitsCut_label", "font-size", 9);
  }
  if (points > 9999){
    setProperty("points_label", "font-size", 9);
  }
  setText("fruitsCut_label", "Fruits Cut: " + totalFruitsCut);
  setText("points_label", "Points: " + points);
}

function caculateStats() {
  var fruitTotal = 0; // local, so running this twice can't double it
  for(var i = 0; i<fruitsCutPoints.length; i++){
    if (fruitsCutPoints[i] > 0){ // counts fruit only, skips bomb penalties
      fruitTotal = fruitTotal + fruitsCutPoints[i];
    }
  }
  if (totalFruitsCut > 0){ // avoids dividing by 0
    avgPoints = Math.round(fruitTotal/totalFruitsCut);
  }else{
    avgPoints = 0;
  }
  setProperty("avg_pts" , "text", "Average points per slice: " + avgPoints);
  setProperty("total_pts" , "text", "Total Points: " + points);
  setProperty("fts_cut" , "text", "Total fruits cut:  " + totalFruitsCut);
  setProperty("highScore_lbl" , "text", "High Score:  " + highScore);
}
function resetGame() {
  stopTimedLoop();
  gameOver = true; // stays true until the player presses the gameplay start button again

  points = 0;
  totalFruitsCut = 0;
  fruitsCutPoints = [];
  avgPoints = 0;

  updateInterval = 8;

  watermelonSliced = false;
  cherriesSliced = false;
  bombSliced = false;
  bombsCut = 0;
  cherriesOrWatermelon = 1;

  setText("points_label", "Points: 0");
  setText("fruitsCut_label", "Fruits Cut: 0");

  // puts the start menu back how it was at the beginning
  diffuculty = 0;
  startButtonLock = true;
  showElement("diffuculty_button_easy");
  showElement("diffuculty_button_medium");
  showElement("diffuculty_button_hard");
  hideElement("how_to_play");

  // puts the gameplay screen back how it was at the beginning
  showElement("begin_dialog");
  showElement("gameplay_start_button");
  hideElement("falling_fruit_1");
  hideElement("falling_fruit_2");
  hideElement("falling_bomb_1");
}
function checkHighScore(){
  if (points > highScore){
    highScore = points;
  }
}
// create game over screen (so points scoring based on max and min)
// create end button
