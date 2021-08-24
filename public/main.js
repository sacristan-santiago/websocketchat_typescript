const socket = io.connect('http://localhost:8080', { forceNew: true });

//PRODUCTOS
const sendProduct = () => {
    console.log("se envia el form");
    const title = document.getElementById("title");
    const price = document.getElementById("price");
    const thumbnail = document.getElementById("thumbnail");
    data = {
        title: title.value,
        price: price.value,
        thumbnail: thumbnail.value,
    }
    socket.emit("new-product", data);
}

const render = (data) => {
    console.log("se modifico la tabla");
    const tr =   data.map(function (elem, index) {
      return `
      <tr>    
        <td>${elem.title}</td>
        <td>${elem.price}</td>
        <td><img width="100px", height="100px" src="${elem.thumbnail}" alt="fotito"
    <tr>`;
    }).join(' ');

    const table = `
    <table id="tabla" cellspacing="20px" cellpadding="25px" border="1px">
        <tr>
            <th>Nombre del producto</th>
            <th>Precio</th>
            <th>Foto</th>
        </tr>
        ${tr}
    </table>    
    `
    document.getElementById('tabla').innerHTML = table;
    console.log("se modifico la tabla");
}

socket.on("render-product", function(data) {
    console.log(data)
    console.log("nuevo producto");
    render(data);
})

//MENSAJES
console.log("esta vivo el main")

const chatForm = document.getElementById("chat-form")
const chatMessages = document.querySelector(".chat-messages")
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

//username y room from URL 
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

//Entrar en una sala
socket.emit("joinRoom", {username, room});

//Tomar sala y usuarios
socket.on("roomUsers", ({room, users})=> {
    outputRoomName(room);
    outputUsers(users);
})

socket.on("message", message => {
    console.log(message);
    outputMessage(message);

    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatForm.addEventListener("submit", (e)=> {
    e.preventDefault();

    const msg = e.target.elements.msg.value ; 
    socket.emit("chatMessage", msg)
    console.log(msg);

    //Limpiar input msg
    e.target.elements.msg.value = "";
})

//Cargar mensaje en el DOM
function outputMessage(message) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p>`
    document.querySelector(".chat-messages").appendChild(div)
}

//add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room; 
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML  = `
    ${users.map(user => `<li class="userList">${user.username}</li>`).join("")}
    `;
}