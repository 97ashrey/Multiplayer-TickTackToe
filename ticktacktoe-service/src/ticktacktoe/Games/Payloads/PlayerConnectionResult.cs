using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ticktacktoe.Games.Payloads
{
    public class PlayerConnectionResult
    {
        public bool AllPlayersConnected { get; set; }
        public Game GameState { get; set; }
    }
}
