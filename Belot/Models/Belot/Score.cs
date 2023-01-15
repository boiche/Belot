namespace Belot.Models.Belot
{
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
    }
}
