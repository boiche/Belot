namespace Belot.Models.Belot
{
    /// <summary>
    /// Represents the score of the game
    /// </summary>
    public class Score
    {
        /// <summary>
        /// The team of first and third
        /// </summary>  
        public int TeamA { get; set; }

        /// <summary>
        /// The team of second and fourth
        /// </summary>
        public int TeamB { get; set; }

        /// <summary>
        /// The score of team A for the last game only
        /// </summary>
        public int LastGameTeamA { get; set; }

        /// <summary>
        /// The score of team B for the last game only
        /// </summary>
        public int LastGameTeamB { get; set; }

        public bool IsCapo { get; set; }
        public bool IsVutreTeamA { get; set; }
        public bool IsVutreTeamB { get; set; }
    }
}
