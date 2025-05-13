using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using WisVestAPI.Models;

namespace WisVestAPI.Services
{
 public class UserService
 {
 private readonly string _filePath = "users.json";
 private readonly PasswordHasher<User> _passwordHasher;
 private readonly ILogger<UserService> _logger;
 public UserService(ILogger<UserService> logger)
 {
  _logger = logger;
  _passwordHasher = new PasswordHasher<User>();
 }

 // Load all users from JSON
 public List<User> GetAllUsers()
 {
    try
    {
        _logger.LogInformation("Attempting to load all users from JSON file.");
        
        if (!File.Exists(_filePath))
        {
            _logger.LogWarning("User file not found. Returning an empty list.");
            return new List<User>();
        }

        var json = File.ReadAllText(_filePath);
        _logger.LogInformation("Users loaded successfully from JSON file.");
        return JsonSerializer.Deserialize<List<User>>(json) ?? new List<User>();
    }
    catch (Exception ex)
    {
     _logger.LogError(ex, "Error occurred while loading users.");
    //Console.WriteLine($"Error loading users: {ex.Message}");
    return new List<User>();
    }
 }

 // Save all users to JSON
 public void SaveAllUsers(List<User> users)
 {
  try
  {
  _logger.LogInformation("Attempting to save all users to JSON file.");
  var json = JsonSerializer.Serialize(users, new JsonSerializerOptions { WriteIndented = true });
  File.WriteAllText(_filePath, json);
  _logger.LogInformation("Users saved successfully to JSON file.");
  }
  catch (Exception ex)
  {
  //Console.WriteLine($"Error saving users: {ex.Message}");
  _logger.LogError(ex, "Error occurred while saving users.");
  }
 }

 public bool UserExists(string email)
 {
  _logger.LogInformation("Checking if user with email {Email} exists.", email);
  var users = GetAllUsers();
  return users.Any(u => u.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
 }

 public User? GetUserByEmail(string email)
 {
  _logger.LogInformation("Fetching user with email {Email}.", email);
  var users = GetAllUsers();
  return users.FirstOrDefault(u => u.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
 }

public void AddUser(User user)
{
    try{
     _logger.LogInformation("Attempting to add a new user.");
    var users = GetAllUsers();
    user.Id = users.Count > 0 ? users.Max(u => u.Id) + 1 : 1;
    users.Add(user);
    SaveAllUsers(users);
    _logger.LogInformation("User added successfully with ID {UserId}.", user.Id);
    }catch (Exception ex)
    {
       // Console.WriteLine($"Error adding user: {ex.Message}");
        _logger.LogError(ex, "Error occurred while adding a new user.");
    }
}

 public void UpdateUser(User user)
 {
    try{

        if (user == null || user.Id <= 0)
        {
            _logger.LogWarning("Invalid user data provided for update.");
            return;
        }
        _logger.LogInformation("Attempting to update user with ID {UserId}.", user.Id);
        var users = GetAllUsers();
        var existingUser = users.FirstOrDefault(u => u.Id == user.Id);
        if (existingUser != null)
        {
        existingUser.PasswordHash = user.PasswordHash;
        SaveAllUsers(users);
        //Console.WriteLine("User updated successfully.");
        _logger.LogInformation("User with ID {UserId} updated successfully.", user.Id);
        }
        else
        {
         _logger.LogWarning("User with ID {UserId} not found.", user.Id);
        }
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error occurred while updating user with ID {UserId}.", user.Id);
    }
 }

 public bool ValidateUserLogin(string email, string password)
 {
    try{
            _logger.LogInformation("Validating login for user with email {Email}.", email);
            var user = GetUserByEmail(email);
            if (user != null)
            {
            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
            var isValid = result == PasswordVerificationResult.Success;
            _logger.LogInformation("Login validation for user with email {Email} was {Result}.", email, isValid ? "successful" : "unsuccessful");
            return result == PasswordVerificationResult.Success;
            }
            _logger.LogWarning("User with email {Email} not found.", email);
            return false;
    }
    catch (Exception ex)
    {
        //Console.WriteLine($"Error validating user login: {ex.Message}");
        _logger.LogError(ex, "Error occurred while validating login for user with email {Email}.", email);
        return false;
    }
 }
}
}
