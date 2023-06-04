using Belot.Data;
using Belot.Models.DataEntries;
using Belot.Services.Application;
using Belot.Services.Application.Exceptions;
using Belot.Services.Interfaces;
using System.Data.SqlTypes;

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
            var balance = context.UserBalances.First(x => x.Id == id);
            if (ValidateAction(balance)) 
            {
                balance.Balance += amount;
                balance.ModifiedOn = DateTime.UtcNow;
                context.SaveChanges();
            }
        }

        public void Freeze(Guid id)
        {
            var balance = context.UserBalances.First(x => x.Id == id);
            balance.Freezed = true;
            balance.ModifiedOn = DateTime.UtcNow;
            context.SaveChanges();
        }

        public void Unfreeze(Guid id)
        {
            var balance = context.UserBalances.First(x => x.Id == id);
            balance.Freezed = false;
            balance.ModifiedOn = DateTime.UtcNow;
            context.SaveChanges();
        }

        public void Withdraw(Guid id, decimal amount)
        {            
            var balance = context.UserBalances.First(x => x.Id == id);
            if (ValidateAction(balance, amount))
            {
                balance.Balance -= amount;
                balance.ModifiedOn = DateTime.UtcNow;
                context.SaveChanges();
            }
        }

        public (bool, Exception?) TryWithdraw(Guid id, decimal amount)
        {
            try
            {
                var balance = context.UserBalances.First(x => x.Id == id);
                ValidateAction(balance, amount);
                return (true, default);
            }
            catch (Exception e)
            {
                return (false, e);
            }
        }

        private bool ValidateAction(UserBalance balance, decimal amount = decimal.MinValue)
        {
            if (balance.Freezed)
                throw new UserBalanceFreezedException($"User Balance is freezed");
            else if (balance.Balance < amount)
                throw new NotEnoughAmountException($"Insufficient amount. Required {amount:F2}, but available {balance.Balance:F2}");
            else
                return true;
        }
    }
}
