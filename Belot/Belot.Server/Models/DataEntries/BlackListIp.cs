using Belot.Models.Http.Requests;
using System.ComponentModel.DataAnnotations;

namespace Belot.Models.DataEntries
{
    public class BlackListIp : DataEntity
    {
        public BlackListIp() : base() { }        
        public string IPAddress { get; internal set; }
        public bool Active { get; internal set; }
        [Key]
        public Guid Id { get; internal set; }
    }
}
