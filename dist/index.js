"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const productos_1 = __importDefault(require("./routes/productos"));
const express_handlebars_1 = __importDefault(require("express-handlebars"));
const http = __importStar(require("http"));
const socket_io_1 = require("socket.io");
const producto_1 = require("./classes/producto");
const messages_1 = require("./utils/messages");
const users_1 = require("./utils/users");
//USAR EXPRESS
const app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//LEVANTANDO SERVER
const puerto = 8080;
const myServer = new http.Server(app);
myServer.listen(puerto, () => console.log("Server up en puerto", puerto));
app.use("/api/productos", productos_1.default);
//disponibilizando formulario publico en: http://localhost:8080/public/index.html
const publicPath = path_1.default.resolve(__dirname, "../public");
app.use("/public", express_1.default.static(publicPath));
//CONFIGURANDO HANDLEBARS//
const layoutFolderPath = path_1.default.resolve(__dirname, '../views/layouts');
const defaultLayoutPath = path_1.default.resolve(__dirname, "../views/layouts/index.hbs");
const partialsFolderPath = path_1.default.resolve(__dirname, "../views/partials");
app.set("view engine", "hbs");
app.engine("hbs", express_handlebars_1.default({
    layoutsDir: layoutFolderPath,
    defaultLayout: defaultLayoutPath,
    partialsDir: partialsFolderPath,
    extname: "hbs",
}));
//usando socket.io
const myWSServer = new socket_io_1.Server(myServer);
myWSServer.on("connection", function (socket) {
    console.log("Un cliente se ha conectado");
    //PRODUCTOS
    socket.on("new-product", function (data) {
        console.log("entro el producto");
        producto_1.productos.push(data);
        console.log(producto_1.productos);
        myWSServer.emit("render-product", producto_1.productos);
    });
    //MENSAJES
    const botName = "SantiBot";
    //Elegir sala
    socket.on("joinRoom", ({ username, room }) => {
        const user = users_1.userJoin(socket.id, username, room);
        socket.join(user.room);
        //Mensaje de bienvenida
        socket.emit("message", messages_1.formatMessage(botName, "Bienvenido a SantiChat!"));
        //Broadcast cuando se conecta un usuario
        socket.broadcast.to(user.room).emit("message", messages_1.formatMessage(botName, `${user.username} se ha conectado`));
        //Mandar usuarios y room info
        myWSServer.to(user.room).emit("roomUsers", {
            room: user.room,
            users: users_1.getRoomUser(user.room),
        });
        //Escuchar mensajes en el chat
        socket.on("chatMessage", msg => {
            const user = users_1.getCurrentUser(socket.id);
            myWSServer.to(user.room).emit("message", messages_1.formatMessage(user.username, msg));
        });
        //Run cuando un cliente se desconecta
        socket.on("disconnect", () => {
            const user = users_1.userLeave(socket.id);
            if (user) {
                myWSServer.to(user.room).emit("message", messages_1.formatMessage(botName, `${user.username} ha abandonado el chat`));
                //Mandar usuarios y room info
                myWSServer.to(user.room).emit("roomUsers", {
                    room: user.room,
                    users: users_1.getRoomUser(user.room),
                });
            }
        });
    });
});
