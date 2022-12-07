using Belot.Models;
using Belot.Services.Interfaces;

namespace Belot.Services.Belot
{
    /// <summary>
    /// Used to judge a game of belot
    /// </summary>
    public class BelotJudgeService : IJudgeService
    {
        private readonly Deck _cards;
        private readonly List<Player> players;
        private int dealerPlayer = -1;
        private int playerToPlay;

        public int DealerPlayer
        {
            get => dealerPlayer;
            internal set => dealerPlayer = value > 3 ? 0 : value;
        }
        public int PlayerToPlay
        {
            get => playerToPlay;
            internal set
            {
                playerToPlay = value > 3 ? 0 : value;
                players.ForEach(x => x.IsOnTurn = x.PlayerIndex == playerToPlay);
            }
        }

        public BelotJudgeService()
        {
            _cards = new Deck();
            players = new List<Player>();
        }

        /// <summary>
        /// Indicates which cards were already dealt and not to be dealt again
        /// </summary>
        /// <param name="cards"></param>
        public void DealCards(string playerConnectionId, int count)
        {
            Player player = players.First(x => x.ConnectionId == playerConnectionId);
            for (int i = 0; i < count; i++)
            {
                //TODO: apply real deal logic
                player.PlayingHand.Add(_cards.Dequeue());
            }

            DebugHelper.WriteLine(() => $"Player with connection {playerConnectionId} has been dealt: \n{string.Join('\n', player.PlayingHand)}");
        }

        /// <summary>
        /// Joins a player to the game
        /// </summary>
        /// <param name="player"></param>
        public void AddPlayer(Player player)
        {
            player.PlayerIndex = this.players.Count;
            players.Add(player);
        }

        /// <summary>
        /// Removes a player from the game
        /// </summary>
        /// <param name="player"></param>
        public void RemovePlayer(string connectionId) => players.Remove(players.First(x => x.ConnectionId == connectionId));

        /// <summary>
        /// Prepares all necessary objects in order to start a game in random manner
        /// </summary>
        public void StartGame()
        {
            if (DealerPlayer < 0)
                DealerPlayer = new Random().Next(0, 4);
            else
                DealerPlayer++;

            PlayerToPlay = DealerPlayer + 1;
        }

        internal Player GetPlayer(string connectionId)
        {
            return this.players.First(x => x.ConnectionId == connectionId);
        }

        internal void NextToPlay()
        {
            PlayerToPlay++;
        }
    }
}
