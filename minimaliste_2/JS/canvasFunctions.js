function getRandomInt(max) 
{
  return Math.floor(Math.random() * Math.floor(max));
}


function fillingUpCharactersArray()												// ajoute max 10 caractères aléatoires
{
	for (var i = 0; i < 10; i++) 
	{
		let random = getRandomInt(screenChar.length);
		let subArrayLength = screenChar[random].length

		if (subArrayLength < canvas.height/caseSize) 
		{
			screenChar[random].push(caracteres[getRandomInt(caracteres.length)]);

			ctx.beginPath();
			ctx.font = fontSize + "px sans-serif";
			ctx.fillStyle = 'rgb(250,250,250)';
			ctx.textAlign = 'center'
			ctx.fillText(screenChar[random][screenChar[random].length-1], random*caseSize, (subArrayLength)*caseSize);
			ctx.closePath();
		}
	}
}


function changeCharacters()														// change tous les caractères aléatoirement (si toujours en train de remplir)
{
	for (var i = 0; i < screenChar.length; i++) 
	{
		for (var j = 0; j < screenChar[i].length; j++) 
		{
			screenChar[i][j] = caracteres[getRandomInt(caracteres.length)];
		}
	}
}


function fixCharacters()														// modifie les caractères n'étant pas encore ceux voulus (une fois remplissage fini)
{
	isStillFixing = false;

	for (var i = 0; i < screenChar.length; i++) 
	{
		for (var j = 0; j < screenChar[i].length; j++) 
		{
			if (screenChar[i][j] !== screenArrayModel[i][j]) 					// si le caractère n'est pas celui voulu, en génère un nouveau aléatoirement
			{
				screenChar[i][j] = caracteres[getRandomInt(caracteres.length)];
				isStillFixing = true;
			}
		}
	}
}


function fillUpScreen()															// remplissage de l'écran						
{
	for (var i = 0; i < fillingSpeed; i++) 								
	{
		fillingUpCharactersArray();												// ajoute jusqu'à 10 caractères par itération
	}

	draw();																		// change les caractères et dessine

	let keepGoing = false;

	for (var i = 0; i < screenChar.length; i++) 
	{
		if (screenChar[i].length < canvas.height/caseSize) 						// vérifie si l'écran est rempli ou non
		{
			keepGoing = true;
		}
	}

	if (!keepGoing) 															// si l'écran est rempli, met fin à l'intervalle de fillUpScreen et lance celui de draw
	{
		clearInterval(intervalFillUp);
		intervalDraw = setInterval(draw, 100);
		isStillFilling = false;
	}
}

function reverseFillUpScreen()
{
	ctx.clearRect(-caseSize/2, 0, canvas.width, canvas.height);	

	let startEmptying = false;
	let isStillEmptying = false;

	if (currentColor < 245) 
	{
		currentColor += 10;
	}
	else
	{
		startEmptying = true;
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

	if (startEmptying) 
	{
		for (var i = 0; i < 25; i++) 
		{
			let random = getRandomInt(screenChar.length);

			if (screenChar[random].length > 0) 
			{
				screenChar[random].pop();
				isStillEmptying = true;
			}
		}

		if (!isStillEmptying) 
		{
			ctx.clearRect(-caseSize/2, 0, canvas.width, canvas.height);
			clearInterval(intervalReverse)
			setTimeout(function() {
				intervalFillUp = setInterval(fillUpScreen, 100);								// lance le premier remplissage de l'écran
			}, 200);
			
		}
	}
}

function appearingReturnButton(page)
{
	if (isButtonAppearing) 									// en cas de grand scroll d'un coup et de déclenchements rapprochés, évite d'avoir plusieurs intervalles simultanés
	{
		clearInterval(intervalReturnButton1);
		clearInterval(intervalReturnButton2);
	}

	if (!(page % 2)) 
	{
		isButtonAppearing = true;

		returnButton1.style.display = 'block';
		returnButton2.classList.add('fadeOut');

		if (returnButton1.classList.contains('fadeOut')) 
		{
			returnButton1.classList.remove('fadeOut');
		}

		returnButton1.classList.add('fadeIn');
		returnButton1.textContent = '';

		intervalReturnButtonCount = 0;

		intervalReturnButton1 = setInterval(function() {
			returnButton1.textContent += returnButtonsText[intervalReturnButtonCount];
			intervalReturnButtonCount++;

			if (intervalReturnButtonCount >= returnButtonsText.length) 
			{
				clearInterval(intervalReturnButton1);
				returnButton2.style.display = 'none';
				isButtonAppearing = false;
			}
		}, 100);
	}

	else if (page % 2) 
	{
		isButtonAppearing = true;

		returnButton2.style.display = 'block';
		returnButton1.classList.add('fadeOut');

		if (returnButton2.classList.contains('fadeOut')) 
		{
			returnButton2.classList.remove('fadeOut');
		}

		returnButton2.textContent = '';
		returnButton2.classList.add('fadeIn');

		intervalReturnButtonCount = 0;

		intervalReturnButton2 = setInterval(function() {
			returnButton2.textContent += returnButtonsText[intervalReturnButtonCount];
			intervalReturnButtonCount++;

			if (intervalReturnButtonCount >= returnButtonsText.length) 
			{
				clearInterval(intervalReturnButton2);
				returnButton1.style.display = 'none';
				isButtonAppearing = false;
			}
		}, 100);
	}
}