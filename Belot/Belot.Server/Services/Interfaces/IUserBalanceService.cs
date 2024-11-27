namespace Belot.Services.Interfaces
{
    public interface IUserBalanceService
    {
        /// <summary>
        /// Adds funds to player's acount
        /// </summary>
        /// <param name="id">Player's id</param>
        /// <param name="amount">Amount to withdraw</param>
        Task DepositAsync(Guid id, decimal amount);

        /// <summary>
        /// Withdraws from player's acount 
        /// </summary>
        /// <param name="id">Player's id</param>
        /// <param name="amount">Amount to withdraw</param>
        Task WithdrawAsync(Guid id, decimal amount);

        /// <summary>
        /// Attempts a withdraw from player's account
        /// </summary>
        /// <param name="id">Player's id</param>
        /// <param name="amount">Amount to withdraw</param>
        /// <returns>Status of operation and error's details</returns>
        Task<(bool Success, Exception? Error)> TryWithdrawAsync(Guid id, decimal amount);

        /// <summary>
        /// Blocks player's account
        /// </summary>
        /// <param name="id">Player's id</param>
        Task FreezeAsync(Guid id);

        /// <summary>
        /// Unblocks player's account
        /// </summary>
        /// <param name="id">Player's id</param>
        Task UnfreezeAsync(Guid id);
    }
}
