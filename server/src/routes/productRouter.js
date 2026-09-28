import express from 'express'
import { createProductController, getProductsController, getProductByIdController, updateProductController, deleteProductController, } from '../controllers/product.controller.js'
import { createProductValidator, updateProductValidator, productIdValidator, listProductsValidator, } from '../validators/product.validators.js'
import validate from '../middlewares/validate.middleware.js'
import authenticate from '../middlewares/authenticate.middleware.js'

const router = express.Router()

// public-- reads
router.get('/', listProductsValidator, validate, getProductsController)
router.get('/:id', productIdValidator, validate, getProductByIdController)

// protected-- writes
router.post('/', authenticate, createProductValidator, validate, createProductController)
router.put('/:id', authenticate, updateProductValidator, validate, updateProductController)
router.delete('/:id', authenticate, productIdValidator, validate, deleteProductController)

export default router
