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
    public class ActivityController : ControllerBase
    {
        private readonly IActivityRepository _activityRepository;

        public ActivityController(IActivityRepository activityRepository)
        {
            _activityRepository = activityRepository;
        }

        // http://localhost:5001/api/activity/
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_activityRepository.GetAllActivities());
        }

    }
}
