namespace Belot.Models.DataEntries
{
    using System.ComponentModel.DataAnnotations;

    public class BlackListIp : DataEntity
    {
        public BlackListIp() : base() { }

        public string IPAddress { get; internal set; }

        public bool Active { get; internal set; }

        [Key]
        public Guid Id { get; internal set; }
    }
}
