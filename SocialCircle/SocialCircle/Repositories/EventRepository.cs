using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using SocialCircle.Models;
using SocialCircle.Utils;


namespace SocialCircle.Repositories
{
    public class EventRepository : BaseRepository, IEventRepository
    {
        public EventRepository(IConfiguration configuration) : base(configuration) { }

        public List<Event> GetAllEvents()
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        SELECT e.Id as EventId, e.UserId, e.Name, e.Date, e.Address, 
                               e.Description, e.ActivityId
                          FROM Event e
                         ORDER BY e.Date desc
                    ";

                    var reader = cmd.ExecuteReader();
                    var events = new List<Event>();
                    while (reader.Read())
                    {
                        events.Add(new Event()
                        {
                            Id = DbUtils.GetInt(reader, "EventId"),
                            UserId = DbUtils.GetInt(reader, "UserId"),
                            Name = DbUtils.GetString(reader, "Name"),
                            Date = DbUtils.GetDateTime(reader, "Date"),
                            Address = DbUtils.GetString(reader, "Address"),
                            Description = DbUtils.GetString(reader, "Description"),
                            ActivityId = DbUtils.GetInt(reader, "ActivityId")
                        });
                    }
                    reader.Close();
                    return events;
                }
            }
        }

        public Event GetEventById(int id)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        SELECT e.Id as EventId, e.UserId, e.Name, e.Date, e.Address, 
                               e.Description, e.ActivityId
                          FROM Event e
                         WHERE e.Id = @id
                    ";
                    DbUtils.AddParameter(cmd, "@id", id);
                    var reader = cmd.ExecuteReader();
                    Event eventObj = null;
                    while (reader.Read())
                    {
                        eventObj = new Event()
                        {
                            Id = DbUtils.GetInt(reader, "EventId"),
                            UserId = DbUtils.GetInt(reader, "UserId"),
                            Name = DbUtils.GetString(reader, "Name"),
                            Date = DbUtils.GetDateTime(reader, "Date"),
                            Address = DbUtils.GetString(reader, "Address"),
                            Description = DbUtils.GetString(reader, "Description"),
                            ActivityId = DbUtils.GetInt(reader, "ActivityId")
                        };
                    }
                    reader.Close();
                    return eventObj;
                }
            }
        }

        public void Add(Event eventObj)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        INSERT INTO Event (UserId, Name, Date, Address, Description, ActivityId)

                             OUTPUT INSERTED.ID

                             VALUES (@userId, @name, @date, @address, @description, @activityId)
                    ";

                    DbUtils.AddParameter(cmd, "@userId", eventObj.UserId);
                    DbUtils.AddParameter(cmd, "@name", eventObj.Name);
                    DbUtils.AddParameter(cmd, "@date", eventObj.Date);
                    DbUtils.AddParameter(cmd, "@address", eventObj.Address);
                    DbUtils.AddParameter(cmd, "@description", eventObj.Description);
                    DbUtils.AddParameter(cmd, "@activityId", eventObj.ActivityId);

                    eventObj.Id = (int)cmd.ExecuteScalar();

                }
            }
        }

        public void Update(Event eventObj)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        UPDATE Event
                           SET UserId = @userId,
                               Name =   @name,
                               Date = @date,
                               Address = @address,
                               Description = @description,
                               ActivityId = @activityId
                         WHERE Id = @id
                    ";

                    DbUtils.AddParameter(cmd, "@id", eventObj.Id);
                    DbUtils.AddParameter(cmd, "@userId", eventObj.UserId);
                    DbUtils.AddParameter(cmd, "@name", eventObj.Name);
                    DbUtils.AddParameter(cmd, "@date", eventObj.Date);
                    DbUtils.AddParameter(cmd, "@address", eventObj.Address);
                    DbUtils.AddParameter(cmd, "@description", eventObj.Description);
                    DbUtils.AddParameter(cmd, "@activityId", eventObj.ActivityId);

                    cmd.ExecuteNonQuery();

                }
            }
        }

        public void Delete(int id)
        {
            using (var conn = Connection)
            {
                conn.Open();
                // Delete all refrences to this event from EventGroup
                // before deleting the event to avoid any FK restraints
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = "DELETE FROM EventGroup WHERE EventId = @eventId";
                    DbUtils.AddParameter(cmd, "@eventId", id);
                    cmd.ExecuteNonQuery();
                }

                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = "DELETE FROM Event WHERE Id = @id";
                    DbUtils.AddParameter(cmd, "@id", id);
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public List<Event> GetEventsByUserProfileId(int userProfileId)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        SELECT e.Id as EventId, e.UserId, e.Name, e.Date, e.Address, 
                               e.Description, e.ActivityId
                          FROM Event e
                         WHERE e.UserId = @userId
                    ";

                    DbUtils.AddParameter(cmd, "@userId", userProfileId);

                    var reader = cmd.ExecuteReader();
                    var events = new List<Event>();
                    while (reader.Read())
                    {
                        events.Add(new Event()
                        {
                            Id = DbUtils.GetInt(reader, "EventId"),
                            UserId = DbUtils.GetInt(reader, "UserId"),
                            Name = DbUtils.GetString(reader, "Name"),
                            Date = DbUtils.GetDateTime(reader, "Date"),
                            Address = DbUtils.GetString(reader, "Address"),
                            Description = DbUtils.GetString(reader, "Description"),
                            ActivityId = DbUtils.GetInt(reader, "ActivityId")
                        });
                    }
                    reader.Close();
                    return events;
                }
            }
        }

        public List<Event> GetEventsByActivityId(int activityId)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        SELECT e.Id as EventId, e.UserId, e.Name, e.Date, e.Address, 
                               e.Description, e.ActivityId
                          FROM Event e
                         WHERE e.ActivityId = @activityId
                    ";

                    DbUtils.AddParameter(cmd, "@activityId", activityId);

                    var reader = cmd.ExecuteReader();
                    var events = new List<Event>();
                    while (reader.Read())
                    {
                        events.Add(new Event()
                        {
                            Id = DbUtils.GetInt(reader, "EventId"),
                            UserId = DbUtils.GetInt(reader, "UserId"),
                            Name = DbUtils.GetString(reader, "Name"),
                            Date = DbUtils.GetDateTime(reader, "Date"),
                            Address = DbUtils.GetString(reader, "Address"),
                            Description = DbUtils.GetString(reader, "Description"),
                            ActivityId = DbUtils.GetInt(reader, "ActivityId")
                        });
                    }
                    reader.Close();
                    return events;
                }
            }
        }

    }
}
