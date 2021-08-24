"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const producto_1 = require("../classes/producto");
let producto = new producto_1.Producto("", 0, "", 0);
const router = express_1.default.Router();
router.get("/listar", (req, res) => {
    res.json(producto.listar());
});
router.get("/listar/:id", (req, res) => {
    res.json(producto.listarID(req));
});
router.post("/guardar", (req, res) => {
    res.send(producto.guardar(req, res));
});
//para probar el metodo guardar pasar en POST el siguiente elemento como raw/json: 
//{"title":"sacapuntas","price":150,"thumbnail":"https://www.shutterstock.com/es/image-vector/pencil-sharpener-vector-design-illustration-isolated-1417489541"}
router.put("/actualizar/:id", (req, res) => {
    res.json(producto.actualizar(req, res));
});
router.delete("/borrar/:id", (req, res) => {
    res.json(producto.borrar(req, res));
});
router.get("/vista", (req, res) => {
    const productos = producto.vista();
    if (productos[0] != null) {
        const dataDinamica = {
            productos: productos,
            mostrarTabla: true,
        };
        res.render("main", dataDinamica);
    }
    else {
        //para probar else descomentar productos=[] en ../classes/producto.js
        res.json({ msj: "No hay productos" });
    }
});
router.get("/formulario", (req, res) => {
    const productos = producto.vista();
    const dataDinamica = {
        mostrarFormulario: true,
        productos: productos,
        mostrarLoggin: true,
    };
    res.render("main", dataDinamica);
});
// router.post("/formulario/submit-form", (req, res) => {
//     producto.guardar(req);
//     res.redirect("/api/productos/vista"); 
// })
router.get("/chat", (req, res) => {
    const productos = producto.vista();
    const dataDinamica = {
        mostrarFormulario: true,
        productos: productos,
        mostrarLoggin: false,
        mostrarChat: true,
    };
    res.render("main", dataDinamica);
});
exports.default = router;
