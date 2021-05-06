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
    public class EventController : ControllerBase
    {
        private readonly IEventRepository _eventRepository;

        public EventController(IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
        }

        // http://localhost:5001/api/event/
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_eventRepository.GetAllEvents());
        }

        // http://localhost:5001/api/event/2
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var eventObj = _eventRepository.GetEventById(id);
            if (eventObj == null)
            {
                return NotFound();
            }
            return Ok(eventObj);
        }

        // http://localhost:5001/api/event/
        [HttpPost]
        public IActionResult Post(Event eventObj)
        {
            _eventRepository.Add(eventObj);
            return CreatedAtAction("Get", new { id = eventObj.Id }, eventObj);
        }

        // http://localhost:5001/api/event/2
        [HttpPut("{id}")]
        public IActionResult Put(int id, Event eventObj)
        {
            if (id != eventObj.Id)
            {
                return BadRequest();
            }

            _eventRepository.Update(eventObj);
            return NoContent();
        }

        // http://localhost:5001/api/event/2
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _eventRepository.Delete(id);
            return NoContent();
        }

        // http://localhost:5001/api/event/MyEvents/2
        // This returns all posts whose userId corresponds to the URL parameter
        [HttpGet("MyEvents/{id}")]
        public IActionResult MyEvents(int id)
        {
            var events = _eventRepository.GetEventsByUserProfileId(id);
            if (events == null)
            {
                return NotFound();
            }
            return Ok(events);
        }

        [HttpGet("EventsByActivity/{id}")]
        public IActionResult EventsByActivity(int id)
        {
            var events = _eventRepository.GetEventsByActivityId(id);
            if (events == null)
            {
                return NotFound();
            }
            return Ok(events);
        }
    }
}
