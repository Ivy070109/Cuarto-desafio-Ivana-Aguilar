import fs from "fs"
class ProductManager {
  constructor() {
    this.path = './src/files/products.json'
    //importo el json a una carpeta aparte, ya que presentaba errores cuando la mantenia en la misma carpeta y de paso es más limpia la organización
    this.products = []
  }

  //leer productos
  readProducts = async () => {
    try {
      const response = await fs.promises.readFile(this.path, { encoding: 'utf-8' })
      return JSON.parse(response)  
    } catch (err) {
      return console.error(err)
    }
  }

  //Objetener todos los productos
  getProducts = async () => {
    try {
      const productList = await this.readProducts()
      return productList
    } catch (err) {
      return console.error(err)
    }
  }

  //Obtener productos según su id
  getProductbyId = async (id) => {
    try {
      const productById = await this.exist(id)
      //con éste método asignado de node puedo reemplazar y simplificar todos los métodos find
      if(!productById) {
          return "Ese producto no existe"
      } else {
          return productById
      }
    } catch (err) {
      return console.error(err)
    }
  }
  
  //Generar id autoincrementable
  generateId = async () => {
    try {
      if (fs.existsSync(this.path)) {
        //busco la existencia de ésta ruta con éste método predeterminado de node
        const productList = await this.readProducts()
        const counter = productList.length
        if (counter == 0) {
          return 1
        } else {
          return productList[counter - 1 ].id + 1
        }
      }
    } catch (err) {
      return console.error(err)
    }
  }

  //Creación de producto
  addProduct = async (obj) => {
    try {
      const {title, description, price, thumbnail, category, status=true, code, stock} = obj

      if (!title || !description || !price || !category || !code ||!status || !stock || !thumbnail) {
        return ("Debes proporcionar todos los campos completos. Todos los valores son obligatorios.")
      } else {
        const productArray = await this.getProducts({})
        const existCodeInProducts = productArray.some((elemento) => elemento.code === code)
        if (existCodeInProducts) {
            return(`El código ${code} no puede repetirse`)
        } else {
        const id = await this.generateId()
        const newProduct = {
          id,
          title,
          description,
          price,
          category,
          status,
          thumbnail,
          code,
          stock,
          }
        productArray.push(newProduct)
        await fs.promises.writeFile(this.path, JSON.stringify(productArray, null, 2))
        return "Producto agregado"
        }
      }
    } catch (err) {
      return console.error(err)
    }
  }

  //Borrar producto según su id
  deleteProductById = async (id) => {
    try {
      const productDetected = await this.readProducts()
      const productFilter = productDetected.filter(products => products.id != id)
      await fs.promises.writeFile(this.path, JSON.stringify(productFilter, null, 2))
  
      return `El producto con el ID ${id} ha sido eliminado`  
    } catch (err) {
      return console.error(err)
    }
  }

  //Actualizar productos según su id
  updateProduct = async (id, product) => {
    try {
      const productDetected = await this.readProducts()
      const loadProduct = productDetected.filter(product => product.id != id)
      await fs.promises.writeFile(this.path, JSON.stringify(loadProduct, null, 2))
      const oldProduct = await this.readProducts()
      const modifiedProduct = [
          {id: id, ...product}, ...oldProduct
      ]
      await fs.promises.writeFile(this.path, JSON.stringify(modifiedProduct, null, 2))

      return `El producto con el ID ${id} ha sido actualizado`     
    } catch (error) {
      return console.error(error)
    }
  }
}

export default ProductManager

//instanciar la clase
//const products = new ProductManager('./products.json')

        //primera llamada con array vacio
//console.log(products.getProduct())

        //producto agregado fallido
//products.addProduct("producto1", 300, "abc785", 56)

        //validar el code
//products.addProduct("product Fail", "éste producto es falso", 865, "sin imagen", "abc123", 78)

    //agregar productos
    /*
products.addProduct("producto prueba", "éste es el primer producto de prueba", 200, "sin imagen", "abc123", 25)
products.addProduct("producto1", "Éste es el segundo producto de prueba", 500, "sin imagen", "abc124", 45)
products.addProduct("product2", "éste es el tercer producto de prueba", 800, "sin imagen", "abc129", 62)
products.addProduct("product3", "éste es el cuarto producto de prueba", "sin imagen", 1502, "abc125", 65)
products.addProduct("product4", "éste es el quinto producto de prueba", 745, "sin imagen", "abc126", 98)
products.addProduct("product5", "éste es el sexto producto de prueba", 5745, "sin imagen", "abc12f", 63)
products.addProduct("product6", "éste es el séptimo producto de prueba", 8123, "sin imagen", "abc12c", 898)
products.addProduct("product7", "éste es el octavo producto de prueba", 9895, "sin imagen", "abc871", 68)
products.addProduct("product8", "éste es el noveno producto de prueba", 336, "sin imagen", "abce52", 22)
products.addProduct("product9", "éste es el décimo producto de prueba", 7482, "sin imagen", "abd826", 99)
*/

    //llamada del array con productos agregados
//console.log(products.getProducts())

    //buscar producto por id
//products.getProductById(1)
//products.getProductById(4)
//products.getProductById(8)
    //id fail
//products.getProductById(8)
//products.getProductById(6)

    //actualizar productos
/*
products.updateProducts({
    id: 4, 
    title: 'producto rosa',
    description: 'Producto de prueba para las modificaciones',
    price: 2800,
    thumbnail: 'sin imagen',
    code: 'abdf1855',
    stock: 25
})*/

    //eliminar productos 
//products.deleteProductById(6)

