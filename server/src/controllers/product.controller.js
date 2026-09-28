import ProductModel from '../models/product.model.js'

const createProductController = async (req, res, next) => {
    try {
        const { name, price, category, stock, description, imageUrl } = req.body

        const product = await ProductModel.create({
            name,
            price,
            category,
            stock: stock ?? 0,
            description: description ?? '',
            imageUrl: imageUrl ?? '',
            createdBy: req.user._id,
        })

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: { product },
        })
    } catch (error) {
        next(error)
    }
}

const getProductsController = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const { category } = req.query

        const filter = category ? { category } : {}

        const [products, total] = await Promise.all([
            ProductModel.find(filter)
                .populate('createdBy', 'name email')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            ProductModel.countDocuments(filter),
        ])

        res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            data: {
                products,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            },
        })
    } catch (error) {
        next(error)
    }
}

const getProductByIdController = async (req, res, next) => {
    try {
        const product = await ProductModel.findById(req.params.id).populate('createdBy', 'name email')

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            })
        }

        res.status(200).json({
            success: true,
            message: 'Product fetched successfully',
            data: { product },
        })
    } catch (error) {
        next(error)
    }
}

const updateProductController = async (req, res, next) => {
    try {
        const product = await ProductModel.findById(req.params.id)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            })
        }

        if (product.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not allowed to update this product',
            })
        }

        const allowedFields = ['name', 'price', 'category', 'stock', 'description', 'imageUrl']
        const updates = {}
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field]
            }
        }

        const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        }).populate('createdBy', 'name email')

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: { product: updatedProduct },
        })
    } catch (error) {
        next(error)
    }
}

const deleteProductController = async (req, res, next) => {
    try {
        const product = await ProductModel.findById(req.params.id)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            })
            
        }

        if (product.createdBy.toString() !== req.user._id.toString()) {
            
            return res.status(403).json({
                success: false,
                message: 'You are not allowed to delete this product',
            })
        }

        await ProductModel.findByIdAndDelete(req.params.id)

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

export {
    createProductController,
    getProductsController,
    getProductByIdController,
    updateProductController,
    deleteProductController,
}
