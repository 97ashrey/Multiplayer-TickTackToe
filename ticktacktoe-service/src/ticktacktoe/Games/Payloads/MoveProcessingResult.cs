using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ticktacktoe.Helpers;
using ticktacktoe.Types;

namespace ticktacktoe.Games.Payloads
{
    public class MoveProcessingResult
    {
        public string[] Board { get; set; }

        public Player CurrentPlayer { get; set; }

        public Score Score { get; set; }

        public RoundResult RoundResult { get; set; }
    }
}
