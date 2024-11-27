namespace Belot.Services.Logging
{
    using Data;
    using Models.Belot;
    using Models.DataEntries;
    using Services.Logging.Interfaces;

    public class HandLogger : IHandLogger
    {
        private readonly ApplicationDbContext _dbContext;

        public HandLogger(ApplicationDbContext context)
        {
            _dbContext = context;
        }

        public HandLog CreateLog(List<Card> playedCards, List<Card> playingHand, Card cardToRemove, GameAnnouncement announcement)
        {
            HandLog handLog = new()
            {
                PlayedCard = CardAsLogString(cardToRemove),
                PlayerHand = string.Join("", playingHand.Select(x => x.ToString())),
                PlayedCards = string.Join("", playedCards.Select(x => x.ToString())),
                Used = false,
                //AnnouncedSuit = announcement
            };
            _dbContext.HandLogs.Add(handLog);
            return handLog;
        }

        public async Task<int> SaveChangesAsync()
            => await _dbContext.SaveChangesAsync();

        private string CardAsLogString(Card card)
            => $"{card.Rank}{Enum.GetName(typeof(Suit), card.Suit)[0].ToString().ToLower()}";
    }
}
