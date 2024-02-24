import zod from 'zod'

const championshipSchema = zod.object({
  name: zod.string(),
  teams: zod.array(zod.number()).min(4, {
    message: 'Selecione pelo menos 4 times',
  }),
})

export type ChampionshipForm = zod.infer<typeof championshipSchema>

export { championshipSchema }
