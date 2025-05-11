import { useNavigate } from 'react-router-dom'

import logo from '@/assets/logo.svg'
import { Button } from '@/components/core'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background text-foreground p-4">
      <img src={logo} alt="Not Found" className="w-48 max-w-md mb-8" />
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-muted-foreground mb-6 text-center">
        Sorry, the page you&apos;re looking for does not exist or has been moved.
      </p>
      <Button className="!w-fit" onClick={() => navigate('/')}>
        Go Back Home
      </Button>
    </div>
  )
}

export default NotFoundPage
