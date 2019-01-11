R=0; x1=.05; y1=.1; x2=.24; y2=.25; x3=.100; y3=3.6; x4=150; y4=1000; x5=150; y5=100;


DI=document.getElementsByClassName("imgProg"); DIL=DI.length;

function A() {
    var i;
    var DIS;
    for(i=0; i-DIL; i++){
        DIS=DI[ i ].style;
        DIS.position='absolute';
        DIS.left=(Math.sin(R*x1+i*x5+x3)*x4+x5)+"px";
        DIS.top=(Math.cos(R*y1+i*y2+y3)*y4+y5)+"px";
    }
    R=R+0.1
}

setInterval('A()',45);
void(0);
