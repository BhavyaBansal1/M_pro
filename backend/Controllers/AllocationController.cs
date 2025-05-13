using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using WisVestAPI.Constants;
using WisVestAPI.Models.DTOs;
using WisVestAPI.Services.Interfaces;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace WisVestAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AllocationController : ControllerBase
    {
        private readonly IAllocationService _allocationService;
        private readonly ILogger<AllocationController> _logger;

        public AllocationController(IAllocationService allocationService, ILogger<AllocationController> logger)
        {
            _allocationService = allocationService;
            _logger = logger;
        }

        /// <summary>
        /// Computes the final allocation based on user input.
        /// </summary>
        [HttpPost("compute")]
        public async Task<ActionResult<AllocationResultDTO>> GetAllocation([FromBody] UserInputDTO input)
        {
            if (input == null)
            {
                return BadRequest(ApiMessages.NullInput);
            }

            try
            {
                var fullAllocationResult = await _allocationService.CalculateFinalAllocation(input);

                if (fullAllocationResult == null || !fullAllocationResult.ContainsKey("assets"))
                {
                    return BadRequest(ApiMessages.AllocationFailed);
                }

                if (fullAllocationResult["assets"] is not Dictionary<string, object> assetsData)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, ApiMessages.DataFormatError);
                }

                var result = new AllocationResultDTO
                {
                    Assets = new Dictionary<string, AssetAllocation>()
                };

                foreach (var assetPair in assetsData)
                {
                    if (assetPair.Value is Dictionary<string, object> assetDetails)
                    {
                        var assetAllocation = ParseAssetDetails(assetDetails);
                        if (assetAllocation != null)
                        {
                            result.Assets[assetPair.Key] = assetAllocation;
                        }
                    }
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception occurred in GetAllocation.");
                return StatusCode(StatusCodes.Status500InternalServerError, ApiMessages.UnexpectedAllocationError);
            }
        }

        /// <summary>
        /// Helper method to parse asset details into AssetAllocation.
        /// </summary>
        private AssetAllocation? ParseAssetDetails(Dictionary<string, object> assetDetails)
        {
            try
            {
                if (assetDetails.TryGetValue("percentage", out var percentageObj) &&
                    assetDetails.TryGetValue("subAssets", out var subAssetsObj) &&
                    percentageObj is double percentage &&
                    subAssetsObj is Dictionary<string, double> subAssets)
                {
                    return new AssetAllocation
                    {
                        Percentage = percentage,
                        SubAssets = subAssets
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, ApiMessages.ParseWarning);
            }

            return null;
        }
    }
}
