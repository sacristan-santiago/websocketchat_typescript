export let productos = [
    {
        title: "lapicera",
        price: 50,
        thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/pencil-pen-stationery-school-512.png",
        id: 1
    },
    {
        title: "goma de borrar",
        price: 85,
        thumbnail: "https://cdn1.iconfinder.com/data/icons/interface-travel-and-environment/64/eraser-rubber-interface-512.png",
        id: 2
    },
    {
        title: "papel",
        price: 200,
        thumbnail: "https://cdn2.iconfinder.com/data/icons/round-varieties/60/Rounded_-_High_Ultra_Colour07_-_Lined_Paper-512.png",
        id: 3
    }
]

//Uncommentar debajo para probar else en listar()
//productos = [];

export class Producto {
    title: string;
    price: number;
    thumbnail: string;
    id: number;
    
    constructor (title: string, price: number, thumbnail: string, id: number) {
        this.title = title;
        this.price = price;
        this.thumbnail = thumbnail;
        this.id = id;
    }

    listar() {
        if (productos[0] != null) {
            return productos;
        } else {
            //para probar else descomentar arriba
            return {error: "no hay productos cargados"}
        }
    }

    listarID(req: any) {
        const productoID = req.params.id;
        if (productos[productoID-1] != null) {
            return productos[productoID-1]
        } else {
            return {error: "producto no encontrado"}
        }
        
    }
    guardar (req: any, res: any) {
        const producto = new Producto(req.body.title, req.body.price, req.body.thumbnail, req.body.id)
        productos.push(producto);
        const len = productos.length
        productos[len-1].id = len
        // console.log(productos);
        return "producto guardado";
    }
    actualizar(req: any, res: any) {
        const productoID = parseInt(req.params.id);
        const body = req.body;
        const producto = new Producto(body.title, body.price, body.thumbnail, productoID);
        productos[productoID-1] = producto;
        return productos;
    }
    borrar (req: any, res: any) {
        const productoID = parseInt(req.params.id);
        const producto = new Producto("", 0, "", productoID);
        const productoEliminado = productos[productoID-1];
        productos[productoID-1] = producto;
        return productoEliminado;
    }
    vista() {
        return productos;
    }
}