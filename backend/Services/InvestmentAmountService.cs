using System;

namespace WisVestAPI.Services
{
    public class InvestmentAmountService
    {
        private readonly ILogger<InvestmentAmountService> _logger;
        public InvestmentAmountService(ILogger<InvestmentAmountService> logger)
        {
            _logger = logger;
            
        }
        public double CalculateInvestmentAmount(double percentageSplit, double targetAmount, double annualReturn, string investmentHorizon)
        {
            try{
            // Parse the investment horizon (e.g., "5 years" -> 5)
            _logger.LogInformation("Calculating investment amount with PercentageSplit: {PercentageSplit}, TargetAmount: {TargetAmount}, AnnualReturn: {AnnualReturn}, InvestmentHorizon: {InvestmentHorizon}.",
                    percentageSplit, targetAmount, annualReturn, investmentHorizon);
            int years = investmentHorizon switch
            {
                "Short" => 2,
                "Moderate" => 5,
                "Long" => 8,
                _ => throw new ArgumentException("Invalid investment horizon value") // Handle invalid input
            };

            _logger.LogInformation("Parsed investment horizon: {Years} years.", years);

            // Formula: Investment = (PercentageSplit * TargetAmount) / (1 + AnnualReturn/100)^Years
            double denominator = Math.Pow(1 + (annualReturn / 100), years);
            double investmentAmount = (percentageSplit/100) * targetAmount / denominator;
             _logger.LogInformation("Calculated investment amount: {InvestmentAmount}.", Math.Round(investmentAmount, 2));
            return Math.Round(investmentAmount, 2); // Round to 2 decimal places
            }
                catch (ArgumentException ex)
            {
                _logger.LogError(ex, "Invalid input: {Message}", ex.Message);
                throw; // Re-throw the exception to propagate it to the caller
            }
            catch (DivideByZeroException ex)
            {
                _logger.LogError(ex, "Math error: {Message}", ex.Message);
                throw; // Re-throw the exception to propagate it to the caller
            }
            catch (OverflowException ex)
            {
                _logger.LogError(ex, "Overflow error: {Message}", ex.Message);
                throw; // Re-throw the exception to propagate it to the caller
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error: {Message}", ex.Message);
                throw; // Re-throw the exception to propagate it to the caller
            }
        }
    }
}


