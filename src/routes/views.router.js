import { Router } from 'express'
import ProductManager from '../components/ProductManager.js'

const productManager = new ProductManager("/src/files/products.json")

const router = Router()

router.get('/', async (req, res) => {
    const productsList = await productManager.getProducts({})
    console.log(productsList)
    res.render('home', { productsList })
})

router.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts')
})

export default router