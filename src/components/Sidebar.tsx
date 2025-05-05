import {
  IconMenuDeep,
  IconSquareRoundedChevronLeft,
  IconSquareRoundedChevronRight,
  IconX,
} from '@tabler/icons-react'
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

import logo from '@/assets/logo.svg'
import { AppRoute, isActiveRoute, navRoutes } from '@/config'

const NavItem = ({
  route,
  isCollapsed,
  onClick,
  location,
}: {
  route: AppRoute
  isCollapsed: boolean
  onClick?: () => void
  location: ReturnType<typeof useLocation>
}) => {
  return (
    <Link
      to={route.path}
      className={`flex items-center py-3 px-8 text-text-light w-fit transition-all duration-200 hover:bg-primary-8 hover:rounded-r-3xl
        ${isActiveRoute(route.path, location) && 'bg-primary-8 rounded-r-3xl'}
        ${isCollapsed && 'pr-5'}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 transition-all duration-200">
        <route.icon size={20} />
        {!isCollapsed && <span>{route.title}</span>}
      </div>
    </Link>
  )
}

export const Sidebar = () => {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsCollapsed(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="flex h-screen">
      {isMobile && (
        <button
          onClick={toggleMobileMenu}
          className={`text-background fixed top-4 right-4 z-50 p-2 bg-accent rounded-radius transform transition-all duration-200 ${isMobileMenuOpen ? 'rotate-90' : 'rotate-0'}`}
        >
          {isMobileMenuOpen ? <IconX size={24} /> : <IconMenuDeep size={24} />}
        </button>
      )}

      <div
        className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-40' : 'relative'} 
          ${isMobileMenuOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'}
          ${isCollapsed ? 'w-[84px]' : 'w-48'} 
          transition-all duration-200 bg-primary
        `}
      >
        <div className="flex items-center justify-center mt-6">
          <img className={isCollapsed ? 'w-14' : 'w-20'} src={logo} alt="Creary CardioLogo" />
        </div>
        <nav className="mt-4">
          <div className="space-y-2">
            {navRoutes.map((route, index) => (
              <NavItem
                key={index}
                route={route}
                isCollapsed={isCollapsed}
                onClick={() => setIsMobileMenuOpen(false)}
                location={location}
              />
            ))}
          </div>
        </nav>

        {!isMobile && (
          <button
            onClick={toggleCollapse}
            className="absolute bottom-6 right-4 hover:cursor-pointer text-background hover:text-accent transition-colors duration-200"
          >
            {isCollapsed ? (
              <IconSquareRoundedChevronRight size={20} />
            ) : (
              <IconSquareRoundedChevronLeft size={20} />
            )}
          </button>
        )}
      </div>
    </div>
  )
}
