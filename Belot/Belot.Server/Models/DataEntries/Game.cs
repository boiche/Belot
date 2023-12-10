using System.ComponentModel.DataAnnotations;

namespace Belot.Models.DataEntries
{
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
