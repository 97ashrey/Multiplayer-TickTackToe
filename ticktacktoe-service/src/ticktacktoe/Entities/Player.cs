using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ticktacktoe.Entities
{
    public class Player
    {
        public string ConnectionID { get; set; }

        public string Name { get; set; }

        public int Score { get; set; } = 0;
    }
}
