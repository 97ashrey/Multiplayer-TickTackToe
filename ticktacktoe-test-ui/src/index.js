const playerIdInput = document.getElementById("player-id");
const playerNameInput = document.getElementById("player-name");
const gameIdInput = document.getElementById("game-id");
const connectButton = document.getElementById("connect-button");
const messageTextArea = document.getElementById("message");
const sendButton = document.getElementById("send-button")
const messagesList = document.getElementById("messages");

let gameId = null;

let connected = false;

let playerName = null;

let playerId = null;

let connection = null;

connectButton.addEventListener("click", (event) => {
    gameId = gameIdInput.value;
    playerName = playerNameInput.value;
    playerId = playerIdInput.value;

    connection = new signalR.HubConnectionBuilder()
    .withUrl(`http://localhost:5000/game?gameId=${gameId}&playerName=${playerName}&playerID=${playerId}`)
    // .withAutomaticReconnect()
    .build();
    
    connection.on("ReceiveMessage", data => {
        console.log(data);
        displayMessage(data);
    });

    connection.on("MoveResult", (moveResult) => {
        console.log(moveResult);
        if (moveResult.roundOver) {
            const vote = confirm("Round over. Play next round ?");
            connection.invoke("VoteForRound", vote);
        }
    });

    connection.on("PlayersConnected", (gameState) => {
        displayMessage("All players connected");
        console.log(gameState);
    })

    connection.on("PlayerDisconnected", () => {
        displayMessage("Player disconnected");
    })

    connection.on("NextRound", (gameState) => {
        displayMessage("Next round starting");
        console.log(gameState);
    })

    connection.start().then(() => {
        displayMessage("Connected");
        connected = true;
        connectButton.setAttribute("disabled", true);
    });

    connection.onclose(() => displayMessage("Connection closed"));
});

sendButton.addEventListener("click", (event) => {
    if (connection == null && gameId == null && !connected) {
        return;
    } 

    const field = parseInt(messageTextArea.value);

    connection.invoke("DoMove", field);
});

function displayMessage(message) {
    const li = document.createElement("li");
    li.innerText = message;
    messagesList.appendChild(li);
}

