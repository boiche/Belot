namespace Belot.Services.Interfaces
{
    public interface IUserBalanceService
    {
        void Deposit(Guid id, decimal amount);
        void Withdraw(Guid id, decimal amount);
        void Freeze(Guid id);
        void Unfreeze(Guid id);
    }
}
