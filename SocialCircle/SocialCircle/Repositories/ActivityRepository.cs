using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using SocialCircle.Models;
using SocialCircle.Utils;

namespace SocialCircle.Repositories
{
    public class ActivityRepository : BaseRepository, IActivityRepository
    {
        // MVP: get all activities so the front-end can put them
        // in a dropdown
        public ActivityRepository(IConfiguration configuration) : base(configuration) { }

        public List<Activity> GetAllActivities()
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        SELECT a.Id, a.Name
                          FROM Activity a
                    ";

                    var reader = cmd.ExecuteReader();
                    var activities = new List<Activity>();
                    while (reader.Read())
                    {
                        activities.Add(new Activity()
                        {
                            Id = DbUtils.GetInt(reader, "Id"),
                            Name = DbUtils.GetString(reader, "Name")
                        });
                    }
                    reader.Close();
                    return activities;
                }
            }
        }
    }

}
