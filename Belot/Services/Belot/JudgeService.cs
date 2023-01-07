using Belot.Models.Belot;
using Belot.Models.Http.Requests.SignalR;
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
        private int _dealerPlayerIndex = -1;
        private int _playerToPlayIndex;
        private int _passes = 0;
        private readonly GameInfo _gameInfo;

        /// <summary>
        /// The player who deals in current game
        /// </summary>
        public Player DealerPlayer
        {
            get => _players[_dealerPlayerIndex];
        }

        /// <summary>
        /// The player that is on turn.
        /// </summary>
        public Player PlayerToPlay
        {
            get => _players[_playerToPlayIndex];
        }

        /// <summary>
        /// The player who will throw first a card in current game
        /// </summary>
        public Player FirstToPlay 
        { 
            get => _players[CheckPlayerIndex(_dealerPlayerIndex + 1)]; 
        }
        internal GameHandInfo LastHand { get => _gameInfo.Hands.LastOrDefault(); }

        public BelotJudgeService()
        {
            _gameInfo = new GameInfo();
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
            if (_dealerPlayerIndex < 0)
                _dealerPlayerIndex = new Random().Next(0, 4);
            else
                _dealerPlayerIndex = CheckPlayerIndex(_dealerPlayerIndex++);
            
            _playerToPlayIndex = CheckPlayerIndex(_dealerPlayerIndex + 1);
        }

        public void UpdateGameHand(ThrowCardRequest request)
        {
            _gameInfo.UpdateHand(request);
        }

        internal Player GetPlayer(string connectionId)
        {
            return this._players.First(x => x.ConnectionId == connectionId);
        }

        /// <summary>
        /// Passes the turn to the next player.
        /// </summary>
        internal void NextToPlay()
        {
            if (_gameInfo.LastHandFinished)            
                _playerToPlayIndex = _players.IndexOf(_players.First(x => x.ConnectionId == _gameInfo.Hands[^1].WonBy));
            
            else
                _playerToPlayIndex = CheckPlayerIndex(_playerToPlayIndex + 1);
        }

        internal bool LastHandFinished() => _gameInfo.LastHandFinished;

        /// <summary>
        /// Checks current state of passes.
        /// </summary>
        /// <returns>Whether to start new deal or continue announcing.</returns>
        internal bool CheckPasses() => _passes == 4;

        internal void Announce(string connectionId, GameAnnouncement announcement)
        {
            if (announcement > _gameInfo.CurrentAnnouncement)
            {
                _passes = 0;
                _gameInfo.CurrentAnnouncement = announcement;
                GetPlayer(connectionId).SetAnnouncement(announcement);
            }
            else if (announcement == GameAnnouncement.PASS)
                _passes++;
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

            DealerPlayer.PlayerIndex++;
            PlayerToPlay.PlayerIndex = DealerPlayer.PlayerIndex + 1;
            _passes = 0;
            _gameInfo.CurrentAnnouncement = GameAnnouncement.PASS;
        }

        /// <summary>
        /// Checks current state of announcements.
        /// </summary>
        /// <returns>Whether to start second deal or continue announcing.</returns>
        internal bool CheckSecondDeal()
        {
            bool result = _passes == 3 && _gameInfo.CurrentAnnouncement > GameAnnouncement.PASS;

            if (result)
            {
                _playerToPlayIndex = CheckPlayerIndex(_dealerPlayerIndex + 1);
            }

            return result;
        }

        /// <summary>
        /// Ensures that given index is valid player index.
        /// </summary>
        /// <param name="index"></param>
        /// <returns></returns>
        private int CheckPlayerIndex(int index) => index > 3 ? 0 : index;

        /// <summary>
        /// Computes the relative index of a player based on the main player provided.
        /// </summary>
        /// <param name="connectionId">Player's connection to be computed</param>
        /// <param name="mainPlayer">Main player's connection</param>
        /// <returns></returns>
        internal int GetRelativePlayerIndex(string connectionId, string mainPlayer)
        {
            int result = 0;
            int opponentIndex = GetPlayer(connectionId).PlayerIndex;
            int mainPlayerIndex = GetPlayer(mainPlayer).PlayerIndex;

            while (opponentIndex != mainPlayerIndex)
            {
                result++;
                mainPlayerIndex++;
                if (mainPlayerIndex > 3)
                    mainPlayerIndex = 0;
            }

            return result;
        }

        internal IEnumerable<Player> GetPlayers() => _players;
    }
}
