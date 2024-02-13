'use client'

type CHStatus = 'not_started' | 'started' | 'finished'

export const ChampionshipStatus = ({ status }: { status: CHStatus }) => {
  return <div>{status}</div>
}
