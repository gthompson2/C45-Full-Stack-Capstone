using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using SocialCircle.Models;
using SocialCircle.Utils;

namespace SocialCircle.Repositories
{
    public class EventGroupRepository : BaseRepository, IEventGroupRepository
    {
        public EventGroupRepository(IConfiguration configuration) : base(configuration) { }

        public List<EventGroup> GetEventGroupsByEvent(int eventId)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        SELECT eg.Id as EventGroupId, eg.UserId, eg.EventId
                          FROM EventGroup eg
                         WHERE eg.EventId = @eventId
                    ";

                    DbUtils.AddParameter(cmd, "@eventId", eventId);

                    var reader = cmd.ExecuteReader();
                    var eventGroups = new List<EventGroup>();
                    while (reader.Read())
                    {
                        eventGroups.Add(new EventGroup()
                        {
                            Id = DbUtils.GetInt(reader, "EventGroupId"),
                            UserId = DbUtils.GetInt(reader, "UserId"),
                            EventId = DbUtils.GetInt(reader, "EventId")
                        });
                    }
                    reader.Close();
                    return eventGroups;
                }
            }
        }

        public void AddEventGroup(EventGroup eventGroup)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        INSERT INTO EventGroup (UserId, EventId)
                             OUTPUT INSERTED.ID
                             VALUES (@userId, @eventId)";

                    DbUtils.AddParameter(cmd, "@userId", eventGroup.UserId);
                    DbUtils.AddParameter(cmd, "@eventId", eventGroup.EventId);

                    eventGroup.Id = (int)cmd.ExecuteScalar();

                }
            }
        }

        public void DeleteEventGroup(int id)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = "DELETE FROM EventGroup WHERE Id = @id";
                    DbUtils.AddParameter(cmd, "@id", id);
                    cmd.ExecuteNonQuery();
                }
            }
        }
    }
}
