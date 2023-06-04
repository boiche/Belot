import { Guid } from 'guid-typescript'
import { GameAnnouncement } from './Announcement';

class BelotGame {
  gameId!: Guid;
  prizePool!: number;
  dealerIndex!: PlayerNumber;
  currentAnnouncement!: GameAnnouncement;
  counterAnnouncement!: GameAnnouncement;
}

export default BelotGame
