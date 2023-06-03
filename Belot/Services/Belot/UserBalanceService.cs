using Belot.Data;
using Belot.Services.Application;
using Belot.Services.Interfaces;

namespace Belot.Services.Belot
{
    public class UserBalanceService : BaseAppService, IUserBalanceService
    {        
        public UserBalanceService(ApplicationDbContext context)
        {
            base.SetContext(context);       
        }
        public void Deposit(Guid id, decimal amount)
        {
            context.UserBalances.First(x => x.Id == id).Balance += amount;
            context.SaveChanges();
        }

        public void Freeze(Guid id)
        {
            context.UserBalances.First(x => x.Id == id).Freezed = true;
            context.SaveChanges();
        }

        public void Unfreeze(Guid id)
        {
            context.UserBalances.First(x => x.Id == id).Freezed = false;
            context.SaveChanges();
        }

        public void Withdraw(Guid id, decimal amount)
        {
            context.UserBalances.First(x => x.Id == id).Balance -= amount;
            context.SaveChanges();
        }
    }
}
