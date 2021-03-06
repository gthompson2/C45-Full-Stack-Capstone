using SocialCircle.Models;
using System.Collections.Generic;

namespace SocialCircle.Repositories
{
    public interface IEventRepository
    {
        void Add(Event eventObj);
        void Delete(int id);
        List<Event> GetAllEvents();
        Event GetEventById(int id);
        List<Event> GetEventsByActivityId(int activityId);
        List<Event> GetEventsByUserProfileId(int userProfileId);
        List<Event> GetUserEventsByActivityId(int userProfileId, int activityId);
        void Update(Event eventObj);
    }
}