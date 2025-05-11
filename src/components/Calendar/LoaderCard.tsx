import { Loader } from '@/components'
import { Card } from '@/components/core'

export const LoaderCard = () => (
  <Card className="bg-white flex justify-center items-center h-[var(--sx-calendar-calculated-height)] max-sm:h-[var(--sx-calendar-calculated-height-sm)]">
    <Loader />
  </Card>
)
