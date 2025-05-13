using System;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Http;
using WisVestAPI.Models;
using WisVestAPI.Services;
using WisVestAPI.Constants;

namespace WisVestAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;

        public AuthController(UserService userService, IConfiguration configuration, ILogger<AuthController> logger)
        {
            _userService = userService;
            _configuration = configuration;
            _logger = logger;
            _passwordHasher = new PasswordHasher<User>();
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] UserRegisterRequest request)
        {
            try
            {
                if (_userService.UserExists(request.Email))
                {
                    return BadRequest(new { message = ApiMessages.EmailAlreadyExists });
                }

                var user = new User
                {
                    Email = request.Email
                };

                user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);
                _userService.AddUser(user);

                return Ok(new { message = ApiMessages.RegistrationSuccessful });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ApiMessages.RegistrationError);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            try
            {
                var user = _userService.GetUserByEmail(request.Email);
                if (user == null)
                {
                    return Unauthorized(new { message = ApiMessages.InvalidCredentials });
                }

                var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
                if (result == PasswordVerificationResult.Failed)
                {
                    return Unauthorized(new { message = ApiMessages.InvalidCredentials });
                }

                var token = GenerateJwtToken(user);
                if (string.IsNullOrEmpty(token))
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, new { message = ApiMessages.TokenGenerationError });
                }

                return Ok(new { message = ApiMessages.LoginSuccessful, token });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ApiMessages.LoginError);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

        private string GenerateJwtToken(User user)
        {
            try
            {
                var secretKey = _configuration["JwtSettings:SecretKey"];
                var issuer = _configuration["JwtSettings:Issuer"];
                var audience = _configuration["JwtSettings:Audience"];

                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Email)
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
                var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: issuer,
                    audience: audience,
                    claims: claims,
                    expires: DateTime.UtcNow.AddHours(1),
                    signingCredentials: credentials
                );

                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ApiMessages.JwtError);
                return string.Empty;
            }
        }

        // DTOs
        public class LoginRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class UserRegisterRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }
    }
}
