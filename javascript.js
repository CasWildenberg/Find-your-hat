const prompt = require('prompt-sync')({sigint: true});

const setDif = prompt('Select dificulty: [EASY, MEDIUM, HARD]' ).toLowerCase().trim();

let holesPct = 0;
if(setDif === 'easy'){
    holesPct = 15;
  } else if(setDif === 'medium'){
    holesPct = 30;
  } else if(setDif === 'hard'){
    holesPct = 40;
  } else {
    console.log('Please choose a valid option');
    askInfo();
  }

const setHeight = prompt('How many rows will your field be in length? ');

const setWidth = prompt('How many rows will your field be in width? ');

console.log('Good luck mister farmer! Find your hat...');

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
let stopGame = false;

class Field {
  constructor(height,width,holesPct){
    this.height = height;
    this.width = width;
    this.holesPct = holesPct;
    this.field = [];
    this.x = 0;
    this.y = 0;
  }

  generateField(){
    let field = [];
    const hatLocX = Math.floor(Math.random() * this.width);
    const hatLocY = Math.floor(Math.random() * this.height);
    const holesNum = this.height * this.width / 100 * this.holesPct;

    for(let i = 0; i < this.height; i++){
      field.push([])
      for(let j = 0; j < this.width; j++){
        field[i].push(fieldCharacter)     
      }
    }

    let i = 1;
    while(i < holesNum){
      const randLocX = Math.floor(Math.random() * this.width);
      const randLocY = Math.floor(Math.random() * this.height);
      field[randLocY][randLocX] = hole;
      i++;
    }
    field[0][0] = pathCharacter;
    field[hatLocY][hatLocX] = hat;
    
    this.field = field;
  } 

  print(){
    let jointField = [];
    for(let i = 0; i < this.field.length; i++){
      jointField.push(this.field[i].join('')); // Join elements with an empty string
    }
    console.log(jointField.join('\n')); // Join rows with a newline character for better display
  } 
}

//Function to check wheter desired location is within the map.
const isWithinBounds = (field,newY,newX) => {
  let withinBounds = true;
  if(newY < 0 || newY > field.height || newX < 0 || newX > field.width){
    withinBounds = false;
  } return withinBounds;
}

//Function to move character to desired location.
const move = (field,direction) => {
  let newY = field.y;
  let newX = field.x;
  if(direction === 'w'){
    newY -= 1;
  } else if(direction === 's'){
    newY += 1;
  } else if(direction === 'a'){
    newX -= 1;
  } else if(direction === 'd') {
    newX += 1;
  } else {
    console.log("Please insert a valid direction: [W,A,S,D]")
  }

  if(isWithinBounds(field,newY,newX)){
    field.y = newY;
    field.x = newX;
    interact(field); 
  } else {
    console.log('Wrong way!')
  }
}

//Function to interact with tiles when walked upon.
const interact = (field) => {
  let xLoc = field.x;
  let yLoc = field.y;
  if(field.field[yLoc][xLoc] === '░'){
    field.field[yLoc][xLoc] = '*'
  } else if(field.field[yLoc][xLoc] === 'O'){
    fallDown();
  } else if(field.field[yLoc][xLoc] === '^'){
    completeGame();
  }
}

//Stop game when character falls down a hole.
const fallDown = () => {
  console.log('You fell into a hole! Start again')
  stopGame = true;
}

//Stop game when character completes objective.
const completeGame = () => {
  console.log('Congratulations! You have found your hat.')
  stopGame = true;
}

//Create and generate field entity
const myField = new Field(setWidth,setHeight,holesPct);
myField.generateField();

//Keep asking for next turn until game is completed or failed.
while(stopGame === false){
  myField.print();
  const direction = prompt('Which way? ').toLowerCase().trim();
  move(myField,direction);
}

