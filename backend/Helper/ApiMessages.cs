namespace WisVestAPI.Constants
{
    public static class ApiMessages
    { 
        //product allocation
        public const string NullAllocation = "Allocation result cannot be null.";
        public const string InvalidAmount = "Target amount must be greater than zero.";
        public const string MissingHorizon = "Investment horizon is required.";
        public const string NoAllocationsFound = "No product allocations found.";
        public const string InternalServerError = "Internal server error: ";

        //auth  
        public const string EmailAlreadyExists = "Email already exists.";
        public const string RegistrationSuccessful = "Registration successful.";
        public const string LoginSuccessful = "Login successful.";
        public const string InvalidCredentials = "Invalid credentials.";
        public const string TokenGenerationError = "An error occurred while generating the token.";
        public const string RegistrationError = "An error occurred during user registration.";
        public const string LoginError = "An error occurred during login.";
        public const string JwtError = "Error generating JWT token.";    

        //Allocation error

        // Allocation-specific
        public const string NullInput = "User input cannot be null.";
        public const string AllocationFailed = "Allocation could not be computed or formatted correctly.";
        public const string DataFormatError = "Error: Final allocation data format is incorrect.";
        public const string UnexpectedAllocationError = "An unexpected error occurred while computing the allocation.";
        public const string ParseWarning = "Failed to parse asset details.";

        // Product
         public const string JsonFileNotFound = "The JSON file {0} was not found.";
    public const string JsonDeserializationError = "Error occurred while deserializing the JSON data.";
    public const string JsonReadingError = "An error occurred while reading the JSON file: {0}";
    public const string UnexpectedError = "An unexpected error occurred: {0}";
        public const string ProductLoadSuccess = "Products loaded successfully.";
        public const string AllocationSuccess = "Allocation computed successfully.";
        public const string RegistrationSuccess = "Registration successful.";
        public const string LoginSuccess = "Login successful.";

        public const string AllocationFailure = "Allocation could not be computed or formatted correctly.";
        public const string EmailExists = "Email already exists.";

        public const string InvalidEmailFormat = "The email format is invalid.";
        public const string PasswordTooWeak = "Password is too weak. Ensure it meets the security requirements.";

        //user input
          public const string InputIsNull = "The user input is null.";
    public const string ArgumentError = "Invalid input: {0}";


    }
}
