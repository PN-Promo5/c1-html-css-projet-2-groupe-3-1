//DESCRIPTION

//END DESCRIPTION

//COUNTDOWN
function countdown(dateEnd) {
  var timer, days, hours, minutes, seconds;

  dateEnd = new Date(dateEnd);
  dateEnd = dateEnd.getTime();

  if ( isNaN(dateEnd) ) {
    return;
  }

  timer = setInterval(calculate, 1000);

  function calculate() {
    var dateStart = new Date();
    var dateStart = new Date(dateStart.getUTCFullYear(),
                             dateStart.getUTCMonth(),
                             dateStart.getUTCDate(),
                             dateStart.getUTCHours(),
                             dateStart.getUTCMinutes(),
                             dateStart.getUTCSeconds());
    var timeRemaining = parseInt((dateEnd - dateStart.getTime()) / 1000)

    if ( timeRemaining >= 0 ) {
      days    = parseInt(timeRemaining / 86400);
      timeRemaining   = (timeRemaining % 86400);
      hours   = parseInt(timeRemaining / 3600);
      timeRemaining   = (timeRemaining % 3600);
      minutes = parseInt(timeRemaining / 60);
      timeRemaining   = (timeRemaining % 60);
      seconds = parseInt(timeRemaining);

      document.getElementById("days").innerHTML    = parseInt(days, 10);
      document.getElementById("hours").innerHTML   = ("0" + hours).slice(-2);
      document.getElementById("minutes").innerHTML = ("0" + minutes).slice(-2);
      document.getElementById("seconds").innerHTML = ("0" + seconds).slice(-2);
    } else {
      return;
    }
  }

  function display(days, hours, minutes, seconds) {}
}

countdown('10/25/2019 09:30:00 AM');
//END COUNTDOWN

//INTERNATIONAL CLOCK
function worldClock(zone, region){
var dst = 0
var time = new Date()
var gmtMS = time.getTime() + (time.getTimezoneOffset() * 60000)
var gmtTime = new Date(gmtMS)

var hr = gmtTime.getHours() + zone
var min = gmtTime.getMinutes()

if (hr >= 24){
hr = hr-24
day -= -1
}
if (hr < 0){
hr -= -24
day -= 1
}
if (hr < 10){
hr = " " + hr
}
if (min < 10){
min = "0" + min
}


//america
if (region == "NAmerica"){
	var startDST = new Date()
	var endDST = new Date()
	startDST.setHours(2)
	endDST.setHours(1)
	var currentTime = new Date()
	currentTime.setHours(hr)
	if(currentTime >= startDST && currentTime < endDST){
		dst = 1
		}
}

//europe
if (region == "Europe"){
	var startDST = new Date()
	var endDST = new Date()
	startDST.setHours(1)
	endDST.setHours(0)
	var currentTime = new Date()
	currentTime.setHours(hr)
	if(currentTime >= startDST && currentTime < endDST){
		dst = 1
		}
}

if (dst == 1){
	hr -= -1
	if (hr >= 24){
	hr = hr-24
	day -= -1
	}
	if (hr < 10){
	hr = " " + hr
	}
return hr + ":" + min + " DST"
}
else{
return hr + ":" + min
}
}

function worldClockZone(){
  document.getElementById("Paris").innerHTML = worldClock(1, "Europe")
  document.getElementById("MexicoCity").innerHTML = worldClock(-6, "NAmerica")
  document.getElementById("London").innerHTML = worldClock(0, "Europe")
  setTimeout("worldClockZone()", 1000)
}
window.onload=worldClockZone;
//END CLOCK
