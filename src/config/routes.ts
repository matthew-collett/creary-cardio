import { Icon, IconHome, IconSettings } from '@tabler/icons-react'
import { Location, RouteObject } from 'react-router-dom'

interface Route {
  title: string
  path: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: () => Promise<any>
}

interface AppRoute extends Route {
  icon: Icon
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
  {
    title: 'Auth Action',
    path: 'auth/action',
    component: () => import('@/pages/AuthAction'),
  },
]

const navRoutes: AppRoute[] = [
  {
    title: 'Home',
    path: '',
    icon: IconHome,
    component: () => import('@/pages/Home'),
  },
  {
    title: 'Settings',
    path: 'settings',
    icon: IconSettings,
    component: () => import('@/pages/Settings'),
  },
]

const protectedRoutes: Route[] = [
  ...navRoutes,
  {
    title: 'Account',
    path: 'account',
    component: () => import('@/pages/Account'),
  },
]

export const routes = [...publicRoutes, ...protectedRoutes, ...navRoutes]

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

export type { Route, AppRoute }
export { protectedRoutes, publicRoutes, navRoutes }
