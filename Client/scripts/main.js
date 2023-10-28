const serverAddress = 'ws://localhost:5000';
const serverConnection = new WebSocket(serverAddress);

var gridTiles = Array.from(document.querySelectorAll(".gridContainer>div"));
var cubes = Array.from(document.querySelectorAll("#view-container>div"));
var turn = document.getElementById("turn");

var gameBoard = Array(27).fill(null);

var cors = ['vermelho', 'azul', 'amarelo']

serverConnection.onopen = (event) => {
    let path = window.location.pathname
    serverConnection.send(JSON.stringify({type: 'join', data:path}));
}

serverConnection.onmessage = function(message){
    var msg = JSON.parse(message.data);
    var type = msg.type;
    var data = msg.data;

    switch (type) {
        case 'update':
            gameBoard = data;
            for (let index = 0; index < 27; index++){
                if(gameBoard[index] != null){
                    gridTiles[index].removeEventListener('mouseover', tileHandle);
                    gridTiles[index].removeEventListener('mouseout', tileHandle);
                    gridTiles[index].removeEventListener('click', tileHandle);
                }
            }
            paint();
            break
        case 'newgame':
            for (let index = 0; index < 27; index++){ 
                    gridTiles[index].addEventListener('mouseover', tileHandle);
                    gridTiles[index].addEventListener('mouseout', tileHandle);
                    gridTiles[index].addEventListener('click', tileHandle);                  
            }
            break;
        case 'turn-change':
            turn.innerText = cors[data]
            turn.classList.remove('vermelho')
            turn.classList.remove('azul')
            turn.classList.remove('amarelo')
            turn.classList.add(cors[data])
            break;
        case 'new-url':
            //window.location.pathname = data
            break;
    }
}

function tileHandle(event){
    var index = gridTiles.indexOf(event.target)
    var type = event.type;
    var self = event.target;
    switch (type) {
        case 'mouseover':
            highlight(index, '#fff3');
            self.style.backgroundColor = '#fff7';
            break;

        case 'mouseout':
            self.style.backgroundColor = 'transparent';
            highlight(index, 'transparent');
            break;
        
        case 'click':
            console.log('data sent');
            serverConnection.send(JSON.stringify({type: 'click', data: index}));
            break;
    }
}

function paint(){
    gameBoard.forEach((tile, index) => {
        var color;
        switch (tile) {
            case 0:
                color = '#f003';
            break;
            case 3:
                color = '#f00f';
            break;
            case 1:
                color = '#00f3';
            break;
            case 4:
                color = '#00ff';
            break;
            case 2:
                color = '#ff03';
                break;
            case 5:
                color = '#ff0f';
                break;
            default:
                color = 'transparent';
            break;
        }
        gridTiles[index].style.backgroundColor = color;
        highlight(index, color);
    });
}

function highlight(index, color){
    Array.from(cubes[index].children).forEach((element) => {
        element.style.backgroundColor = color;
    });
}
