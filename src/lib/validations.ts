import zod from 'zod'

const championshipSchema = zod.object({
  name: zod.string(),
  teams: zod.array(zod.number()),
})

export type ChampionshipForm = zod.infer<typeof championshipSchema>

export { championshipSchema }
