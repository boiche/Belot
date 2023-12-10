using Belot.Data;
using Belot.Models.DataEntries;
using Belot.Services;
using Belot.Services.Application.Auth;
using Belot.Services.Application.Auth.Interfaces;
using Belot.Services.Belot;
using Belot.Services.Interfaces;
using Belot.Services.Logging;
using Belot.Services.Logging.Interfaces;
using Belot.SignalR;
using Belot.Utils;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.Configure<JWTSettings>(builder.Configuration.GetSection("JWTSettings"));

builder.Services.AddCors(policy => policy.AddPolicy("CorsPolicy", builder =>
{
    builder
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
        .WithOrigins("https://localhost:44441");
}));
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddSignalR();
builder.Services.AddSingleton<IJudgeManager<BelotJudgeService>, JudgeManager<BelotJudgeService>>();
builder.Services.AddScoped<IUserService<ApplicationUser>, UserService>();
builder.Services.AddScoped<IUserBalanceService, UserBalanceService>();
builder.Services.AddScoped<IHandLogger, HandLogger>();
builder.Services.AddControllers();
builder.Services.Configure<IdentityOptions>(config =>
{
    config.SignIn.RequireConfirmedPhoneNumber = false;
    config.SignIn.RequireConfirmedEmail = false;
    config.SignIn.RequireConfirmedAccount = false;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{

}
else
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
//app.UseIdentityServer();
app.UseAuthorization();

app.UseMiddleware<JWTMiddleware>();

app.MapControllers();

app.MapFallbackToFile("index.html");
app.MapHub<BelotHub>("/belotGame");
app.UseCors("CorsPolicy");

app.Run();
