let canvas = document.getElementById("canvas");									// récupère canvas et contexte 2d
let ctx = canvas.getContext("2d");

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;	


let daysLinks = document.getElementById('dayLinks');

let returnButton1 = document.getElementById("return1");
let returnButton2 = document.getElementById("return2");
let infosButtons = document.getElementsByClassName('infosButtons');		

let columnNumber = 30;

if (window.innerWidth < 1000) 
{
	columnNumber = 15;
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

let titles = ['TARIFS', 'VENIR', 'CONTACT'];
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


/* *************************************************************************** ANIMATION ECRAN 1 **************************************************************** */

function initScreenArrayModel(titles)
{
	let titles2 = titles.slice(0);					// slice(index de début) renvoie une copie d'un array, sans slice les modifications de la copie affectent l'original
	let mainTitle = 'INFOS PRATIQUES'

	let startRow = Math.floor((rowNumber - titles[0].length)/2);
	let rowAdd = 1;
	let columnGap = 6;
	let startColumn = Math.floor((columnNumber - (titles.length+columnGap*2))/2);

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
					startRow += rowAdd;
					rowAdd = -rowAdd;
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
	let whichColumn = 7;
	let whichRow = Math.floor((rowNumber - titles[0].length)/2)-1;
	let rowAdd = 1;

	if (window.innerWidth < 1000) 
	{
		whichColumn = 0;
	}
	if (columnNumber == 19) 
	{
		whichColumn = 2;
	}

	for (var i = 0; i < titles.length; i++) 
	{
		let newColumn = document.createElement('div');

		for (var j = 0; j < titles[i].length; j++) 
		{
			let newH2 = document.createElement('h2');
			let newLink = document.createElement('a');

			newLink.href = '#'+'infos'+(i+1);
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
		whichColumn += 7;
		whichRow += rowAdd;
		rowAdd = -rowAdd;
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
		for (var i = 0; i < 10; i++)
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
		appearingReturnButton(0);
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
let scrollHeight = window.innerHeight;
let currentPage = 0;
let previousPage = 0;

window.addEventListener('scroll', function() 
{
	let scrollY = window.pageYOffset;
	currentPage = Math.floor(scrollY/scrollHeight);

	if (currentPage != previousPage) 
	{
		appearingReturnButton(currentPage);
		previousPage = currentPage;

		if (!infosAnimState[currentPage]) 
		{
			infosAnimState[currentPage] = 1;
			animateInfos(currentPage-1);
		}
	}
});


/* ****************************************************************************** FONCTIONS INFOS ********************************************************************** */
let canvasInfos = document.getElementsByClassName('canvasInfos');
let ctxInfos = [];

for (var i = 0; i < canvasInfos.length; i++) 
{
	ctxInfos[i] = canvasInfos[i].getContext('2d');

	ctxInfos[i].canvas.width = window.innerWidth;
	ctxInfos[i].canvas.height = window.innerHeight;
}


let columnNumberInfos = 40;
let caseSizeInfos = canvasInfos[0].width/columnNumberInfos;
let rowNumberInfos = canvasInfos[0].height/caseSizeInfos;
let fontSizeInfos = caseSizeInfos -5;
let infosIndex = 0;
let infosAnimState = [1, 0, 0, 0];


for (var i = 0; i < canvasInfos.length; i++) 
{
	ctxInfos[i].translate(caseSizeInfos/2, 0);

	ctxInfos[i].beginPath();
	ctxInfos[i].rect(0, 0, ctxInfos[i].canvas.width, ctxInfos[i].canvas.height);
	ctxInfos[i].fillStyle = 'black';
	ctxInfos[i].fill();
	ctxInfos[i].closePath();
}


function animateInfos(infosIndex)
{
	let actualRow = 0;
	let displayedRows = 5;
	let countInterval = 0;

	let actualCol = 0;
	let displayedCols = 55;

	let animateInterval = setInterval(function()
	{
		countInterval++;

		ctxInfos[infosIndex].clearRect(-caseSizeInfos/2, 0, ctxInfos[infosIndex].canvas.width, ctxInfos[infosIndex].canvas.height);
		ctxInfos[infosIndex].beginPath();
		ctxInfos[infosIndex].rect(0, 0, ctxInfos[infosIndex].canvas.width, ctxInfos[infosIndex].canvas.height);
		ctxInfos[infosIndex].fillStyle = 'black';
		ctxInfos[infosIndex].fill();
		ctxInfos[infosIndex].closePath();
		ctxInfos[infosIndex].clearRect(-caseSizeInfos/2, 0, (actualCol-25)*caseSizeInfos, ctxInfos[infosIndex].canvas.height);		

		drawAnimateInfos(actualCol, displayedCols, infosIndex);	
		actualCol+=5;								
		displayedCols-=2;

		if (countInterval > columnNumberInfos-15) 	
		{
			clearInterval(animateInterval);
			ctxInfos[infosIndex].clearRect(-caseSizeInfos/2, 0, ctxInfos[infosIndex].canvas.width, ctxInfos[infosIndex].canvas.height);

			if (infosIndex < 2) 
			{
				infosButtons[infosIndex].classList.add('borderFadeIn');
			}
			else
			{
				for (var i = infosIndex; i < infosButtons.length; i++) 
				{
					infosButtons[i].classList.add('borderFadeIn');
				}
			}
		}
	}, 80);
}

function drawAnimateInfos(actualCol, displayedCols, infosIndex)			
{
	for (var i = 0; i < rowNumberInfos; i++) 		
	{
		let lettersColor = -5;
		let rectOpacity = 0.0;

		for (var j = 0; j <= actualCol; j++) 		
		{
			if (j > actualCol-displayedCols) 		
			{
				lettersColor += 30;
				rectOpacity += 0.3;
				let random = getRandomInt(lettersColor);

				if ((j < 5) || (j > actualCol -4)) 
				{
					if (getRandomInt(2)) 
					{
						lettersColor = 0;
					}
				}

				ctxInfos[infosIndex].beginPath();
				ctxInfos[infosIndex].font = fontSizeInfos + "px sans-serif";
				ctxInfos[infosIndex].fillStyle = 'rgb('+lettersColor+','+lettersColor+','+lettersColor+')';
				ctxInfos[infosIndex].textAlign = 'center';
				ctxInfos[infosIndex].fillText(caracteres[getRandomInt(caracteres.length)], j*caseSizeInfos, i*caseSizeInfos);				
				ctxInfos[infosIndex].closePath();
			}
		}
	}
}

if (window.innerWidth < 1000) 
{
	animateInfos(2);
}


var mymap = L.map('mapid').setView([43.304703, 5.365473500000007], 13);


var Stamen_Toner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
}).addTo(mymap);

var marker = L.marker([43.304703, 5.365473500000007]).addTo(mymap);