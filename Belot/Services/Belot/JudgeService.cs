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
        private readonly List<Player> _players;
        private GameAnnouncement _currentAnnouncement;
        private int _dealerPlayer = -1;
        private int _playerToPlay;
        private int _passes = 0;

        public int DealerPlayer
        {
            get => _dealerPlayer;
            internal set => _dealerPlayer = value > 3 ? 0 : value;
        }
        public int PlayerToPlay
        {
            get => _playerToPlay;
            internal set
            {
                _playerToPlay = value > 3 ? 0 : value;
                _players.ForEach(x => x.IsOnTurn = x.PlayerIndex == _playerToPlay);
            }
        }

        public BelotJudgeService()
        {
            _cards = new Deck();
            _players = new List<Player>();
        }

        /// <summary>
        /// Indicates which cards were already dealt and not to be dealt again
        /// </summary>
        /// <param name="cards"></param>
        public void DealCards(string playerConnectionId, int count)
        {
            Player player = _players.First(x => x.ConnectionId == playerConnectionId);
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
            player.PlayerIndex = this._players.Count;
            _players.Add(player);
        }

        /// <summary>
        /// Removes a player from the game
        /// </summary>
        /// <param name="player"></param>
        public void RemovePlayer(string connectionId) => _players.Remove(_players.First(x => x.ConnectionId == connectionId));

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
            return this._players.First(x => x.ConnectionId == connectionId);
        }

        internal void NextToPlay()
        {
            PlayerToPlay++;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns>Wether to start new deal or continue current deal.</returns>
        internal bool CheckAnnouncement(string connectionId, GameAnnouncement announcement)
        {
            if (announcement > _currentAnnouncement)
            {
                _passes = 0;
                _currentAnnouncement = announcement;
                GetPlayer(connectionId).SetAnnouncement(announcement);
            }
            else if (announcement == GameAnnouncement.PASS)
                _passes++;
            
            return _passes == 4 || (_passes == 3 && _currentAnnouncement > GameAnnouncement.PASS);
        }

        internal void DealNew()
        {
            foreach (var player in _players)
            {
                foreach (var card in player.PlayingHand)
                {
                    this._cards.Enqueue(card);
                }
                player.PlayingHand.Clear();
            }

            DealerPlayer++;
            PlayerToPlay = DealerPlayer + 1;
            _passes = 0;
            _currentAnnouncement = GameAnnouncement.PASS;
        }
    }
}
