import { Guid } from 'guid-typescript'
import { GameAnnouncement } from './Announcement';

class BelotGame {
  id!: Guid;
  prizePool!: number;
  dealerIndex!: PlayerNumber;
  currentAnnouncement!: GameAnnouncement;
  counterAnnouncement!: GameAnnouncement;
  connectedPlayers!: number;
}

export default BelotGame
