using SocialCircle.Models;
using System.Collections.Generic;

namespace SocialCircle.Repositories
{
    public interface IEventGroupRepository
    {
        void AddEventGroup(EventGroup eventGroup);
        void DeleteEventGroup(int id);
        List<EventGroup> GetEventGroupsByEvent(int eventId);
    }
}