var holes = [];
var speedX = 0;
var speedY = 0;
var posX = 30;
var posY = 30;
var startGame = 0;
var startDate = []
var endDate = [];
var ball = document.getElementById("ball");
let container = document.getElementsByClassName("container")[0];
window.addEventListener('deviceorientation', position)

function position(e){
    console.log(e);
    speedX = e.gamma/45;
    speedY = e.beta/45;
}

function start(){                                               //Inicjacja startu
    startGame=true;
    createHole();                       // Tworzenie dołków
    moveBall();
    startDate = new Date().getTime();                      // poruszanie kulką
    console.log("game Started!")
    document.getElementById("start").hidden=true;
    //document.getElementById("restart").hidden=true;

}
function restart(){                                 // funkcja restartu gry 
    startGame=true;
    for(i=container.childElementCount;i>0;i--){     // usunięcie starych dołków
        if(container.childNodes[i].nodeName=="DIV"){
            if(container.childNodes[i].id!=="ball"){
                container.removeChild(container.childNodes[i])
            }
        }
    }
    holes=[];
    posX = 20, posY = 20;
    createHole();                   //tworzenie dołków
    moveBall();                  // poruszanie kulką
    document.getElementById("reset").hidden=true;
}
function createHole() {
    for(i=2;i<(window.innerWidth/100);i++){
        let hole = document.createElement('div');
        hole.classList.add("hole");
        hole.style.left=100*i+Math.random()*75-95+'px';
        hole.style.top=Math.random()*(window.innerHeight-95)/2+'px';
        holes.push(hole);
        container.appendChild(hole);
    }
    for(i=2;i<(window.innerWidth/100);i++){
        let hole = document.createElement('div');
        hole.classList.add("hole");
        hole.style.left=100*i+Math.random()*75-95+'px';
        hole.style.top=Math.random()*(window.innerHeight)/2+window.innerHeight/2-100+'px';
        holes.push(hole);
        container.appendChild(hole);
    }
    randomGoodHole(1);
}
 
 function randomGoodHole(i){                                 // Dodanie dobrej dziury
     let goodHole = Math.floor(Math.random()*holes.length);
     if(goodHole ==i&&i<holes.length){i++;}                  // uniknięcie pojawienia się dobrej dziury w tym samym miejscu
     else{i--;}
     holes[goodHole].classList.remove("hole");
     holes[goodHole].classList.add("correctHole")
 }                                                           

 function moveBall(){                 // funkcja poruszania kulki
    if(posX+speedX<window.innerWidth-50 && posX+speedX>0){  // ograniczenia kulki
        posX+=speedX;
        ball.style.left=posX+'px';        
    }
    if(posY+speedY<window.innerHeight-50 && posY+speedY>0){
        posY+=speedY;
        ball.style.top=posY+'px';        
    }
                                                    //Sprawdzanie kolizji z dziurami
    for(i=0;i<holes.length;i++) {
        if(posY<Math.floor(holes[i].style.top.slice(0,-2))+50&&posY>holes[i].style.top.slice(0,-2)){
            if(posX>holes[i].style.left.slice(0,-2)&&posX<Math.floor(holes[i].style.left.slice(0,-2))+50){
                if(holes[i].classList.contains("correctHole")){
                    holes[i].classList.remove("correctHole");
                    holes.forEach(e=>{if(e.classList.contains("prevHole")){
                        e.classList.remove("prevHole");
                        e.classList.add("hole");
                    }})
                    holes[i].classList.add("prevHole");
                    
                    randomGoodHole(i);
                }
                else if(holes[i].classList.contains("hole")){     // koniec gry
                startGame=false;
                endDate = new Date().getTime();
                window.alert('Gratulację grałeś przez ' + (endDate - startDate)/1000 + 'sekund')
                document.getElementById("reset").hidden=false;
            }
        }
    }
    };
    if(startGame==true){
        window.requestAnimationFrame(moveBall)
    }
}
