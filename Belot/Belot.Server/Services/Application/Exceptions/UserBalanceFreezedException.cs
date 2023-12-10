namespace Belot.Services.Application.Exceptions
{
    public class UserBalanceFreezedException : Exception
    {
        public UserBalanceFreezedException()
        {

        }

        public UserBalanceFreezedException(string message) : base(message)
        {

        }
    }
}
