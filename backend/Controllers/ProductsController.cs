using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using WisVestAPI.Models;
using WisVestAPI.Models.DTOs;
using WisVestAPI.Models.Matrix;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using WisVestAPI.Constants;

namespace WisVestAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ILogger<ProductsController> _logger;
        private readonly string _jsonFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Repositories", "Matrix", "product_json.json");

        public ProductsController(ILogger<ProductsController> logger)
        {
            _logger = logger;
        }

        [HttpGet("products")]
        public async Task<IActionResult> LoadProducts()
        {
            try
            {
                var productJsonFilePath = "Repositories/Matrix/product_json.json";

                if (!System.IO.File.Exists(productJsonFilePath))
                {
                    _logger.LogWarning(ApiMessages.JsonFileNotFound, productJsonFilePath);
                    return NotFound(string.Format(ApiMessages.JsonFileNotFound, productJsonFilePath));
                }

                var json = await System.IO.File.ReadAllTextAsync(productJsonFilePath);

                // Deserialize into a nested dictionary structure
                var productData = JsonSerializer.Deserialize<Dictionary<string, Dictionary<string, List<Product>>>>(json);

                if (productData == null)
                {
                    _logger.LogError(ApiMessages.JsonDeserializationError);
                    return BadRequest(ApiMessages.JsonDeserializationError);
                }

                // Flatten the nested structure into a single list of products
                var products = new List<Product>();
                foreach (var assetClass in productData.Values)
                {
                    foreach (var subAssetClass in assetClass.Values)
                    {
                        products.AddRange(subAssetClass);
                    }
                }

                var productDTOs = products.Select(p => new ProductDTO
                {
                    ProductName = p.ProductName,
                    AnnualReturn = p.AnnualReturn,
                    AssetClass = p.AssetClass,
                    SubAssetClass = p.SubAssetClass,
                    Liquidity = p.Liquidity,
                    Pros = p.Pros,
                    Cons = p.Cons,
                    RiskLevel = p.RiskLevel,
                    description = p.description
                }).ToList();

                return Ok(productDTOs);
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, ApiMessages.JsonReadingError, ex.Message);
                return StatusCode(500, string.Format(ApiMessages.JsonReadingError, ex.Message));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ApiMessages.UnexpectedError, ex.Message);
                return StatusCode(500, string.Format(ApiMessages.UnexpectedError, ex.Message));
            }
        }
    }
}
