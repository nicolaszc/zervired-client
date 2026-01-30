import {
  faTrophy,
  faMedal,
  faStar,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons'

export function getRankIcon(rank: number) {
  switch (rank) {
    case 3:
      return faTrophy
    case 2:
      return faMedal
    case 1:
      return faStar
    default:
      return faThumbsUp
  }
}
