﻿using Belot.Data;

namespace Belot.Services.Application
{
    public class BaseAppService : IAppService
    {
        protected ApplicationDbContext context;
        public void SetContext(ApplicationDbContext context)
        {
            this.context = context;
        }
    }
}
