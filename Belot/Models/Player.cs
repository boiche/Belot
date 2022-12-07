namespace Belot.Models
{
    public class Player
    {
        public string Username { get; set; }
        public string ConnectionId { get; set; }
        public List<Card> PlayingHand { get; set; }
        public int PlayerIndex { get; set; }
        public bool IsOnTurn { get; set; }

        public Player()
        {
            PlayingHand = new List<Card>();
        }
    }
}
