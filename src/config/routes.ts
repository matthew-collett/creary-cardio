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
    title: 'Authentication Action',
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

const routes = [...publicRoutes, ...protectedRoutes, ...navRoutes]

export const getTitle = (location: Location): string => getRoute(location).title

export const isActiveRoute = (path: string, location: Location): boolean =>
  (location.pathname.slice(1) || '') === path || location.pathname.startsWith(`/${path}/`)

export const getRoute = (location: Location): Route => {
  const pathname = location.pathname.slice(1) || ''
  return (
    routes.find(route => pathname === route.path || pathname.startsWith(`${route.path}/`)) ||
    publicRoutes.find(r => r.path === '*')!
  )
}

export const createRouteConfig = (route: Route): RouteObject => ({
  path: route.path,
  lazy: route.component,
})

export type { Route, AppRoute }
export { protectedRoutes, publicRoutes, navRoutes, routes }
