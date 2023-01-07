namespace Belot.Models.Belot
{
    public class Card
    {
        public Suit Suit { get; set; }
        public Rank Rank { get; set; }
        public int FrameIndex { get; set; }

        public override string ToString()
        {
            return $"Rank: {Rank}, Suit: {Suit}, FrameIndex: {FrameIndex}";
        }
    }

    public enum Suit
    {
        CLUBS,
        DIAMONDS,
        HEARTS,
        SPADES
    }

    public enum Rank
    {
        SEVEN = 7,
        EIGHT,
        NINE,
        TEN,
        JACK,
        QUEEN,
        KING,
        ACE
    }
}
