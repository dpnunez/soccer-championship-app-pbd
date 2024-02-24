import { Card } from '@/components/ui'
import { BackpackIcon, PersonIcon, ViewGridIcon } from '@radix-ui/react-icons'
import React from 'react'

interface DashboardSummaryProps {
  championship: number
  teams: number
  players: number
}

export const DashboardSummary = ({
  championship,
  teams,
  players,
}: DashboardSummaryProps) => {
  return (
    <div className="flex gap-8">
      <SummaryCard number={championship} label="Campeonatos">
        <ViewGridIcon
          width={100}
          height={100}
          className="absolute right-5 -bottom-4 opacity-5"
        />
      </SummaryCard>
      <SummaryCard number={teams} label="Times">
        <BackpackIcon
          width={100}
          height={100}
          className="absolute right-5 -bottom-4 opacity-5"
        />
      </SummaryCard>
      <SummaryCard number={players} label="Jogadores">
        <PersonIcon
          width={100}
          height={100}
          className="absolute right-5 -bottom-4 opacity-5"
        />
      </SummaryCard>
    </div>
  )
}

interface SummaryCardProps {
  number: number
  label: string
  children: React.ReactNode
}

const SummaryCard = ({ number, label, children }: SummaryCardProps) => {
  return (
    <Card className="flex-1 flex flex-col p-6 relative overflow-hidden hover:scale-105 transition-all cursor-cell">
      <span className="font-bold text-lg">{label}</span>
      <span className="text-5xl font-bold">{number}</span>
      {children}
    </Card>
  )
}
