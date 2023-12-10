using Belot.Models.Belot;
using Belot.Models.Http.Requests.SignalR;
using Belot.Services.Interfaces;
using Belot.Services.Logging;

namespace Belot.Services.Belot
{
    /// <summary>
    /// Used to judge a game of belot
    /// </summary>
    public class BelotJudgeService : IJudgeService
    {
        private readonly Deck _cards;
        private int _dealerPlayerIndex = -1;
        private int _playerToPlayIndex;
        private int _passes = 0;
        private readonly GameInfo _gameInfo;

        /// <summary>
        /// The player who deals in current game
        /// </summary>
        public Player DealerPlayer
        {
            get => _gameInfo.Players[_dealerPlayerIndex];
        }

        /// <summary>
        /// The player that is on turn.
        /// </summary>
        public Player PlayerToPlay
        {
            get => _gameInfo.Players[_playerToPlayIndex];
        }

        /// <summary>
        /// The player who will throw first a card in current game
        /// </summary>
        public Player FirstToPlay
        {
            get => _gameInfo.Players[CheckPlayerIndex(_dealerPlayerIndex + 1)];
        }

        /// <summary>
        /// The player whose annouce is played
        /// </summary>
        public Player Announcer
        {
            get => _gameInfo.Players.MaxBy(x => x.Announcement);
        }

        /// <summary>
        /// The currently judged game
        /// </summary>
        internal GameInfo Game { get => _gameInfo; }

        internal GameHandInfo LastHand { get => _gameInfo.Hands.LastOrDefault(); }

        /// <summary>
        /// Creates new judge
        /// </summary>
        public BelotJudgeService()
        {
            _gameInfo = new GameInfo();
            _cards = new Deck();
        }

        /// <summary>
        /// Indicates which cards were already dealt and not to be dealt again
        /// </summary>
        /// <param name="cards"></param>
        public void DealCards(string playerConnectionId, int count)
        {
            Player player = _gameInfo.Players.First(x => x.ConnectionId == playerConnectionId);
            for (int i = 0; i < count; i++)
            {
                player.PlayingHand.Add(_cards.Dequeue());
            }

            DebugHelper.WriteLine($"Player with connection {playerConnectionId} has been dealt: \n{string.Join('\n', player.PlayingHand)}");
        }

        /// <summary>
        /// Joins a player to the game
        /// </summary>
        /// <param name="player"></param>
        public void AddPlayer(Player player)
        {
            player.PlayerIndex = this._gameInfo.Players.Count;
            _gameInfo.Players.Add(player);
        }

        /// <summary>
        /// Removes a player from the game
        /// </summary>
        /// <param name="player"></param>
        public void RemovePlayer(string connectionId) => _gameInfo.Players.Remove(_gameInfo.Players.First(x => x.ConnectionId == connectionId));

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

        public Player GetPlayer(string connectionId)
        {
            return this._gameInfo.Players.First(x => x.ConnectionId == connectionId);
        }

        /// <summary>
        /// Passes the turn to the next player.
        /// </summary>
        internal void NextToPlay()
        {
            if (_gameInfo.LastHandFinished)
                _playerToPlayIndex = _gameInfo.Players.IndexOf(_gameInfo.Players.First(x => x.ConnectionId == _gameInfo.Hands[^1].WonBy));

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
            foreach (var player in _gameInfo.Players)
            {
                foreach (var card in player.PlayingHand)
                {
                    this._cards.Enqueue(card);
                }
                player.PlayingHand.Clear();
            }

            _dealerPlayerIndex = CheckPlayerIndex(DealerPlayer.PlayerIndex + 1);
            _playerToPlayIndex = CheckPlayerIndex(DealerPlayer.PlayerIndex + 1);

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

            if (result > 3)
            {
                throw new Exception("Player index cannot be greater than 3");
            }

            return result;
        }

        internal IEnumerable<Player> GetPlayers() => _gameInfo.Players;

        /// <summary>
        /// Indicates that a single play has finished
        /// </summary>
        /// <returns></returns>
        internal bool GameFinished() => _gameInfo.Hands.Count == 8 && _gameInfo.Hands.Last().WonBy != default;

        /// <summary>
        /// Internal actions when single play has finished
        /// </summary>
        /// <returns>Whether the whole game has finished</returns>
        internal bool FinishGame()
        {
            _gameInfo.GameScore.CalculateScore();

            _cards.CollectCards(_gameInfo.Hands);

            _gameInfo.Hands.Clear();

            return _gameInfo.IsGameOver;
        }

        internal Score GetScore() => _gameInfo.GameScore.Score;

        internal void HandAnnounce(string connectionId, Models.Belot.HandAnnouncement announcement, int? highestRank)
        {
            _gameInfo.AddHandAnnouncement(connectionId, announcement, highestRank);
        }

        internal List<Player> GetWinners()
        {
            List<Player> result = [];
            var players = GetPlayers().ToList();
            var isTeamBWinner = _gameInfo.GameScore.Score.TeamB > _gameInfo.GameScore.Score.TeamA; //always one of the scores is >= 151 here
            return isTeamBWinner ?
                players.Where(x => x.Team == Team.TeamB).ToList() :
                players.Where(x => x.Team == Team.TeamA).ToList();
        }

        internal List<Player> GetLosers()
        {
            return GetPlayers().Except(GetWinners()).ToList();
        }
    }
}
