namespace Belot.Models.Belot
{
    public class Card
    {
        public Suit Suit { get; set; }
        public Rank Rank { get; set; }
        public int FrameIndex { get; set; }

        public bool Equals(Card? other)
        {
            return other.Suit == this.Suit && other.Rank == this.Rank;
        }

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
