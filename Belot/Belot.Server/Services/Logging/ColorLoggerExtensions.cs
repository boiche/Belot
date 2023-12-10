using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging.Configuration;

namespace Belot.Services.Logging
{
    public static class ColorLoggerExtensions
    {
        public static ILoggingBuilder AddColorConsoleLogger(
        this ILoggingBuilder builder)
        {
            builder.AddConfiguration();

            builder.Services.TryAddEnumerable(
                ServiceDescriptor.Singleton<ILoggerProvider, ColorLoggerProvider>());

            LoggerProviderOptions.RegisterProviderOptions
                <ColorConsoleLoggerConfiguration, ColorLoggerProvider>(builder.Services);

            return builder;
        }

        public static ILoggingBuilder AddColorConsoleLogger(
            this ILoggingBuilder builder,
            Action<ColorConsoleLoggerConfiguration> configure)
        {
            builder.AddColorConsoleLogger();
            builder.Services.Configure(configure);

            return builder;
        }
    }
}
