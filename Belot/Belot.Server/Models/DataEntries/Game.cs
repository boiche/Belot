namespace Belot.Models.DataEntries
{
    using System.ComponentModel.DataAnnotations;

    public class Game : DataEntity
    {
        public Game() : base() { }

        [Key]
        public Guid Id { get; set; }

        public int ConnectedPlayers { get; set; }

        public bool HasStarted { get; set; }

        public decimal PrizePool { get; set; }
    }
}
