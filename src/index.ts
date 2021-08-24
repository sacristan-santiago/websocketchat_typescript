import express from "express";
import path from "path";
import productosRouter from "./routes/productos";
import handlebars from "express-handlebars";
import * as http from "http";
import {Server, Socket} from "socket.io";
import {productos} from "./classes/producto";
import {formatMessage} from "./utils/messages"
import {userJoin, getCurrentUser, userLeave, getRoomUser} from "./utils/users";

//USAR EXPRESS
const app = express ();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//LEVANTANDO SERVER
const puerto = 8080; 
const myServer = new http.Server(app);
myServer.listen(puerto, ()=>console.log("Server up en puerto", puerto))
app.use("/api/productos", productosRouter);


//disponibilizando formulario publico en: http://localhost:8080/public/index.html
const publicPath = path.resolve(__dirname, "../public");
app.use("/public", express.static(publicPath));

//CONFIGURANDO HANDLEBARS//
const layoutFolderPath = path.resolve(__dirname, '../views/layouts');
const defaultLayoutPath = path.resolve(__dirname, "../views/layouts/index.hbs");
const partialsFolderPath = path.resolve(__dirname, "../views/partials");

app.set("view engine", "hbs");
app.engine("hbs", handlebars ({
    layoutsDir: layoutFolderPath,
    defaultLayout: defaultLayoutPath,
    partialsDir: partialsFolderPath,
    extname: "hbs",
}))

//usando socket.io
const myWSServer =  new Server(myServer);

myWSServer.on("connection", function (socket) {
    console.log("Un cliente se ha conectado");
    
//PRODUCTOS
    socket.on("new-product", function (data) {
        console.log("entro el producto");
        productos.push(data);
        console.log(productos);
        myWSServer.emit("render-product", productos);
    })

//MENSAJES
    const botName = "SantiBot"    

    //Elegir sala
    socket.on("joinRoom", ({username, room}) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        //Mensaje de bienvenida
        socket.emit("message", formatMessage(botName,"Bienvenido a SantiChat!"));
        
        //Broadcast cuando se conecta un usuario
        socket.broadcast.to(user.room).emit("message", formatMessage(botName, `${user.username} se ha conectado`));
        
        //Mandar usuarios y room info
        myWSServer.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUser(user.room),
        })


        //Escuchar mensajes en el chat
        socket.on("chatMessage", msg => {
            const user: any = getCurrentUser(socket.id)

            myWSServer.to(user.room).emit("message", formatMessage(user.username, msg));
        })

        //Run cuando un cliente se desconecta
        socket.on("disconnect", ()=> {
            const user = userLeave(socket.id)
            
            if (user) {
                myWSServer.to(user.room).emit("message", formatMessage(botName, `${user.username} ha abandonado el chat`));
                
                //Mandar usuarios y room info
                myWSServer.to(user.room).emit("roomUsers", {
                    room: user.room,
                    users: getRoomUser(user.room),
                })
            }
        })
    });
})

