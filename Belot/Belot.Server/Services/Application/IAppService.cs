using Belot.Data;

namespace Belot.Services.Application
{
    public interface IAppService
    {
        public void SetContext(ApplicationDbContext context);
    }
}
