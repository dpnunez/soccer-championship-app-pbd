'use client'

import Link from 'next/link'
import { Button } from './ui'

export const ButtonViewChampionship = ({ id }: { id: string | number }) => {
  return (
    <Button asChild>
      <Link href={`/championship/${id}`}>Ver campeonato</Link>
    </Button>
  )
}
