using Belot.Models.Belot;

namespace Belot.Tests
{
    public class Tests
    {
        [Fact]
        public void Test1()
        {            
            List<Dictionary<string, Card>> _testHands = new()
            {
                new Dictionary<string, Card>()
                {
                    { "1", new() { Rank = Rank.SEVEN, Suit = Suit.SPADES } },
                    { "2", new() { Rank = Rank.TEN, Suit = Suit.SPADES } },
                    { "3", new() { Rank = Rank.ACE, Suit = Suit.SPADES } },
                    { "4", new() { Rank = Rank.NINE, Suit = Suit.SPADES } },
                    { "winner", new() { Rank = Rank.ACE, Suit = Suit.SPADES } }
                },
                new Dictionary<string, Card>()
                {
                    { "1", new() { Rank = Rank.QUEEN, Suit = Suit.CLUBS } },
                    { "2", new() { Rank = Rank.TEN, Suit = Suit.CLUBS } },
                    { "3", new() { Rank = Rank.KING, Suit = Suit.CLUBS } },
                    { "4", new() { Rank = Rank.JACK, Suit = Suit.CLUBS } },
                    { "winner",  new() { Rank = Rank.TEN, Suit = Suit.CLUBS } }
                },
                new Dictionary<string, Card>()
                {
                    { "1", new() { Rank = Rank.SEVEN, Suit = Suit.DIAMONDS } },
                    { "2", new() { Rank = Rank.EIGHT, Suit = Suit.DIAMONDS } },
                    { "3", new() { Rank = Rank.NINE, Suit = Suit.DIAMONDS } },
                    { "4", new() { Rank = Rank.TEN, Suit = Suit.DIAMONDS } },
                    { "winner", new() { Rank = Rank.TEN, Suit = Suit.DIAMONDS } }
                },
                new Dictionary<string, Card>
                {
                    { "1", new() { Rank = Rank.ACE, Suit = Suit.HEARTS } },
                    { "2", new() { Rank = Rank.KING, Suit = Suit.HEARTS } },
                    { "3", new() { Rank = Rank.JACK, Suit = Suit.HEARTS } },
                    { "4", new() { Rank = Rank.QUEEN, Suit = Suit.HEARTS } },
                    { "winner", new() { Rank = Rank.JACK, Suit = Suit.HEARTS } }
                },
                new Dictionary<string, Card>
                {
                    { "1", new() { Rank = Rank.ACE, Suit = Suit.SPADES } },
                    { "2", new() { Rank = Rank.JACK, Suit = Suit.DIAMONDS } },
                    { "3", new() { Rank = Rank.SEVEN, Suit = Suit.HEARTS } },
                    { "4", new() { Rank = Rank.TEN, Suit = Suit.CLUBS } },
                    { "winner", new() { Rank = Rank.SEVEN, Suit = Suit.HEARTS } }
                },
                new Dictionary<string, Card> 
                {
                    { "1", new() { Rank = Rank.ACE, Suit = Suit.DIAMONDS } },
                    { "2", new() { Rank = Rank.SEVEN, Suit = Suit.HEARTS } },
                    { "3", new() { Rank = Rank.EIGHT, Suit = Suit.SPADES } },
                    { "4", new() { Rank = Rank.QUEEN, Suit = Suit.HEARTS } },
                    { "winner", new() { Rank = Rank.QUEEN, Suit = Suit.HEARTS } }
                },
                new Dictionary<string, Card>
                {
                    { "1", new() { Rank = Rank.ACE, Suit = Suit.DIAMONDS } },
                    { "2", new() { Rank = Rank.SEVEN, Suit = Suit.HEARTS } },
                    { "3", new() { Rank = Rank.EIGHT, Suit = Suit.DIAMONDS } },
                    { "4", new() { Rank = Rank.QUEEN, Suit = Suit.HEARTS } },
                    { "winner", new() { Rank = Rank.QUEEN, Suit = Suit.HEARTS } }
                }
            };

            foreach (var hand in _testHands)
            {
                var result = Belot.Services.Extensions.GetWinnerSingleSuit(hand.Where(x => x.Key != "winner").ToDictionary(x => x.Key, x => x.Value), Suit.HEARTS);
                Assert.Equal(hand["winner"].ToString(), result.Value.ToString());
            }
        }
    }
}