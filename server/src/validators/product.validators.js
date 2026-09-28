import { body, param, query } from 'express-validator'
import mongoose from 'mongoose'

//:id must be a valid Mongo ObjectId before we ever hit the DB
const idParamValidator = [
    param('id')
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Invalid product id'),
]

const nameRule = body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Name must be 3-100 characters')

const priceRule = body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a number greater than or equal to 0')
    .toFloat()

const categoryRule = body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isIn(['electronics', 'clothing', 'books', 'home', 'toys', 'other'])
    .withMessage('Category must be one of: electronics, clothing, books, home, toys, other')

    
const stockRule = body('stock')
    .optional({ values: 'null' })
    .isInt({ min: 0 }).withMessage('Stock must be a whole number greater than or equal to 0')
    .toInt()

const descriptionRule = body('description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 500 }).withMessage('Description can be at most 500 characters')

const imageUrlRule = body('imageUrl')
    .optional({ values: 'falsy' })
    .trim()
    .isURL().withMessage('imageUrl must be a valid URL')

export const createProductValidator = [
    nameRule,
    priceRule,
    categoryRule,
    stockRule,
    descriptionRule,
    imageUrlRule,
]

const requireAtLeastOne = body().custom((value, { req }) => {
    const allowed = ['name', 'price', 'category', 'stock', 'description', 'imageUrl']
    const hasAny = allowed.some((field) => req.body?.[field] !== undefined)
    if (!hasAny) {
        throw new Error('Provide at least one field to update')
    }
    return true
})

export const updateProductValidator = [
    ...idParamValidator,
    requireAtLeastOne,

    body('name').optional({ values: 'falsy' }).trim()
        .isLength({ min: 3, max: 100 }).withMessage('Name must be 3-100 characters'),
    body('price').optional({ values: 'null' })
        .isFloat({ min: 0 }).withMessage('Price must be a number greater than or equal to 0')
        .toFloat(),
    body('category').optional({ values: 'falsy' }).trim()
        .isIn(['electronics', 'clothing', 'books', 'home', 'toys', 'other'])
        .withMessage('Category must be one of: electronics, clothing, books, home, toys, other'),
    stockRule,
    descriptionRule,
    imageUrlRule,
]

// id validation for GET one /PUT /DELETE
export const productIdValidator = idParamValidator

// GET /api/products?page=1&limit=10&category=books (pagination/query — all optional)
export const listProductsValidator = [
    query('page').optional({ values: 'falsy' })
        .isInt({ min: 1 }).withMessage('page must be a positive integer')
        .toInt(),
    query('limit').optional({ values: 'falsy' })
        .isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100')
        .toInt(),
    query('category').optional({ values: 'falsy' }).trim()
        .isIn(['electronics', 'clothing', 'books', 'home', 'toys', 'other'])
        .withMessage('Category must be one of: electronics, clothing, books, home, toys, other'),
]
