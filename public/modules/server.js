const socket = new WebSocket("ws://" + location.host);
socket.addEventListener("open", () => {
    socket.send("open");
});

socket.addEventListener("message", (res) => {
    console.log(res.data);
});

export default socket;