using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ticktacktoe.Types
{
    public class Score
    {
        private readonly Dictionary<string, int> scoreContainer;

        public Score(string[] keys)
        {
            scoreContainer = new Dictionary<string, int>();
            foreach (string player in keys)
            {
                scoreContainer.Add(player, 0);
            }
        }

        public Score()
        {
            scoreContainer = new Dictionary<string, int>();
        }

        public void Increment(string key, int amount)
        {
            scoreContainer[key] += amount;
        }

        public int Get(string key)
        {
            return scoreContainer[key];
        }

        public void RegisterKey(string key)
        {
            scoreContainer.Add(key, 0);
        }

        public Dictionary<string, int> GetAll()
        {
            return scoreContainer;
        }
    }
}
