namespace Belot.Services.Application
{
    using Data;

    public class BaseAppService : IAppService
    {
        protected ApplicationDbContext context;

        public void SetContext(ApplicationDbContext context)
        {
            this.context = context;
        }
    }
}
