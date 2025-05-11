import { Outlet } from 'react-router-dom'

import { Sidebar, Header } from '@/components'
import { Card } from '@/components/core'

const AppLayout = () => (
  <div className="flex h-dvh w-full bg-primary">
    <Sidebar />
    <main className="flex-1 overflow-y-auto py-6 pr-6 max-md:pl-6 bg-primary">
      <Card className="min-h-full rounded-bl-none border-none">
        <Header />
        <Outlet />
      </Card>
    </main>
  </div>
)

export default AppLayout
