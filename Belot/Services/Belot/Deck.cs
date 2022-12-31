using Belot.Models;
using System.Diagnostics;

namespace Belot.Services.Belot
{
    public class Deck : Queue<Card>
    {
        private Card this[int index]
        {
            get { return this.ToArray()[index]; }
            set { ToArray()[index] = value; }
        }
        public Deck()
        {
            Initialize();
            Shuffle();
        }

        private void Shuffle()
        {
            Random random = new();
            for (int i = 0, index = 0, randomIndex = random.Next(0, 32); i < 1024; i++, index++)
            {
                while (randomIndex == index)
                {
                    randomIndex = random.Next(0, 32);
                }

                Card temp = new()
                {
                    Rank = this[index].Rank,
                    Suit = this[index].Suit,
                    FrameIndex = this[index].FrameIndex,    
                }, toSwap = this[randomIndex];

                this[index].Suit = toSwap.Suit;
                this[index].Rank = toSwap.Rank;
                this[index].FrameIndex = toSwap.FrameIndex;

                toSwap.Rank = temp.Rank;
                toSwap.Suit = temp.Suit;
                toSwap.FrameIndex = temp.FrameIndex;

                if (index >= 31)
                {
                    index = 0;
                }
            }
        }        

        private void Initialize()
        {
            int frameIndex = 0;

            for (int rank = 7; rank < 15; rank++)
            {
                for (int suit = 0; suit < 4; suit++)
                {
                    this.Enqueue(new Card()
                    {
                        Suit = (Suit)suit,
                        Rank = (Rank)rank,
                        FrameIndex = frameIndex
                    });
                    frameIndex++;
                }
            }
        }

        private void Cut(int index)
        {
            try
            {
                var firstHalf = this.Take(index);
                var secondHalf = this.TakeLast(this.Count - index);

                this.Clear();

                foreach (var item in secondHalf)
                    this.Enqueue(item);

                foreach (var item in firstHalf)
                    this.Enqueue(item);
            }
            catch (IndexOutOfRangeException)
            {
                Cut(32 / 2);
            }
        }
    }
}
