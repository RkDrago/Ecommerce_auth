import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createProduct, updateProduct } from '../../../products/state/productSlice'

const EMPTY_FORM = {
  name: '',
  price: '',
  category: 'other',
  stock: '',
  description: '',
  imageUrl: '',
}

const CATEGORIES = ['electronics', 'clothing', 'books', 'home', 'toys', 'other']

const toFormData = (product) =>
  product
    ? {
        name: product.name ?? '',
        price: String(product.price ?? ''),
        category: product.category ?? 'other',
        stock: product.stock === null || product.stock === undefined ? '' : String(product.stock),
        description: product.description ?? '',
        imageUrl: product.imageUrl ?? '',
      }
    : EMPTY_FORM

const ProductFormModal = ({ editingProduct, onClose }) => {
  const dispatch = useDispatch()
  const { isSubmitting, actionError, fieldErrors } = useSelector((state) => state.products)

  const [formData, setFormData] = useState(() => toFormData(editingProduct))
  const isEditMode = Boolean(editingProduct)

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: formData.stock === '' ? undefined : Number(formData.stock),
    }

    if (isEditMode) {
      const result = await dispatch(updateProduct({ id: editingProduct._id, formData: payload }))
      if (updateProduct.fulfilled.match(result)) onClose()
    } else {
      const result = await dispatch(createProduct(payload))
      if (createProduct.fulfilled.match(result)) onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            {isEditMode ? 'Edit product' : 'Add new product'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {actionError && (
          <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {actionError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Wireless keyboard"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
              {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>}
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price</label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="499.99"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
              {fieldErrors.price && <p className="mt-1 text-xs text-red-600">{fieldErrors.price}</p>}
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-slate-700">Stock</label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="25"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
              {fieldErrors.stock && <p className="mt-1 text-xs text-red-600">{fieldErrors.stock}</p>}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {fieldErrors.category && <p className="mt-1 text-xs text-red-600">{fieldErrors.category}</p>}
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700">Image URL (optional)</label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://…"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
              {fieldErrors.imageUrl && <p className="mt-1 text-xs text-red-600">{fieldErrors.imageUrl}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Short description of the product…"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
              {fieldErrors.description && <p className="mt-1 text-xs text-red-600">{fieldErrors.description}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {isSubmitting ? 'Saving…' : isEditMode ? 'Update product' : 'Create product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductFormModal
