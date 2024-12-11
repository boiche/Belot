namespace Belot.Services.Logging
{
    using Serilog;
    using Serilog.Events;
    using Serilog.Sinks.SystemConsole.Themes;

    /// <summary>
    /// Provides basic internal debug methods
    /// </summary>
    public static class DebugHelper
    {
        private static readonly string _loggerPath = "D:\\Belot logs\\logger.txt";
        private static readonly string _exceptionLoggerPath = "D:\\Belot logs\\exceptionLogger.txt";
        private static readonly Serilog.Core.Logger _infoLogger;
        private static readonly Serilog.Core.Logger _exceptionLogger;

        static DebugHelper()
        {
            _infoLogger = new LoggerConfiguration()
                .WriteTo.Console(LogEventLevel.Debug, theme: AnsiConsoleTheme.Code)
                .WriteTo.File(_loggerPath, LogEventLevel.Information, flushToDiskInterval: TimeSpan.FromSeconds(2))
                .CreateLogger();

            _exceptionLogger = new LoggerConfiguration()
                .WriteTo.File(_exceptionLoggerPath, LogEventLevel.Error, flushToDiskInterval: TimeSpan.FromSeconds(2))
                .CreateLogger();

            _infoLogger.Information(new string('*', 100));
            _exceptionLogger.Information(new string('*', 100));
        }

        public static void WriteLine(string message, LogEventLevel logLevel = LogEventLevel.Debug)
        {
            try
            {
                switch (logLevel)
                {
                    case LogEventLevel.Verbose:
                    case LogEventLevel.Debug:
                        {
                            Console.WriteLine(message);
                        }
                        break;
                    case LogEventLevel.Information:
                        {
                            _infoLogger.Information(message);
                            goto case LogEventLevel.Debug;
                        };
                    case LogEventLevel.Warning:
                        {
                            _exceptionLogger.Warning(message);
                        };
                        break;
                    case LogEventLevel.Error:
                        {
                            _exceptionLogger.Error(message);
                        }
                        break;
                    case LogEventLevel.Fatal:
                        {
                            _exceptionLogger.Fatal(message);
                        }
                        break;
                }

            }
            catch (Exception ex)
            {
                while (ex != null)
                {
                    _exceptionLogger.Fatal(ex.Message);
                    ex = ex.InnerException;
                }
            }
        }
    }
}
