namespace Belot.Models
{
    /// <summary>
    /// Describes a turn in belot game
    /// </summary>
    public class Turn
    {
        public Card ThrownCard { get; set; }
        public ApplicationUser Player { get; set; }
        /// <summary>
        /// Used to indicate which player (as position on the table) has made a turn
        /// </summary>
        public int PlayerNumber { get; set; }
    }
}
