using Belot.Models.Belot;

namespace Belot.Services
{
    public static class Extensions
    {
        /// <summary>
        /// x is the main card
        /// </summary>
        private static readonly Comparison<Card> _noSuitsComparison = (x, y) =>
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

        private static readonly Comparison<Card> _allSuitsComparison = (x, y) =>
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
        internal static KeyValuePair<string, Card> GetWinnerNoSuit(this Dictionary<string, Card> playedCards)
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

        internal static KeyValuePair<string, Card> GetWinnerAllSuits(this Dictionary<string, Card> playedCards)
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

        internal static KeyValuePair<string, Card> GetWinnerSingleSuit(this Dictionary<string, Card> playedCards, Suit suit)
        {
            string winnerId = playedCards.First().Key;
            Card winnerCard = playedCards.First().Value;
            int winnerIndex = 0;
            var mainSuit = winnerCard.Suit;

            var ids = playedCards.Where(x => x.Value.Suit == mainSuit).Select(x => x.Key).ToArray();
            var cards = playedCards.Values.Where(x => x.Suit == suit).ToArray();

            if (cards.Length == 0)
            {
                cards = playedCards.Values.Where(x => x.Suit == mainSuit).ToArray();
                for (int i = 0; i < cards.Length; i++)
                {
                    if (i == 0)
                        continue;

                    if (_noSuitsComparison(cards[winnerIndex], cards[i]) < 0)
                    {
                        winnerId = ids[i];
                        winnerCard = cards[i];
                        winnerIndex = i;
                    }
                }
            }
            else
            {
                if (cards.Length == 1)
                {
                    winnerId = playedCards.First(x => x.Value.Equals(cards[0])).Key;
                    winnerCard = cards[0];
                }
                else
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
            }

            return new KeyValuePair<string, Card>(winnerId, winnerCard);
        }
    }
}
