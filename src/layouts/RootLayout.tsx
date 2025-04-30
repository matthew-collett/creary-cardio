import { Outlet, useLocation } from 'react-router-dom'

import { getTitle } from '@/config'

const RootLayout = () => {
  const location = useLocation()

  return (
    <>
      <title>{`Creary Cardio | ${getTitle(location)}`}</title>
      <Outlet />
    </>
  )
}

export default RootLayout
