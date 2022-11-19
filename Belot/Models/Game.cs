using System.ComponentModel.DataAnnotations;

namespace Belot.Models
{
    public class Game : DataEntity
    {
        public Game(): base() { }
        [Key]
        public Guid Id { get; set; }
        public int ConnectedPlayers { get; set; }
        public bool HasStarted { get; set; }
    }
}
