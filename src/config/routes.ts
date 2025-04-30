import { Location, RouteObject } from 'react-router-dom'

interface Route {
  title: string
  path: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: () => Promise<any>
}

const publicRoutes: Route[] = [
  {
    title: 'Login',
    path: 'login',
    component: () => import('@/pages/Login'),
  },
  {
    title: '404 Not Found',
    path: '*',
    component: () => import('@/pages/NotFound'),
  },
]

const protectedRoutes: Route[] = [
  {
    title: 'Home',
    path: '',
    component: () => import('@/pages/Home'),
  },
]

export const routes = [...publicRoutes, ...protectedRoutes]

export const getTitle = (location: Location): string | undefined => {
  return getRoute(location)?.title
}

export const isActiveRoute = (path: string, location: Location): boolean => {
  return location.pathname.split('/')[1] === path
}

export const getRoute = (location: Location): Route | undefined => {
  return (
    routes.find(r => r.path === location.pathname.split('/')[1]) ||
    publicRoutes.find(r => r.path === '*')
  )
}
export const createRouteConfig = (route: Route): RouteObject => ({
  path: route.path,
  lazy: route.component,
})

export type { Route }
export { protectedRoutes, publicRoutes }
