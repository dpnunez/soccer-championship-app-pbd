interface Championship {
  id: number
  name: string
  status: 'not_started' | 'started' | 'finished'
}

interface Team {
  id: number
  name: string
  emblem: string
}

export type { Championship, Team }
