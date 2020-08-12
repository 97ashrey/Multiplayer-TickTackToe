using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ticktacktoe.Games.Payloads
{
    public class Player
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string Move { get; set; }

        public bool Connected { get; set; }
    }
}
