import zod from 'zod'

const championshipSchema = zod.object({
  name: zod.string(),
  teams: zod.array(zod.number()).min(4, {
    message: 'Selecione pelo menos 4 times',
  }),
})

const matchSchema = zod.object({
  id_referee: zod.number(),
  goals: zod.object({
    home: zod.array(
      zod.object({
        player: zod.string(),
      }),
    ),
    visiting: zod.array(
      zod.object({
        player: zod.string(),
      }),
    ),
  }),
  cards: zod.object({
    home: zod.array(
      zod.object({
        player: zod.string(),
        is_red: zod.boolean(),
      }),
    ),
    visiting: zod.array(
      zod.object({
        player: zod.string(),
        is_red: zod.boolean(),
      }),
    ),
  }),
})

export type ChampionshipForm = zod.infer<typeof championshipSchema>
export type MatchForm = zod.infer<typeof matchSchema>

export { championshipSchema, matchSchema }
