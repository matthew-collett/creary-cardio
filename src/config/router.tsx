import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { GenericError } from '@/components'
import { publicRoutes, protectedRoutes, createRouteConfig } from '@/config/routes'

const RootLayout = lazy(() => import('@/layouts/RootLayout'))
const AppLayout = lazy(() => import('@/layouts/AppLayout'))
const Protected = lazy(() => import('@/layouts/Protected'))

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <GenericError />,
    children: [
      ...publicRoutes.map(createRouteConfig),
      {
        element: <Protected />,
        children: [
          {
            element: <AppLayout />,
            children: protectedRoutes.map(createRouteConfig),
          },
        ],
      },
    ],
  },
])
