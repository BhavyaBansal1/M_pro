using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using WisVestAPI.Constants;
using WisVestAPI.Models.DTOs;
using WisVestAPI.Services;

namespace WisVestAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProductAllocationController : ControllerBase
    {
        private readonly ProductAllocationService _productAllocationService;
        private readonly ILogger<ProductAllocationController> _logger;

        public ProductAllocationController(
            ProductAllocationService productAllocationService,
            ILogger<ProductAllocationController> logger)
        {
            _productAllocationService = productAllocationService;
            _logger = logger;
        }

        [HttpPost("calculate-product-allocations")]
        public async Task<IActionResult> CalculateProductAllocations(
            [FromBody] AllocationResultDTO allocationResult,
            [FromQuery] double targetAmount,
            [FromQuery] string investmentHorizon)
        {
            try
            {
                _logger.LogInformation("Sub-allocation data received: {Data}", JsonSerializer.Serialize(allocationResult));
                _logger.LogInformation("Target amount: {Amount}", targetAmount);
                _logger.LogInformation("Investment horizon: {Horizon}", investmentHorizon);

                if (allocationResult == null || allocationResult.Assets == null)
                {
                    return BadRequest(ApiMessages.NullAllocation);
                }

                if (targetAmount <= 0)
                {
                    return BadRequest(ApiMessages.InvalidAmount);
                }

                if (string.IsNullOrWhiteSpace(investmentHorizon))
                {
                    return BadRequest(ApiMessages.MissingHorizon);
                }

                var subAllocationResult = allocationResult.Assets.ToDictionary(
                    asset => asset.Key,
                    asset => asset.Value.SubAssets
                );

                var result = await _productAllocationService.CalculateProductAllocations(
                    subAllocationResult,
                    targetAmount,
                    investmentHorizon
                );

                if (result == null || result.Count == 0)
                {
                    return NotFound(ApiMessages.NoAllocationsFound);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while calculating product allocations.");
                return StatusCode(500, new { message = ApiMessages.InternalServerError + ex.Message });
            }
        }
    }
}
