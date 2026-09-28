import { createBrowserRouter, RouterProvider } from "react-router"
import HomePage from "../shared/ui/pages/HomePage"
import LoginPage from "../features/auth/ui/pages/LoginPage"
import RegisterPage from "../features/auth/ui/pages/RegisterPage"
import DashboardPage from "../features/dashboard/ui/pages/DashboardPage"
import PublicProtected from "./protected/PublicProtected"
import MainProtected from "./protected/MainProtected"

const Approutes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PublicProtected />,
      children: [
        {
          path: "",
          element: <HomePage />,
        },
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "register",
          element: <RegisterPage />,
        }
      ]
    },
    {
      path: "/dashboard",
      element: <MainProtected />,
      children: [
        {
          path: "",
          element: <DashboardPage />,
        }
      ]
    }

  ])


  return <RouterProvider router={router} />
}

export default Approutes
