using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialCircle.Models
{
    public class EventGroup
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int EventId { get; set; }
    }
}
