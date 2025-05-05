import { Outlet } from 'react-router-dom'

import { Sidebar, Header } from '@/components'
import { Card } from '@/components/core'

const AppLayout = () => (
  <div className="flex h-svh w-full overflow-hidden bg-primary">
    <Sidebar />
    <main className="flex-1 overflow-y-auto py-6 pr-6 max-md:pl-6">
      <Card className="min-h-full rounded-bl-none border-none">
        <Header />
        <div className="">
          <Outlet />
        </div>
      </Card>
    </main>
  </div>
)

export default AppLayout
