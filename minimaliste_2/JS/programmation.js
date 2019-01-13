let canvas = document.getElementById("canvas");									// récupère canvas et contexte 2d
let ctx = canvas.getContext("2d");

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;											// taille du canvas 1 = tout l'écran

let daysLinks = document.getElementById('dayLinks');
let containerDays = document.getElementsByClassName("dailyProgram");

let returnButton1 = document.getElementById("return1");
let returnButton2 = document.getElementById("return2");
returnButton1.style.display = 'none';

let columnNumber = 30;

if (window.innerWidth < 1000) 
{
	columnNumber = 13;
}

let caseSize = canvas.width/columnNumber;
let rowNumber = canvas.height/caseSize;
let fontSize = caseSize -10;
let screenChar = [];

if (rowNumber < 10) 
{
	columnNumber = 19;
	caseSize = canvas.width/columnNumber;
	rowNumber = canvas.height/caseSize;
	fontSize = caseSize -10;
}

let intervalDraw;
let intervalFillUp;
let intervalReverse;
let intervalDelay;

let intervalReturnButton1;
let intervalReturnButton2;
let intervalReturnButtonCount = 0;
let isButtonAppearing = false;

let delay = 0;
let fillingSpeed = 8;															// vitesse initiale de remplissage

let titles = ['JOUR 1', 'JOUR 2', 'JOUR 3'];
let caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/?&€£ $".split('');
caracteres.push(0);
let secondaryChars = [0, ' '];
let returnButtonsText = 'RETOUR';

let screenArrayModel = [];														// tableau modèle auquel est comparé le tableau affiché
let isStillFilling = true;
let isStillFixing = true;														// état des fonctions filling et fixing
let currentColor = 250;															// couleur de départ du texte

ctx.translate(caseSize/2, 0);



for (var i = 0; i < columnNumber; i++) 								// initialise un tableau à 2 dimensions pour le mode remplissage
{
	screenChar[i] = [];
}



function initScreenArrayModel(titles)
{
	let titles2 = titles.slice(0);					// slice(index de début) renvoie une copie d'un array, sans slice les modifications de la copie affectent l'original
	let mainTitle = 'PROGRAMMATION'

	let startRow = Math.floor((rowNumber - titles[0].length)/2);
	let columnGap = 5;
	let startColumn = Math.floor((columnNumber - (titles.length+columnGap*2))/2) +1;

	if (columnNumber == 13) 
	{
		startColumn = 0;
	}

	for (var i = 0; i < columnNumber; i++)
	{
		screenArrayModel[i] = [0];

		if (i >= startColumn && i < startColumn + mainTitle.length)
		{
			screenArrayModel[i][1] = mainTitle[i - startColumn];
		}

		else
		{
			screenArrayModel[i][1] = secondaryChars[getRandomInt(2)];
		}
	}

	for (var i = 0; i < columnNumber; i++)
	{
		for (var j = 2; j < rowNumber; j++)
		{
			if (i == startColumn && j >= startRow && titles2.length > 0)
			{
				let letterIndex = j - startRow;
				screenArrayModel[i][j] = titles2[0][letterIndex];

				if (letterIndex == titles2[0].length-1)
				{
					startRow++;
					startColumn += columnGap + 1;						// détermine la prochaine colonne (ex : départ à 5 + espace de 4 + 1 = cols 5, 10 et 15)
					titles2.shift();
				}
			}

			else
			{
				screenArrayModel[i][j] = secondaryChars[getRandomInt(2)];
			}
		}
	}
}


function createLinkHTML()
{
	let whichColumn = Math.floor((columnNumber - (titles.length+5*2))/2) +1;
	let whichRow = Math.floor((rowNumber - titles[0].length)/2)-1;

	if (columnNumber == 13) 
	{
		whichColumn = 0;
	}

	for (var i = 0; i < titles.length; i++) 
	{
		let newColumn = document.createElement('div');

		for (var j = 0; j < titles[i].length; j++) 
		{
			let newH2 = document.createElement('h2');
			let newLink = document.createElement('a');

			newLink.href = '#'+'day'+(i+1);
			newLink.style.fontSize = fontSize + 'px';
			newLink.textContent = titles[i][j];

			newH2.style.width = caseSize + 'px';
			newH2.style.height = caseSize  + 'px';
			newH2.classList.add('topLinks');

			newH2.appendChild(newLink);
			newColumn.appendChild(newH2);
		}

		newColumn.style.position = 'absolute';
		newColumn.style.top = (whichRow * caseSize +13) + 'px';
		newColumn.style.left = (whichColumn * caseSize) + 'px';


		dayLinks.appendChild(newColumn);
		whichColumn += 6;
		whichRow += 1;
	}
}


function draw()																	// efface le canvas et redessine
{
	ctx.clearRect(-caseSize/2, 0, canvas.width, canvas.height);

	if (isStillFilling)
	{
		changeCharacters();														// change les caractères si toujours en train de remplir (sans les fixer si tombe sur les bons)
	}
	else
	{
		for (var i = 0; i < 15; i++)
		{
			fixCharacters();													// si le remplissage est fini, fixe les caractères
		}

		currentColor -= 5;														// assombrit la couleur
	}

	for (var i = 0; i < screenChar.length; i++)
	{
		for (var j = 0; j < screenChar[i].length; j++) 							// dessine tout
		{
			ctx.beginPath();
			ctx.font = fontSize + "px sans-serif";

			if (screenChar[i][j] == 0)
			{
				ctx.fillStyle = 'rgb('+currentColor+','+currentColor+','+currentColor+')'; 
			}
			else
			{
				ctx.fillStyle = 'rgb(250,250,250)';								// les 0 s'assombrissent, le reste est blanc
			}

			ctx.textAlign = 'center';
			ctx.fillText(screenChar[i][j], i*caseSize, j*caseSize);
			ctx.closePath();
		}
	}

	if (currentColor <= 0 && isStillFixing == false) 							// si les 0 sont devenus noirs et que toutes les lettres ont été fixées, stoppe l'intervalle
	{
		createLinkHTML();
		appearingReturnButton(1);
		clearInterval(intervalDraw);
		document.body.style.overflow = 'auto';
		intervalDelay = setInterval(delayReDraw, 1000);							// lance le délai avant la prochaine animation
	}
}

function delayReDraw()
{
	delay++;

	if (delay > 5) 
	{
		delay = 0;
		fillingSpeed = 12;

		while (dayLinks.firstChild)												// supprime tous les éléments de mainDiv
		{
			dayLinks.removeChild(dayLinks.firstChild);
		}

		for (var i = 0; i < screenChar.length; i++) 
		{
			for (var j = 0; j < screenChar[i].length; j++) 
			{
				if(screenChar[i][j] == 0)
				{
					screenChar[i][j] = '0';
				}
			}
		}

		clearInterval(intervalDelay);
		intervalReverse = setInterval(reverseFillUpScreen, 100);						// met fin au délai et lance le remplissage inversé
	}
}


initScreenArrayModel(titles);
intervalFillUp = setInterval(fillUpScreen, 100);								// lance le premier remplissage de l'écran



/* ****************************************************************************** SCROLL ******************************************************************************* */

let previousScrollY = window.pageYOffset;
let currentPage = 0;
let scrollHeight = containerDays[0].offsetHeight;
let previousPage = 0;

if (columnNumber == 30) 
{
	window.addEventListener('scroll', function() 
	{
		let scrollY = window.pageYOffset;
		currentPage = Math.floor(scrollY/scrollHeight);
		

		if (currentPage != previousPage) 
		{
			previousPage = currentPage;

			if (!infosAnimState[currentPage]) 
			{
				infosAnimState[currentPage] = 1;
				drawCanvasDays(currentPage-1);
			}
		}
	});
}


/* ******************************************************************************** CANVAS JOURS ************************************************************************ */


let canvasDays = document.getElementsByClassName("canvasDays");									// récupère canvas et contexte 2d
let canvasDaysContainer = document.getElementsByClassName("canvasDaysContainer");
let ctxDays = [];
let daysText = ['JOUR 1', 'JOUR 2', 'JOUR 3'];
let infosAnimState = [1, 0, 0, 0];

for (var i = 0; i < canvasDays.length; i++)
{
	ctxDays[i] = canvasDays[i].getContext("2d");

	ctxDays[i].canvas.width = canvasDaysContainer[0].offsetWidth -20;
	ctxDays[i].canvas.height = containerDays[i].offsetHeight;

	ctxDays[i].beginPath();
	ctxDays[i].rect(0, 0, ctxDays[i].canvas.width, ctxDays[i].canvas.height);
	ctxDays[i].fillStyle = 'black';
	ctxDays[i].fill();
	ctxDays[i].closePath();
}

function drawCanvasDays(dayIndex)
{
	let colNumber = 7;
	let sizeX = ctxDays[dayIndex].canvas.width / colNumber;
	let sizeY;
	let font = [];												// lorsque mode lettres et pas lignes

	let dayTextSize = ctxDays[dayIndex].canvas.height/8;
	let dayTextX = ctxDays[dayIndex].canvas.width /2;

	for (var i = 0; i < colNumber; i++) 
	{
		font[i] = getRandomInt(7)+4;	
	}

	let countInterval = 0;
	let maxInterval = 45;
	let startDrawDays =  maxInterval - daysText[dayIndex].length +1;

	let intervalAnimDays = setInterval(function() 
	{
		countInterval++;
		drawLines(countInterval, sizeX, sizeY, colNumber,  font, dayIndex);

		if (countInterval >= startDrawDays && countInterval - startDrawDays != 4) 
		{
			ctxDays[dayIndex].beginPath();
			ctxDays[dayIndex].rect(dayTextX-dayTextSize/3, ((countInterval-startDrawDays))*dayTextSize+dayTextSize/6, dayTextSize-30, dayTextSize+1);
			ctxDays[dayIndex].fillStyle = 'black';
			ctxDays[dayIndex].fill();
			ctxDays[dayIndex].font = dayTextSize + "px sans-serif"; 
			ctxDays[dayIndex].fillStyle = 'white';
			ctxDays[dayIndex].textAlign = 'center';
			ctxDays[dayIndex].fillText(daysText[dayIndex][countInterval-startDrawDays], dayTextX, ((countInterval-startDrawDays)+1)*dayTextSize);
			ctxDays[dayIndex].closePath();
		}

		if (countInterval >= maxInterval) 
		{
			clearInterval(intervalAnimDays);
		}
	}, 30)
}

function drawLines(i, sizeX, sizeY, colNumber,  font, dayIndex)
{
	for (var j = 0; j < colNumber; j++)
	{
		sizeY = font[j] + 5;

		ctxDays[dayIndex].beginPath();
		ctxDays[dayIndex].moveTo(j*sizeX+sizeX/2, (i+1)*sizeY);
		ctxDays[dayIndex].lineTo(j*sizeX+sizeX/2, (i+2)*sizeY);
		ctxDays[dayIndex].strokeStyle = 'white';
		ctxDays[dayIndex].stroke();
		ctxDays[dayIndex].closePath();
	}
}

if (columnNumber == 13) 
{
	drawCanvasDays(0);
	drawCanvasDays(1);
	drawCanvasDays(2);
}