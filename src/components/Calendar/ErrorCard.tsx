import { IconExclamationCircle } from '@tabler/icons-react'

import { Card } from '@/components/core'

export const ErrorCard = ({ message }: { message: string }) => (
  <Card className="bg-white flex justify-center items-center h-[539px]">
    <div className="h-full w-full flex flex-col gap-1 justify-center items-center text-red-500 border border-dashed border-red-500 rounded-radius">
      <IconExclamationCircle size={40} />
      <div className="max-w-full overflow-hidden px-4">
        <p className="text-center">Error loading calendar</p>
        <p className="text-center break-words overflow-auto">{message}</p>
      </div>
    </div>
  </Card>
)
