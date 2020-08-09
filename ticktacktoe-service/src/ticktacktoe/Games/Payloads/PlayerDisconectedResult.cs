using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ticktacktoe.Types;

namespace ticktacktoe.Games.Payloads
{
    public class PlayerDisconectedResult
    {
        public VoteStatus VoteStatus { get; set; }
        public RoundResult RoundResult { get; set; }
    }
}
