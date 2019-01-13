let canvas = document.getElementById("canvas");									// récupère canvas et contexte 2d
let ctx = canvas.getContext("2d");

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;											// fixe la taille du canvas 1 à tout l'écran

let mainDiv = document.getElementById('mainContent');									// récupère la div qui contiendra les liens html

let columnNumber = 30;
let columnGap = 5;
let startColumn = 3;

if (window.innerWidth < 1000) 
{
	columnNumber = 13;
	startColumn = 0;
	columnGap = 2
}

let caseSize = canvas.width/columnNumber;
let rowNumber = canvas.height/caseSize;
let fontSize = caseSize -10;
let screenChar = [];															// tableau affiché

if (rowNumber < 15) 														// mode landscape smartphone
{
	columnNumber = 30;
	columnGap = 5;
	startColumn = 3;
	caseSize = canvas.width/columnNumber;
	rowNumber = canvas.height/caseSize;
	fontSize = caseSize -10;
}

let intervalDraw;
let intervalFillUp;
let intervalReverse;
let intervalDelay;

let delay = 0;																	// compteur pour le délai entre les animations
let fillingSpeed = 8;															// vitesse initiale de remplissage

let homeTitles = [' DU 25/10', ' ART NUMERIQUE', ' INFORMATIONS', ' PROGRAMMATION', ' AU 27/10'];
let homeLinks = ['index.html', 'infos.html', 'programmation.html'];
let caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/?&€£ $".split('');
caracteres.push(0);
let secondaryChars = [0, ' '];

let screenArrayModel = [];															// tableau modèle auquel est comparé le tableau affiché
let isStillFilling = true;
let isStillFixing = true;														// état des fonctions filling et fixing
let currentColor = 250;															// couleur de départ du texte

ctx.translate(caseSize/2, 0);


for (var i = 0; i < columnNumber; i++) 								// initialise un tableau à 2 dimensions pour le mode remplissage
{
	screenChar[i] = [];
}


function initScreenArrayModel(homeTitles, startColumn, columnGap)											// initialise le tableau modèle
{
	let titles2 = homeTitles.slice(0);					// slice(index de début) renvoie une copie d'un array, sans slice les modifications de la copie affectent l'origina
	let titlesIndex = 0;

	
	for (var i = 0; i < columnNumber; i++)
	{
		screenArrayModel[i] = [];

		for (var j = 0; j < rowNumber; j++)
		{
			if (i == startColumn && titles2.length > 0)
			{
				screenArrayModel[i][j] = titles2[0][j];

				if (j == titles2[0].length-1)
				{
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

function initScreenArrayModel2(homeTitles)					// mise en page horizontale
{
	let homeTitles2 = homeTitles.slice(0);					// slice(index de début) renvoie une copie d'un array, sans slice les modifications de la copie affectent l'original

	for (var i = 0; i < homeTitles2.length; i++) 
	{
		homeTitles2[i] = homeTitles2[i].split('');
	}

	homeTitles2.splice(homeTitles2.length-1, 0, homeTitles2[0]);	// rajoute le premier élément au dernier index (-> les 2 lignes date à la fin)
	homeTitles2.shift();											// supprime le premier élément (pop() pour le dernier)

	for (var i = 0; i < columnNumber; i++) 
	{
		let titlesIndex = 0;
		let titleSubIndex = 0;

		screenArrayModel[i] = [];

		for (var j = 0; j < rowNumber; j++) 
		{

			if (j % 2 == 1 && j > 1 && titlesIndex < homeTitles2.length) 
			{
				let startColumn = titlesIndex * 3 + 2;

				if (i > startColumn && homeTitles2[titlesIndex].length > 0) 
				{
					screenArrayModel[i][j] = homeTitles2[titlesIndex][0];
					homeTitles2[titlesIndex].splice(0, 1);					
				}
				else
				{
					screenArrayModel[i][j] = 0;
				}

				titlesIndex++;			
			}
			else
			{
				screenArrayModel[i][j] = 0;
			}
		}
	}
}


function createLinkHTML()
{
	let whichColumn = 9;
	let columnGap = 6;

	if (columnNumber == 13) 
	{
		whichColumn = 3
		columnGap = 3;
	}

	for (var i = 1; i < homeTitles.length-1; i++) 
	{
		let newColumn = document.createElement('div');

		for (var j = 1; j < homeTitles[i].length; j++) 
		{
			let newH2 = document.createElement('h2');
			let newLink = document.createElement('a');

			newLink.href = homeLinks[i-1];
			newLink.style.fontSize = fontSize + 'px';
			newLink.textContent = homeTitles[i][j];

			newH2.style.width = caseSize + 'px';
			newH2.style.height = caseSize  + 'px';
			newH2.classList.add('topLinks');

			newH2.appendChild(newLink);
			newColumn.appendChild(newH2);
		}

		newColumn.style.position = 'absolute';
		newColumn.style.top = '13px';
		newColumn.style.left = (whichColumn * caseSize) + 'px';


		mainDiv.appendChild(newColumn);
		whichColumn += columnGap;
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
		for (var i = 0; i < 20; i++) 
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

			if (screenChar[i][j] === 0) 
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
		clearInterval(intervalDraw);
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

		while(mainDiv.firstChild)												// supprime tous les éléments de mainDiv
		{
			mainDiv.removeChild(mainDiv.firstChild);
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



initScreenArrayModel(homeTitles, startColumn, columnGap);									// initialise le tableau modèle
intervalFillUp = setInterval(fillUpScreen, 100);											// lance le premier remplissage de l'écran