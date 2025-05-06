import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { Suspense, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { LoadingScreen } from '@/components'
import { router } from '@/config'
import { AuthProvider } from '@/context'
import { theme } from '@/theme'

import '@/index.css'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <Notifications />
      <AuthProvider>
        <Suspense fallback={<LoadingScreen />}>
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
    </MantineProvider>
  </StrictMode>,
)
