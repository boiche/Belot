using Belot.Models.Belot;
using Belot.Models.Http.Requests.SignalR;
using System.Text;

namespace Belot.Services.Belot
{
    internal class GameInfo
    {
        private readonly Guid _gameId;
        private readonly List<GameHandInfo> _hands = new();
        private readonly List<HandAnnouncement> _handAnnouncements = new();
        private readonly GameScore _score;
        private GameAnnouncement _currentAnnouncement;
        private List<Player> _players = new();

        public GameInfo()
        {
            _score = new(this);
        }

        internal Guid GameId { get => _gameId; }
        internal bool LastHandFinished
        {
            get
            {
                try
                {
                    return _hands[^1].WonBy != default;
                }
                catch (ArgumentOutOfRangeException)
                {
                    return false;
                }
            }
        }
        internal GameAnnouncement CurrentAnnouncement { get => _currentAnnouncement; set => _currentAnnouncement = value; }
        internal bool IsGameOver { get => _score.IsGameOver(); }
        internal List<GameHandInfo> Hands { get => _hands; }
        internal GameScore GameScore { get => _score; }
        internal List<Player> Players { get => _players; }
        internal List<HandAnnouncement> HandAnnouncements { get => this._handAnnouncements; }

        private void CreateNewHand()
        {
            if (_hands.Count == 0)
                _hands.Add(new GameHandInfo(_currentAnnouncement));
            else if (LastHandFinished)
                _hands.Add(new GameHandInfo(_currentAnnouncement));
        }
        internal void UpdateHand(ThrowCardRequest request)
        {
            CreateNewHand();
            _hands.Last().UpdateHand(request);
        }
        internal void AddHandAnnouncement(string connectionId, Models.Belot.HandAnnouncement announcment, int? highestRank = null)
        {
            this._handAnnouncements.Add(new HandAnnouncement()
            {
                Points = (int)announcment,
                HighestRank = highestRank,
                Announcer = connectionId
            });
        }
    }

    /// <summary>
    /// Contains information about single hand played in the game
    /// </summary>
    internal class GameHandInfo
    {
        private readonly GameAnnouncement gameAnnouncement;

        internal string WonBy { get; set; }
        internal Dictionary<string, Card> PlayedCards { get; set; }

        internal GameHandInfo(GameAnnouncement gameAnnouncement)
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
                    var winner = PlayedCards.GetWinnerSingleSuit((Suit)((int)gameAnnouncement - 1));
                    WonBy = winner.Key;
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

    internal class HandAnnouncement
    {
        public int Points { get; set; }
        public int? HighestRank { get; set; }
        public string Announcer { get; set; }
        public int Team { get; set; }
    }

    public class GameScore
    {
        private readonly Dictionary<Rank, int> _noSuitPoints = new()
        {
            { Rank.SEVEN, 0 },
            { Rank.EIGHT, 0 },
            { Rank.NINE, 0 },
            { Rank.JACK, 2 },
            { Rank.QUEEN, 3 },
            { Rank.KING, 4 },
            { Rank.TEN, 10 },
            { Rank.ACE, 11 }
        };
        private readonly Dictionary<Rank, int> _suitPoints = new()
        {
            { Rank.SEVEN, 0 },
            { Rank.EIGHT, 0 },
            { Rank.QUEEN, 3 },
            { Rank.KING, 4 },
            { Rank.TEN, 10 },
            { Rank.ACE, 11 },
            { Rank.NINE, 14 },
            { Rank.JACK, 20 }
        };
        private readonly GameInfo _gameInfo;      

        internal Score Score { get; set; }


        internal bool IsGameOver() => Score.TeamA >= 151 || Score.TeamB >= 151;

        internal GameScore(GameInfo gameInfo)
        {
            _gameInfo = gameInfo;
            Score = new();
        }

        internal void CalculateScore()
        {
            Score.LastGameTeamA = default;
            Score.LastGameTeamB = default;
            Score.IsVutreTeamA = default;
            Score.IsVutreTeamB = default;
            Score.IsCapo = default;

            #region BaseCount
            List<string> playerIds = _gameInfo.Players.Select(x => x.ConnectionId).ToList();
            Player announcer = _gameInfo.Players.MaxBy(x => x.Announcement);
            foreach (var hand in _gameInfo.Hands)
            {
                foreach (var card in hand.PlayedCards)
                {
                    if (card.Value.Suit == (Suit)((int)announcer.Announcement - 1) || announcer.Announcement == GameAnnouncement.ALLSUITS)
                    {
                        if (playerIds.IndexOf(hand.WonBy) % 2 == 0)
                            Score.LastGameTeamA += _suitPoints[card.Value.Rank];
                        else
                            Score.LastGameTeamB += _suitPoints[card.Value.Rank];
                    }
                    else
                    {
                        if (playerIds.IndexOf(hand.WonBy) % 2 == 0)
                            Score.LastGameTeamA += _noSuitPoints[card.Value.Rank];
                        else
                            Score.LastGameTeamB += _noSuitPoints[card.Value.Rank];
                    }
                }
            }
            #endregion

            #region HandAnnouncements
            this._gameInfo.HandAnnouncements.ForEach(x => x.Team = playerIds.IndexOf(announcer.ConnectionId) % 2);    
            var announcements = this._gameInfo.HandAnnouncements.GroupBy(x => x.Points).OrderByDescending(x => x.Key).ToList();
            int dominatingTeam = -1;

            foreach (IGrouping<int, HandAnnouncement> group in announcements)
            {
                if (dominatingTeam < 0)
                {
                    if (group.Count() > 1 && group.All(x => x.HighestRank.HasValue)) //this group is the highest point announcements (excl. FOAK and Belot)
                    {
                        var highestRanks = group.OrderByDescending(x => x.HighestRank).DistinctBy(x => x.Team);
                        if (highestRanks.Count() > 1) //both teams have the best hand announce
                            break;
                        else
                        {
                            var announcement = highestRanks.First();
                            dominatingTeam = announcement.Team;
                            if (dominatingTeam == 0)
                                Score.LastGameTeamA += announcement.Points;
                            else
                                Score.LastGameTeamB += announcement.Points;
                        }                        
                    }
                    else //only one of the dominating kind announcement has been announced
                    {
                        var dominatingAnnouncement = group.First();
                        dominatingTeam = dominatingAnnouncement.Team;

                        if (dominatingTeam == 0)
                            Score.LastGameTeamA += dominatingAnnouncement.Points;
                        else
                            Score.LastGameTeamB += dominatingAnnouncement.Points;
                    }
                }
                else
                {
                    var eligableAnnouncements = group.Where(x => x.Team == dominatingTeam).ToList();
                    foreach (var item in eligableAnnouncements)
                    {
                        if (dominatingTeam == 0)
                            Score.LastGameTeamA += item.Points;
                        else
                            Score.LastGameTeamB += item.Points;
                    }
                }
            }

            #endregion

            #region LastTen
            if (playerIds.IndexOf(_gameInfo.Hands[^1].WonBy) % 2 == 0) //is last hand won by TeamA
                Score.LastGameTeamA += 10;
            else
                Score.LastGameTeamB += 10;
            #endregion

            #region Vutre
            if (playerIds.IndexOf(announcer.ConnectionId) % 2 == 0) //is announcer of TeamA
            {
                if (Score.LastGameTeamA < Score.LastGameTeamB)
                {
                    Score.IsVutreTeamA = true;
                    Score.TeamB += Round(Score.LastGameTeamA + Score.LastGameTeamB, announcer.Announcement);
                }
                else if (Score.LastGameTeamA == Score.LastGameTeamB) //TODO: keep Score.TeamA score for next game
                    Score.TeamB += Round(Score.LastGameTeamB, announcer.Announcement);
                else
                {
                    Score.TeamA += Round(Score.LastGameTeamA, announcer.Announcement);
                    Score.TeamB += Round(Score.LastGameTeamB, announcer.Announcement);
                }

            }
            else
            {
                if (Score.LastGameTeamB < Score.LastGameTeamA)
                {
                    Score.IsVutreTeamB = true;
                    Score.TeamA += Round(Score.LastGameTeamA + Score.LastGameTeamB, announcer.Announcement);
                }
                else if (Score.LastGameTeamB == Score.LastGameTeamA) //TODO: keep Score.TeamB score for next game
                    Score.TeamA += Round(Score.LastGameTeamA, announcer.Announcement);
                else
                {
                    Score.TeamA += Round(Score.LastGameTeamA, announcer.Announcement);
                    Score.TeamB += Round(Score.LastGameTeamB, announcer.Announcement);
                }
            }
            #endregion            

            Score.LastGameTeamA = Round(Score.LastGameTeamA, announcer.Announcement);
            Score.LastGameTeamB = Round(Score.LastGameTeamB, announcer.Announcement);
        }

        private int Round(int score, GameAnnouncement announcement)
        {
            if (announcement <= GameAnnouncement.SPADES)
                return score / 10 + (score % 6 >= 0 ? 1 : 0);
            if (announcement == GameAnnouncement.ALLSUITS)
                return score / 10 + (score % 5 >= 0 ? 1 : 0);
            else
                return score / 10 + (score % 5 >= 0 ? 1 : 0);
        }
    }
}
