﻿using Microsoft.AspNetCore.Identity;

namespace Belot.Models.DataEntries
{
    public class ApplicationUser : IdentityUser
    {
        public ApplicationUser()
        {
            this.CreatedOn = DateTime.UtcNow;
        }

        public Guid UserBalanceId { get; set; }
        public UserBalance UserBalance { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}