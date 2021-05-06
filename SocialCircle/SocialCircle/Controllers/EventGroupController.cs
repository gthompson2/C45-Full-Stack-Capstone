using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using SocialCircle.Models;
using SocialCircle.Repositories;

namespace SocialCircle.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EventGroupController : ControllerBase
    {
        private readonly IEventGroupRepository _eventGroupRepository;

        public EventGroupController(IEventGroupRepository eventGroupRepository)
        {
            _eventGroupRepository = eventGroupRepository;
        }

        // http://localhost:5001/api/EventGroup/GetEventGroupsByEvent/2
        [HttpGet("GetEventGroupsByEvent/{id}")]
        public IActionResult GetEventGroupsByEvent(int id)
        {
            var eventGroups = _eventGroupRepository.GetEventGroupsByEvent(id);
            if (eventGroups == null)
            {
                return NotFound();
            }
            return Ok(eventGroups);
        }

        // http://localhost:5001/api/EventGroup/
        [HttpPost]
        public IActionResult Post(EventGroup eventGroup)
        {
            _eventGroupRepository.AddEventGroup(eventGroup);
            return CreatedAtAction("Get", new { id = eventGroup.Id }, eventGroup);
        }

        // http://localhost:5001/api/EventGroup/2
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _eventGroupRepository.DeleteEventGroup(id);
            return NoContent();
        }

    }
}
