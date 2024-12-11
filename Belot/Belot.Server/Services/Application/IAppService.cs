namespace Belot.Services.Application
{
    using Data;

    public interface IAppService
    {
        public void SetContext(ApplicationDbContext context);
    }
}
