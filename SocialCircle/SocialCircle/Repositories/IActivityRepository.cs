using SocialCircle.Models;
using System.Collections.Generic;

namespace SocialCircle.Repositories
{
    public interface IActivityRepository
    {
        List<Activity> GetAllActivities();
    }
}