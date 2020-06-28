using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ticktacktoe.Entities
{
    public class GameState
    {
        public Guid ID { get; set; }

        public List<Player> Players { get; set; }

        public Player CurrentPlayer { get; set; }

        public List<string> Board { get; set; }
    }
}
