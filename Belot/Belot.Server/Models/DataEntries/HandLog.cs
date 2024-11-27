namespace Belot.Models.DataEntries
{
    using System.ComponentModel.DataAnnotations;

    public class HandLog : DataEntity
    {
        [Key]
        public int Id { get; set; }

        public char AnnouncedSuit { get; set; }

        public string PlayedCards { get; set; }

        public string PlayerHand { get; set; }

        public string PlayedCard { get; set; }

        public bool Used { get; set; }
    }
}
