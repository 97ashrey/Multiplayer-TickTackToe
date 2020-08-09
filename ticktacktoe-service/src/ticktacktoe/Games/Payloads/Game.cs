using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ticktacktoe.Entities;
using ticktacktoe.Types;

namespace ticktacktoe.Games.Payloads
{
    public class Game
    {
        public string Id { get; set; }

        public List<Player> Players { get; set; }

        public Player CurrentPlayer { get; set; }

        public string[] Board { get; set; }

        public RoundResult RoundResult { get; set; }

        public Score Score { get; set; }
    }
}
