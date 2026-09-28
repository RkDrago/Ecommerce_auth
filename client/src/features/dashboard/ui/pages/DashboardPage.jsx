import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { fetchProducts, deleteProduct, clearMessage, clearProductErrors } from '../../../products/state/productSlice'
import ProductFormModal from '../../../products/ui/components/ProductFormModal'
import { logoutUser } from '../../../auth/state/authSlice'

const CATEGORIES = ['all', 'electronics', 'clothing', 'books', 'home', 'toys', 'other']

const DashboardPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { products, pagination, isLoading, message, listVersion } = useSelector((state) => state.products)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(fetchProducts({ page, limit: 6, category: category === 'all' ? undefined : category }))
  }, [dispatch, page, category, listVersion])


  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => dispatch(clearMessage()), 2500)
    return () => clearTimeout(timer)
  }, [message, dispatch])



  useEffect(() => {
    if (!isAuthenticated) navigate('/login', { replace: true })
  }, [isAuthenticated, navigate])


  const openCreateModal = () => {
    setEditingProduct(null)
    dispatch(clearProductErrors())
    setModalOpen(true)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    dispatch(clearProductErrors())
    setModalOpen(true)
  }

  const handleDelete = (product) => {
    if (window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      dispatch(deleteProduct(product._id))
    }
  }

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/login', { replace: true })
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingProduct(null)
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Product Dashboard</h1>
            <p className="text-xs text-slate-500">
              {user ? `Logged in as ${user.name} (${user.email})` : 'Loading…'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openCreateModal}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              + Add product
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {message && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => { setCategory(c); setPage(1) }}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${category === c
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
                }`}
            >
              {c}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-sm text-slate-500">Loading products…</div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl bg-white py-20 text-center">
            <p className="text-sm text-slate-500">No products found. Click “+ Add product” to create one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                {/* Product Image */}
                <div className="h-48 w-full bg-slate-100">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      No image
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                        {product.category}
                      </span>

                      <h3 className="mt-2 font-semibold text-slate-900">
                        {product.name}
                      </h3>
                    </div>

                    <span className="whitespace-nowrap font-bold text-slate-900">
                      ₹{product.price}
                    </span>
                  </div>

                  {product.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                      {product.description}
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`text-xs font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"
                        }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </span>

                    {product.createdBy?.name && (
                      <span className="text-xs text-slate-400">
                        by {product.createdBy.name}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(product)}
                      className="flex-1 rounded-lg border border-slate-300 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      className="flex-1 rounded-lg border border-red-200 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm disabled:opacity-40"
            >
              ← Prev
            </button>
            <span className="text-sm text-slate-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              type="button"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}
      </main>

      {modalOpen && (
        <ProductFormModal
          key={editingProduct?._id ?? 'create'}
          editingProduct={editingProduct}
          onClose={closeModal}
        />
      )}
    </div>
  )
}

export default DashboardPage
