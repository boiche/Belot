using Belot.Models.Http.Requests.SignalR;
using Belot.Services;
using System.Collections;
using System.Text;

namespace Belot.Models.Belot
{
    public class GameInfo
    {
        private readonly Guid _gameId;
        private readonly List<GameHandInfo> _hands = new();
        private readonly GameScore _score = new();
        private GameAnnouncement _currentAnnouncement;

        public Guid GameId { get => _gameId; }
        public bool LastHandFinished
        {
            get
            {
                try
                {
                    return _hands[^1].WonBy != default;
                }
                catch(ArgumentOutOfRangeException)
                {
                    return false;
                }
            } 
        }
        public GameAnnouncement CurrentAnnouncement { get => _currentAnnouncement; set => _currentAnnouncement = value; }
        public bool IsGameOver { get => _score.IsGameOver(); }
        internal List<GameHandInfo> Hands { get => _hands; }
        internal GameScore Score { get => _score; }

        private void CreateNewHand()
        {
            if (_hands.Count == 0)
                _hands.Add(new GameHandInfo(_currentAnnouncement));
            else if (LastHandFinished)
                _hands.Add(new GameHandInfo(_currentAnnouncement));
        }
        public void UpdateHand(ThrowCardRequest request)
        {
            CreateNewHand();
            _hands.Last().UpdateHand(request);
        }
    }

    /// <summary>
    /// Contains information about single hand played in the game
    /// </summary>
    internal class GameHandInfo
    {
        private readonly GameAnnouncement gameAnnouncement;

        public string WonBy { get; set; }
        public Dictionary<string, Card> PlayedCards { get; set; }

        public GameHandInfo(GameAnnouncement gameAnnouncement)
        {
            this.gameAnnouncement = gameAnnouncement;
            PlayedCards = new();
        }

        public override string ToString()
        {
            StringBuilder builder = new();
            if (PlayedCards.Count < 4)
            {
                builder.Append("Currently played cards: ");

                foreach (var item in PlayedCards)                
                    builder.Append($"\t {item.Value.ToString()}");                
            }
            else
            {
                builder.Append($"Hand was won by: {WonBy}");
            }

            return builder.ToString();
        }

        internal void UpdateHand(ThrowCardRequest request)
        {
            if (gameAnnouncement == GameAnnouncement.PASS)
            {
                throw new InvalidOperationException("Game announcement cannot be PASS");
            }

            PlayedCards.Add(request.OpponentConnectionId, request.Card);
            if (PlayedCards.Count == 4)
            {
                bool isSuit = gameAnnouncement <= GameAnnouncement.SPADES;                

                if (isSuit)
                {
                    var winner = PlayedCards.GetWinnerSingleSuit((Suit)(((int)gameAnnouncement) - 1));
                    this.WonBy = winner.Key;
                }
                else
                {
                    if (gameAnnouncement == GameAnnouncement.NOSUIT)
                    {
                        var winner = PlayedCards.GetWinnerNoSuit();
                        WonBy = winner.Key;
                    }
                    else
                    {
                        var winner = PlayedCards.GetWinnerAllSuits();
                        WonBy = winner.Key;
                    }
                }
            }
        }
    }

    internal class GameScore
    {
        public int TeamA { get; set; }
        public int TeamB { get; set; }

        public bool IsGameOver() => TeamA >= 151 || TeamB >= 151;

        internal void CalculateScore(List<GameHandInfo> playedHands)
        {
            foreach (var hand in playedHands)
            {

            }
        }
    }
}
