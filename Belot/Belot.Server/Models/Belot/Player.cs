namespace Belot.Models.Belot
{
    public class Player
    {
        public string Username { get; set; }

        public string ConnectionId { get; set; }

        public string Id { get; set; }

        public List<Card> PlayingHand { get; set; }

        public int PlayerIndex { get; set; }

        public bool IsOnTurn { get; set; }

        public GameAnnouncement Announcement { get; set; }

        public Team Team { get => (Team)(PlayerIndex % 2); }

        public Player()
        {
            PlayingHand = [];
        }

        internal void SetAnnouncement(GameAnnouncement announcement) => Announcement = announcement;
    }
}
