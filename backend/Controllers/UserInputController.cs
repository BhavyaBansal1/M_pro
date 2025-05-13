using Microsoft.AspNetCore.Mvc;
using WisVestAPI.Models.DTOs;
using WisVestAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using WisVestAPI.Constants;

namespace WisVestAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserInputController : ControllerBase
    {
        private readonly IUserInputService _userInputService;

        public UserInputController(IUserInputService userInputService)
        {
            _userInputService = userInputService;
        }

        [HttpPost("submit-input")]
        public async Task<IActionResult> SubmitInput([FromBody] UserInputDTO input)
        {
            if (input == null) 
                return BadRequest(string.Format(ApiMessages.InputIsNull));

            try
            {
                var result = await _userInputService.HandleUserInput(input);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(string.Format(ApiMessages.ArgumentError, ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, string.Format(ApiMessages.InternalServerError, ex.Message));
            }
        }
    }
}
