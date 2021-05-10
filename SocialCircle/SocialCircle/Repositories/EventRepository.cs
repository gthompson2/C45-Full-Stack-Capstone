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
                        SELECT e.Id as EventId, e.UserId, e.Name as EventName, e.Date, e.Address, 
                               e.Description, e.ActivityId,

                               u.Id as UserProfileId, u.FireBaseUserId, u.DisplayName, u.FirstName,
                               u.LastName, u.Email, u.CreateDateTime,

                               a.Id as ActivityId, a.Name as Activity
                          FROM Event e
                     LEFT JOIN UserProfile u ON e.UserId = u.Id
                     LEFT JOIN Activity a ON e.ActivityId = a.Id
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
                            Name = DbUtils.GetString(reader, "EventName"),
                            Date = DbUtils.GetDateTime(reader, "Date"),
                            Address = DbUtils.GetString(reader, "Address"),
                            Description = DbUtils.GetString(reader, "Description"),
                            ActivityId = DbUtils.GetInt(reader, "ActivityId"),
                            UserProfile = new UserProfile()
                            {
                                Id = DbUtils.GetInt(reader, "UserProfileId"),
                                DisplayName = DbUtils.GetString(reader, "DisplayName"),
                                FirstName = DbUtils.GetString(reader, "FirstName"),
                                LastName = DbUtils.GetString(reader, "LastName"),
                                Email = DbUtils.GetString(reader, "Email"),
                                CreateDateTime = DbUtils.GetDateTime(reader, "CreateDateTime")
                            },
                            Activity = new Activity()
                            {
                                Id = DbUtils.GetInt(reader, "ActivityId"),
                                Name = DbUtils.GetString(reader, "Activity")
                            }
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
                        SELECT e.Id as EventId, e.UserId, e.Name as EventName, e.Date, e.Address, 
                               e.Description, e.ActivityId,

                               u.Id as UserProfileId, u.FireBaseUserId, u.DisplayName, u.FirstName,
                               u.LastName, u.Email, u.CreateDateTime,

                               a.Id as ActivityId, a.Name as Activity
                          FROM Event e
                     LEFT JOIN UserProfile u ON e.UserId = u.Id
                     LEFT JOIN Activity a ON e.ActivityId = a.Id
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
                            Name = DbUtils.GetString(reader, "EventName"),
                            Date = DbUtils.GetDateTime(reader, "Date"),
                            Address = DbUtils.GetString(reader, "Address"),
                            Description = DbUtils.GetString(reader, "Description"),
                            ActivityId = DbUtils.GetInt(reader, "ActivityId"),
                            UserProfile = new UserProfile()
                            {
                                Id = DbUtils.GetInt(reader, "UserProfileId"),
                                DisplayName = DbUtils.GetString(reader, "DisplayName"),
                                FirstName = DbUtils.GetString(reader, "FirstName"),
                                LastName = DbUtils.GetString(reader, "LastName"),
                                Email = DbUtils.GetString(reader, "Email"),
                                CreateDateTime = DbUtils.GetDateTime(reader, "CreateDateTime")
                            },
                            Activity = new Activity()
                            {
                                Id = DbUtils.GetInt(reader, "ActivityId"),
                                Name = DbUtils.GetString(reader, "Activity")
                            }
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
                        SELECT e.Id as EventId, e.UserId, e.Name as EventName, e.Date, e.Address, 
                               e.Description, e.ActivityId,

                               u.Id as UserProfileId, u.FireBaseUserId, u.DisplayName, u.FirstName,
                               u.LastName, u.Email, u.CreateDateTime,

                               a.Id as ActivityId, a.Name as Activity
                          FROM Event e
                     LEFT JOIN UserProfile u ON e.UserId = u.Id
                     LEFT JOIN Activity a ON e.ActivityId = a.Id
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
                            Name = DbUtils.GetString(reader, "EventName"),
                            Date = DbUtils.GetDateTime(reader, "Date"),
                            Address = DbUtils.GetString(reader, "Address"),
                            Description = DbUtils.GetString(reader, "Description"),
                            ActivityId = DbUtils.GetInt(reader, "ActivityId"),
                            UserProfile = new UserProfile()
                            {
                                Id = DbUtils.GetInt(reader, "UserProfileId"),
                                DisplayName = DbUtils.GetString(reader, "DisplayName"),
                                FirstName = DbUtils.GetString(reader, "FirstName"),
                                LastName = DbUtils.GetString(reader, "LastName"),
                                Email = DbUtils.GetString(reader, "Email"),
                                CreateDateTime = DbUtils.GetDateTime(reader, "CreateDateTime")
                            },
                            Activity = new Activity()
                            {
                                Id = DbUtils.GetInt(reader, "ActivityId"),
                                Name = DbUtils.GetString(reader, "Activity")
                            }
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
                        SELECT e.Id as EventId, e.UserId, e.Name as EventName, e.Date, e.Address, 
                               e.Description, e.ActivityId,

                               u.Id as UserProfileId, u.FireBaseUserId, u.DisplayName, u.FirstName,
                               u.LastName, u.Email, u.CreateDateTime,

                               a.Id as ActivityId, a.Name as Activity
                          FROM Event e
                     LEFT JOIN UserProfile u ON e.UserId = u.Id
                     LEFT JOIN Activity a ON e.ActivityId = a.Id
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
                            Name = DbUtils.GetString(reader, "EventName"),
                            Date = DbUtils.GetDateTime(reader, "Date"),
                            Address = DbUtils.GetString(reader, "Address"),
                            Description = DbUtils.GetString(reader, "Description"),
                            ActivityId = DbUtils.GetInt(reader, "ActivityId"),
                            UserProfile = new UserProfile()
                            {
                                Id = DbUtils.GetInt(reader, "UserProfileId"),
                                DisplayName = DbUtils.GetString(reader, "DisplayName"),
                                FirstName = DbUtils.GetString(reader, "FirstName"),
                                LastName = DbUtils.GetString(reader, "LastName"),
                                Email = DbUtils.GetString(reader, "Email"),
                                CreateDateTime = DbUtils.GetDateTime(reader, "CreateDateTime")
                            },
                            Activity = new Activity()
                            {
                                Id = DbUtils.GetInt(reader, "ActivityId"),
                                Name = DbUtils.GetString(reader, "Activity")
                            }
                        });
                    }
                    reader.Close();
                    return events;
                }
            }
        }

        public List<Event> GetUserEventsByActivityId(int userProfileId, int activityId)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        SELECT e.Id as EventId, e.UserId, e.Name as EventName, e.Date, e.Address, 
                               e.Description, e.ActivityId,

                               u.Id as UserProfileId, u.FireBaseUserId, u.DisplayName, u.FirstName,
                               u.LastName, u.Email, u.CreateDateTime,

                               a.Id as ActivityId, a.Name as Activity
                          FROM Event e
                     LEFT JOIN UserProfile u ON e.UserId = u.Id
                     LEFT JOIN Activity a ON e.ActivityId = a.Id
                         WHERE e.ActivityId = @activityId AND e.UserId = @userId
                    ";

                    DbUtils.AddParameter(cmd, "@activityId", activityId);
                    DbUtils.AddParameter(cmd, "@userId", userProfileId);


                    var reader = cmd.ExecuteReader();
                    var events = new List<Event>();
                    while (reader.Read())
                    {
                        events.Add(new Event()
                        {
                            Id = DbUtils.GetInt(reader, "EventId"),
                            UserId = DbUtils.GetInt(reader, "UserId"),
                            Name = DbUtils.GetString(reader, "EventName"),
                            Date = DbUtils.GetDateTime(reader, "Date"),
                            Address = DbUtils.GetString(reader, "Address"),
                            Description = DbUtils.GetString(reader, "Description"),
                            ActivityId = DbUtils.GetInt(reader, "ActivityId"),
                            UserProfile = new UserProfile()
                            {
                                Id = DbUtils.GetInt(reader, "UserProfileId"),
                                DisplayName = DbUtils.GetString(reader, "DisplayName"),
                                FirstName = DbUtils.GetString(reader, "FirstName"),
                                LastName = DbUtils.GetString(reader, "LastName"),
                                Email = DbUtils.GetString(reader, "Email"),
                                CreateDateTime = DbUtils.GetDateTime(reader, "CreateDateTime")
                            },
                            Activity = new Activity()
                            {
                                Id = DbUtils.GetInt(reader, "ActivityId"),
                                Name = DbUtils.GetString(reader, "Activity")
                            }
                        });
                    }
                    reader.Close();
                    return events;
                }
            }
        }

    }
}
