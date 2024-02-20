const defaultTeamEmblem =
  'https://img.freepik.com/premium-vector/soccer-badge-vector-template-football-graphic-illustration-badge-emblem-designs-style_687309-509.jpg?w=1800'

export const TeamEmblem = ({
  emblem,
  className,
}: {
  emblem: string
  className?: string
}) => {
  return (
    <img
      src={emblem || defaultTeamEmblem}
      alt="team emblem"
      className={className}
    />
  )
}
