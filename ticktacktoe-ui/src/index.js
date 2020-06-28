let connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:44325/game")
    .build();
 
connection.on("Receive", data => {
    console.log(data);
});
 
connection.start()
    .then(() => connection.invoke("Send", "Hello"));