import { Link } from 'react-router'

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 px-4">
      <h1 className="text-4xl font-bold text-slate-900">Mini E-Commerce</h1>
      <p className="mt-3 max-w-md text-center text-sm text-slate-500">
        A demo store with JWT authentication (access + refresh tokens) and full
        product CRUD, built with React, Node, Express and MongoDB.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          to="/register"
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Get started
        </Link>
        <Link
          to="/login"
          className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Login
        </Link>
      </div>
    </div>
  )
}

export default HomePage
