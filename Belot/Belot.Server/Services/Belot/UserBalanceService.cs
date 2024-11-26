namespace Belot.Services.Belot
{
    using Data;
    using Microsoft.EntityFrameworkCore;
    using Models.DataEntries;
    using Services.Application;
    using Services.Application.Exceptions;
    using Services.Interfaces;

    public class UserBalanceService : BaseAppService, IUserBalanceService
    {
        public UserBalanceService(ApplicationDbContext context)
        {
            base.SetContext(context);
        }

        public async Task DepositAsync(Guid id, decimal amount)
        {
            var balance = await this.context.UserBalances.FirstAsync(x => x.Id == id);

            if (ValidateAction(balance))
            {
                balance.Balance += amount;
                balance.ModifiedOn = DateTime.UtcNow;
                context.SaveChangesAsync();
            }
        }

        public async Task FreezeAsync(Guid id)
        {
            var balance = await this.context.UserBalances.FirstAsync(x => x.Id == id);
            balance.Freezed = true;
            balance.ModifiedOn = DateTime.UtcNow;

            context.SaveChangesAsync();
        }

        public async Task UnfreezeAsync(Guid id)
        {
            var balance = await this.context.UserBalances.FirstAsync(x => x.Id == id);
            balance.Freezed = false;
            balance.ModifiedOn = DateTime.UtcNow;

            context.SaveChangesAsync();
        }

        public async Task WithdrawAsync(Guid id, decimal amount)
        {
            var balance = await this.context.UserBalances.FirstAsync(x => x.Id == id);

            if (ValidateAction(balance, amount))
            {
                balance.Balance -= amount;
                balance.ModifiedOn = DateTime.UtcNow;

                context.SaveChangesAsync();
            }
        }

        // Do we need this function as it does not deduct balance such as WithdrawAsync method ?
        public async Task<(bool Success, Exception? Error)> TryWithdrawAsync(Guid id, decimal amount)
        {
            try
            {
                var balance = await this.context.UserBalances.FirstAsync(x => x.Id == id);
                ValidateAction(balance, amount);

                return (true, null);
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
