using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ticktacktoe.Helpers;

namespace ticktacktoe.Games
{
    public class MoveProcessingResult
    {
        public string[] Board { get; set; }

        public Player CurrentPlayer { get; set; }

        public Score Score { get; set; }

        public bool RoundOver { get; set; }

        public string LineThrough { get; set; }
    }
}
