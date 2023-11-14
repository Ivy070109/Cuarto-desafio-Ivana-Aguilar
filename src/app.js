import express from "express"
import productRouter from "./routes/product.router.js"
import cartsRouter from "./routes/carts.router.js"
import handlebars from "express-handlebars"
import viewsRouter from './routes/views.router.js'
import ProductManager from "./components/ProductManager.js"
import { __dirname } from "./utils.js"
import { Server } from "socket.io";

const app = express()
const PORT = 8080
const productManager = new ProductManager("/files/products.json")

const httpServer = app.listen(PORT,()=>{
    console.log(`Servidor Express ejecutándose en puerto ${PORT}`)
})

const socketServer = new Server(httpServer)

app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).send('Algo falló')
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static('./src/public'))

app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

app.use("/api/products", productRouter)
app.use("/api/cart", cartsRouter)
app.use('/', viewsRouter)

socketServer.on('connection', async (socket) => {
    console.log('Cliente conectado con id:', socket.id)
    const productsArray = await productManager.getProducts({})
    socketServer.emit('enviarproducts', productsArray)

    socket.on('addProduct', async (obj) => {
        await productManager.addProduct(obj)
        const updatedProducts = await productManager.getProducts({})
    socketServer.emit('productsupdated', updatedProducts)
    })

    socket.on('deleteProduct', async (id) => {
        await productManager.deleteProductById(id)
        const newProductList = await productManager.getProducts({})
    socketServer.emit('productsupdated', newProductList)
    })
})