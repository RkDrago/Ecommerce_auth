import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router'
import { fetchMe } from '../../features/auth/state/authSlice'

const PublicProtected = () => {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchMe())
  }, [dispatch])

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default PublicProtected
