using System.ComponentModel.DataAnnotations;

namespace Belot.Models.DataEntries
{
    public class UserBalance : DataEntity
    {
        public UserBalance() : base() { }

        [Key]
        public Guid Id { get; set; }
        public decimal Balance { get; set; }
        public bool Freezed { get; set; }

        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
    }
}
