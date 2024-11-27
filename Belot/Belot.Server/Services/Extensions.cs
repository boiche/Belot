namespace Belot.Services
{
    using Models.Belot;
    using Services.Logging;

    public static class Extensions
    {
        /// <summary>
        /// x is the main card
        /// </summary>
        public static readonly Comparison<Card> _noSuitsComparison = (x, y) =>
        {
            if (x.Suit == y.Suit)
            {
                bool firstIsTen = x.Rank == Rank.TEN, secondIsTen = y.Rank == Rank.TEN;
                if (firstIsTen || secondIsTen)
                {
                    if (firstIsTen && y.Rank > Rank.TEN)
                        if (y.Rank == Rank.ACE)
                            return -1;
                        else
                            return 1;

                    else if (secondIsTen && x.Rank > Rank.TEN)
                        if (x.Rank == Rank.ACE)
                            return 1;
                        else
                            return -1;
                    else
                        return x.Rank.CompareTo(y.Rank);
                }
                else
                {
                    return x.Rank.CompareTo(y.Rank);
                }
            }
            else
            {
                return 1;
            }
        };

        public static readonly Comparison<Card> _allSuitsComparison = (x, y) =>
        {
            if (x.Suit == y.Suit)
            {
                if (x.Rank == Rank.JACK)
                    return 1;
                if (y.Rank == Rank.JACK)
                    return -1;

                if (x.Rank == Rank.NINE)
                    return 1;
                if (y.Rank == Rank.NINE)
                    return -1;

                return _noSuitsComparison(x, y);
            }
            else
            {
                return 1;
            }
        };
        public static KeyValuePair<string, Card> GetWinnerNoSuit(this Dictionary<string, Card> playedCards)
        {
            string winnerId = playedCards.First().Key;
            Card winnerCard = playedCards.First().Value;
            int winnerIndex = 0;
            var mainSuit = winnerCard.Suit;

            var ids = playedCards.Where(x => x.Value.Suit == mainSuit).Select(x => x.Key).ToArray();
            var cards = playedCards.Values.Where(x => x.Suit == mainSuit).ToArray();

            for (int i = 0; i < cards.Length; i++)
            {
                if (i == 0)
                    continue;

                if (_noSuitsComparison(cards[winnerIndex], cards[i]) > 0)
                {
                    winnerId = ids[i];
                    winnerCard = cards[i];
                    winnerIndex = i;
                }
            }

            return new KeyValuePair<string, Card>(winnerId, winnerCard);
        }

        public static KeyValuePair<string, Card> GetWinnerAllSuits(this Dictionary<string, Card> playedCards)
        {
            string winnerId = playedCards.First().Key;
            Card winnerCard = playedCards.First().Value;
            int winnerIndex = 0;
            var mainSuit = winnerCard.Suit;

            var ids = playedCards.Where(x => x.Value.Suit == mainSuit).Select(x => x.Key).ToArray();
            var cards = playedCards.Values.Where(x => x.Suit == mainSuit).ToArray();

            for (int i = 0; i < cards.Length; i++)
            {
                if (i == 0)
                    continue;

                if (_allSuitsComparison(cards[winnerIndex], cards[i]) < 0)
                {
                    winnerId = ids[i];
                    winnerCard = cards[i];
                    winnerIndex = i;
                }
            }

            return new KeyValuePair<string, Card>(winnerId, winnerCard);
        }

        public static KeyValuePair<string, Card> GetWinnerSingleSuit(this Dictionary<string, Card> playedCards, Suit announcedSuit)
        {
            string winnerId = playedCards.First().Key;
            Card winnerCard = playedCards.First().Value;
            int winnerIndex = 0;
            var mainSuit = winnerCard.Suit;

            var ids = playedCards.Where(x => x.Value.Suit == mainSuit).Select(x => x.Key).ToArray();

            var cardsMajorSuit = playedCards.Values.Where(x => x.Suit == announcedSuit).ToArray();
            bool hasMajor = cardsMajorSuit.Length > 0;
            var majorIds = playedCards.Where(x => x.Value.Suit == announcedSuit).Select(x => x.Key).ToArray();

            if (!hasMajor)
            {
                cardsMajorSuit = playedCards.Values.Where(x => x.Suit == mainSuit).ToArray();
                for (int i = 0; i < cardsMajorSuit.Length; i++)
                {
                    if (i == 0)
                        continue;

                    if (_noSuitsComparison(cardsMajorSuit[winnerIndex], cardsMajorSuit[i]) < 0)
                    {
                        winnerId = ids[i];
                        winnerCard = cardsMajorSuit[i];
                        winnerIndex = i;
                    }
                }
            }
            else
            {
                if (cardsMajorSuit.Length == 1)
                {
                    winnerId = playedCards.First(x => x.Value.Equals(cardsMajorSuit[0])).Key;
                    winnerCard = cardsMajorSuit[0];
                }
                else
                {
                    for (int i = 0; i < cardsMajorSuit.Length; i++)
                    {
                        if (i == 0)
                            continue;

                        if (_allSuitsComparison(cardsMajorSuit[winnerIndex], cardsMajorSuit[i]) < 0)
                        {
                            winnerId = majorIds[i];
                            winnerCard = cardsMajorSuit[i];
                            winnerIndex = i;
                        }
                    }
                }
            }

            if (winnerCard.Suit != announcedSuit && hasMajor)
                DebugHelper.WriteLine($"Winner card: {winnerCard}, Announcement: {announcedSuit}, MajorSuits: {Environment.NewLine}{string.Join<Card>('\t', cardsMajorSuit)}", Serilog.Events.LogEventLevel.Error);

            return new KeyValuePair<string, Card>(winnerId, winnerCard);
        }
    }
}
