namespace Belot.Models
{
    /// <summary>
    /// Describes an object that is mapped to EF
    /// </summary>
    public abstract class DataEntity
    {
        public DataEntity()
        {
            CreatedOn = DateTime.Now;
            ModifiedOn = DateTime.Now;
        }
        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }

        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }
    }
}
