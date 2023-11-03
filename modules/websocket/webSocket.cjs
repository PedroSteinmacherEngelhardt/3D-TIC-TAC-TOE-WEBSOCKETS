const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const WEBSOCKETPORT = 5000;

const wsServer = new WebSocket.Server({ port:WEBSOCKETPORT});

const winningLines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11], [12, 13, 14], [15, 16, 17], [18, 19, 20], [21, 22, 23], [24, 25, 26],
                            [0, 3, 6], [1, 4, 7], [2, 5, 8], [9, 12, 15], [10, 13, 16], [11, 14, 17], [18, 21, 24], [19, 22, 25], [20, 23, 26],
                            [0, 9, 18], [1, 10, 19], [2, 11, 20], [3, 12, 21], [4, 13, 22], [5, 14, 23], [6, 15, 24], [7, 16, 25], [8, 17, 26],
                            [0, 4, 8], [6, 4, 2], [9, 13, 17], [15, 13, 11], [18, 22, 26], [24, 22, 20],
                            [0, 10, 20], [2, 10, 18], [3, 13, 23], [5, 13, 21], [6, 16, 26], [8, 16, 24],
                            [0, 12, 24], [6, 12, 18], [1, 13, 25], [7, 13, 19], [2, 14, 26], [8, 14, 20],
                            [0, 13, 26], [6, 13, 20], [2, 13, 24], [8, 13, 18]];


var games = []


wsServer.on('connection', function(socket){
    let gameBoard
    let game

    socket.on('message', function(message){
        let msg = JSON.parse(message);
        let type = msg.type
        let data = msg.data

        switch (type) {
            case 'join':
                game = joinGame(socket,data)
                if(game == null) {socket.send(JSON.stringify({ type: 'new-url', data: `/${uuidv4()}`}));break;}
                gameBoard = game.gameBoard
                socket.send(JSON.stringify({type: 'newgame', data: null}));
                socket.send(JSON.stringify({type: 'update' , data: gameBoard}));
                socket.send(JSON.stringify({ type: 'turn-change', data: game.turn}));
                console.log(game.players.length)
                break;
            
            case 'click':
                index = data
                if (!gameBoard[index] && game.turn == (game.players.indexOf(socket))) {
                    gameBoard[index] = game.turn;
        
                    winningLines.forEach(line => {
                        if (gameBoard[line[0]] != null && gameBoard[line[0]] == gameBoard[line[1]] && gameBoard[line[1]] == gameBoard[line[2]]) {
                            gameBoard[line[0]] += 3;
                            gameBoard[line[1]] += 3;
                            gameBoard[line[2]] += 3;
                            gameBoardFreeze(gameBoard);
                            setTimeout(() => newGame(gameBoard), 5000);
                        }
                    });    
        
                    game.turn += 1
                    if(game.turn > 2) game.turn = 0
        
                    game.players.forEach((client) => {
                        client.send(JSON.stringify({ type: 'update', data: gameBoard}));
                        client.send(JSON.stringify({ type: 'turn-change', data: game.turn}));
                    });
                }
                break;
        
            default:
                break;
        }        
    });

    socket.on('close',() =>{
        if(game === null) return
        game.players = game.players.filter((value) => value === socket)
        if(game.players.length == 0) games = games.filter((g) => g == game)
    })
});

function joinGame(socket, url) {
    game = games.find((g)=>{
        return g.id === url
    })
    
    if(url == '/') return null
    if (game === undefined) return createNewGame(socket, url)

    if(!game.players.includes(socket)) {
        game.players.push(socket)
    }
    return game
}

function createNewGame(socket, url = uuidv4()) {
    if (url == '/') url = `/${uuidv4()}`
    let game = {
        id : url,
        players : [socket],
        turn : 0,
        gameBoard : Array(27).fill(null),
        winner : null
    }
    games.push(game)
    return game
}

function newGame(gameBoard){
    for (let index = 0; index <  gameBoard.length; index++) {
        gameBoard[index] = null;
    }
    player = { symbol: 'x' };
    wsServer.clients.forEach((client) => {
    client.send(JSON.stringify({ type: 'newgame' }));
    // client.send(JSON.stringify({ type: 'turn-change', data: turn}));
    client.send(JSON.stringify({ type: 'update', data: gameBoard}));
    });
}

function gameBoardFreeze(gameBoard){
    gameBoard.forEach((tile, index) => {
        if(!tile){
           gameBoard[index] = '1';
        }
    });
};