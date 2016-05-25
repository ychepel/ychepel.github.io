var population = [];
var canvas = document.getElementById('animal-world');
var context = canvas.getContext('2d');
var fontSuffix = 'px arial';
var maxX = canvas.width;
var maxY = canvas.height;
var horisontalDirections = ['L', 'R', ''];
var verticalDirections = ['U', 'D', ''];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function oppositeDirection(direction) {
	if(direction === 'U') return 'D';
	if(direction === 'D') return 'U';
	if(direction === 'L') return 'R';
	if(direction === 'R') return 'L';
	return direction;
}

function Animal() {
	this.x; 
	this.y;
	this.body;
	this.size;
	this.color;
	this.step = 0;
	this.stepToGrowth;
	this.sizeToClone;
	this.maxSize;
	this.direction = [];
};
Animal.prototype.render = function() {
	context.beginPath();
	context.arc(this.x, this.y, this.size , 0, 2 * Math.PI);
	context.stroke();
	context.fillStyle = this.color;
	context.fill();
	context.fillStyle = 'white';
	context.font = this.size + fontSuffix;
	context.fillText(this.body, this.x-this.size/2 , this.y + this.size/2);
};

function Cat() {Animal.call(this)};
Cat.prototype = Object.create(Animal.prototype);
Cat.prototype.constructor = Cat;
Cat.prototype.body = 'C';
Cat.prototype.color = "green";
Cat.prototype.stepToGrowth = 30;
Cat.prototype.maxSize = 30;
Cat.prototype.sizeToClone = 17;

function Dog() {Animal.call(this)};
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
Dog.prototype.body = 'D';
Dog.prototype.color = "blue";
Dog.prototype.stepToGrowth = 20;
Dog.prototype.maxSize = 50;
Dog.prototype.sizeToClone = 20;

function Rabbit() {Animal.call(this)};
Rabbit.prototype = Object.create(Animal.prototype);
Rabbit.prototype.constructor = Rabbit;
Rabbit.prototype.body = 'R';
Rabbit.prototype.color = "gray";
Rabbit.prototype.stepToGrowth = 25;
Rabbit.prototype.maxSize = 40;
Rabbit.prototype.sizeToClone = 18;

function Monster() {Animal.call(this)};
Monster.prototype = Object.create(Animal.prototype);
Monster.prototype.constructor = Monster;
Monster.prototype.body = 'M';
Monster.prototype.color = "red";
Monster.prototype.stepToGrowth = 30;
Monster.prototype.maxSize = 50;
Monster.prototype.sizeToClone = 51;


function init(animal, count, posX, posY) {
	for (var i = 0; i < count; i++) {
		var currentAnimal = new animal();
		currentAnimal.size = 15;
		currentAnimal.x = (posX != undefined ? posX : getRandomInt(currentAnimal.size, maxX - currentAnimal.size));
		currentAnimal.y = (posY != undefined ? posY : getRandomInt(currentAnimal.size, maxY - currentAnimal.size));
		currentAnimal.direction.push(horisontalDirections[getRandomInt(0,2)]);
		currentAnimal.direction.push(verticalDirections[getRandomInt(0,2)]);
		population.push(currentAnimal);
	}
}

function growthAnimal() {
	if(this.step >= this.stepToGrowth) {
		this.step = 0;
		this.size++;
	}
	if(this.size > this.maxSize) {
		this.size = this.maxSize;
	}
}

function draw() {
	for(var animalNum in population) {
		var animal = population[animalNum];
		animal.render();
	}
}

function move() {
	for(var animalNum in population) {
		var animal = population[animalNum];
		doStep(animal);
		animal.step++;
		growthAnimal.call(animal);
		checkContact(animal);
	}
}

function doStep(animal) {
	switch (animal.direction[0]) {
		case 'L': animal.x -= animal.size/2; 
			if(animal.x - animal.size < 0) {
				animal.direction[0] = oppositeDirection(animal.direction[0]);
				animal.x = animal.size;
			}
			break;
		case 'R': animal.x += animal.size/2; 
			if(animal.x + animal.size > maxX) {
				animal.direction[0] = oppositeDirection(animal.direction[0]);
				animal.x = maxX - animal.size;
			}
			break;
	}
	switch (animal.direction[1]) {
		case 'U': animal.y -= animal.size/2; 
			if(animal.y - animal.size < 0) {
				animal.direction[1] = oppositeDirection(animal.direction[1]);
				animal.y = animal.size;
			}
			break;
		case 'D': animal.y += animal.size/2; 
			if(animal.y + animal.size > maxY) {
				animal.direction[1] = oppositeDirection(animal.direction[1]);
				animal.y = maxY - animal.size;
			}
			break;
	}
}

function checkContact(currentAnimal) {
	for(var animalNum in population) {
		var animal = population[animalNum];
		if(animal != currentAnimal) {
			if(animal.x - animal.size <= currentAnimal.x 
				&& animal.x + animal.size >= currentAnimal.x) {
					if(animal.y - animal.size <= currentAnimal.y 
						&& animal.y + animal.size >= currentAnimal.y) {
							contact(currentAnimal, animal);
					}
			}
		}
	}
}

function contact(animal1, animal2) {
	if(animal1.constructor.name === animal2.constructor.name) {
		if(animal1.size >= animal1.sizeToClone) {
			if(animal2.size >= animal2.sizeToClone) {
				init(animal1.constructor, 1, animal1.x + 20, animal1.y + 20);
				if(animal1.direction[0] === '' && animal1.direction[1] === '') {
					removeAnimal(animal1);
				}
				if(animal2.direction[0] === '' && animal2.direction[1] === '') {
					removeAnimal(animal2);
				}
				return;
			}
		}
	}

	if(animal1.constructor.name === 'Rabbit' && animal2.constructor.name != 'Rabbit') {
		init(Monster, 1, animal2.x + 20, animal2.y + 20);
	}
	if(animal1.constructor.name != 'Rabbit' && animal2.constructor.name === 'Rabbit') {
		init(Monster, 1, animal1.x + 20, animal1.y + 20);
	}


	if(animal1.constructor.name === 'Monster' && animal2.constructor.name === 'Monster') {
		if(animal1.size > animal2.size) {
			removeAnimal.call(animal2);
		}
		else {
			removeAnimal.call(animal1);	
		}
		return;
	}

	if(animal1.constructor.name === 'Monster') {
		removeAnimal.call(animal2);
	}
	if(animal2.constructor.name === 'Monster') {
		removeAnimal.call(animal1);
	}
}

function removeAnimal() {
	var index = population.indexOf(this);
	population.splice(index, 1);
}

function animation() {
	setInterval(function() {
		context.clearRect(0, 0, maxX, maxY);
		draw();
		move();		
	}, 100);
};

init(Cat, 5);
init(Dog, 5);
init(Rabbit, 5);
animation();