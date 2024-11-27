namespace Belot.Models.DataEntries
{
    using Microsoft.AspNetCore.Identity;

    public class ApplicationUser : IdentityUser
    {
        public ApplicationUser()
        {
            this.Id = Guid.NewGuid().ToString();
            this.CreatedOn = DateTime.UtcNow;
            this.Roles = new HashSet<IdentityUserRole<string>>();
        }

        public Guid UserBalanceId { get; set; }

        public UserBalance UserBalance { get; set; }

        public DateTime CreatedOn { get; set; }

        public virtual ICollection<IdentityUserRole<string>> Roles { get; set; }
    }
}