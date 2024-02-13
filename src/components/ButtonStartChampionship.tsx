'use client'

import { api } from '@/lib/api'
import { Button } from './ui'
import { useToast } from './ui/use-toast'
import { AxiosError } from 'axios'

export const ButtonStartChampionship = ({ id }: { id: number }) => {
  const { toast } = useToast()

  const handleStart = async () => {
    try {
      // ToDo: add toastInfo on axios response
      const { toastInfo } = await api.post('/api/championship/start', {
        id,
      })
      if (toastInfo) toast(toastInfo)
    } catch (err) {
      toast((err as AxiosError).toastInfo)
    }
  }

  return (
    <Button onClick={handleStart}>Iniciar campeonato e gerar tabelas</Button>
  )
}
