R = 0; x1 = .1; y1 = .05; x2 = .25; y2 = .24; x3 = 1.6; y3 = .24; x4 = 300; y4 = 150; x5 = 300; y5 = 150;

document.getElementById('asideCnt').onmouseover = function() {
  x4 = 400;
  x5 = 100;
  y4 = 250;
}
document.getElementById('asideCnt').addEventListener("mouseout", function() {
  x4 = 300;
  x5 = 300;
  y4 = 150;
})

DI = document.getElementsByClassName("imgHomeJS");
DIL = DI.length;

function A() {
  var i;
  var DIS;
  for (i = 0; i - DIL; i++) {
    DIS = DI[i].style;
    DIS.position = 'absolute';
    DIS.left = (Math.sin(R * x1 + i * x5 + x3) * x4 + x5) + "px";
    DIS.top = (Math.cos(R * y1 + i * y2 + y3) * y4 + y5) + "px";
  }
  R = R + 0.1
}

setInterval('A()', 20);
void(0);