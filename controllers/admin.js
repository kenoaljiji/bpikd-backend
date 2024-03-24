import { generateToken } from '../utils/generateToken.js';
import model from '../models/admin.js';
import * as validator from '../validator/admin.js';
import {
  errorHandler,
  responseHandler,
} from '../middleware/response-handler.js';
import {
  findOne,
  create,
  findOneAndUpdate,
  findOneAndDelete,
  deleteMany,
} from '../dal/dal.js';
import bcrypt from 'bcryptjs';

/* export async function register(req, res) {
  console.log(req, res);
  try {
    const { error, value } = validator.signUpSchema.validate(
      req.body,
      validator.defaults
    );
    if (error) {
      return errorHandler(403, res, error.message);
    }

    const passwordHash = await bcrypt.hash(value.password, 10);

    const body = {
      ...value,
      password: passwordHash,
    };

    const user = await create(model, body);
    const accessToken = await generateToken(user);
    const data = {
      user: user,
      token: accessToken,
    };

    responseHandler(data, res, 'Admin Registered Successfully!', 201);
  } catch (err) {
    console.log(err);
    errorHandler(500, res, err.message);
  }
} */

export async function register(req, res) {
  try {
    const { error, value } = validator.signUpSchema.validate(
      req.body,
      validator.defaults
    );
    if (error) {
      return errorHandler(403, res, error.message);
    }

    const passwordHash = await bcrypt.hash(value.password, 10);
    const body = {
      ...value,
      password: passwordHash,
    };

    const user = await create(model, body);
    const accessToken = await generateToken(user);

    // Constructing the success message based on user's role
    let successMessage = `${
      user.role.charAt(0).toUpperCase() + user.role.slice(1)
    } Registered Successfully!`;

    responseHandler({ user, token: accessToken }, res, successMessage, 201);
  } catch (err) {
    console.log(err);
    errorHandler(500, res, err.message);
  }
}

export async function login(req, res) {
  try {
    const { error, value } = validator.logInSchema.validate(
      req.body,
      validator.defaults
    );
    if (error) {
      return errorHandler(403, res, error.message);
    }

    // Include 'role' in the selected fields
    const user = await findOne(
      model,
      { username: value.username },
      { password: 1, username: 1, email: 1, role: 1 } // Include role here
    );

    if (!user) {
      return errorHandler(404, res, 'User Not Found!');
    }

    const allGood = await bcrypt.compare(value.password, user.password);

    if (user && allGood) {
      // Ensure the user object passed to generateToken includes the role
      const accessToken = await generateToken({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role, // Pass role to generateToken
      });

      // Adjust the response to include the user's role if needed
      responseHandler(
        {
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role, // Include role in the response
          },
          token: accessToken,
        },
        res
      );
    } else {
      errorHandler(401, res, 'Alert! Wrong Credentials.');
    }
  } catch (err) {
    console.log(err);
    errorHandler(500, res, err.message);
  }
}

/* export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await model.findOne({ email });

    if (user && bcrypt.compareSync(password, user.password)) {
      // Here, ensure that 'user' includes the 'role' property
      const token = generateToken(user);
      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token: token, // Send the token back to the client
      });
    } else {
      res.status(401).send({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error logging in user' });
  }
} */

export async function getUser(req, res) {
  try {
    const user = await findOne(model, { _id: req.user._id });
    user ? responseHandler(user, res) : errorHandler(404, res, 'No user!');
  } catch (err) {
    console.log(err);
    errorHandler(500, res, err.message);
  }
}

export const getUserById = async (req, res) => {
  try {
    // Extract the userId from route parameters
    const { userId } = req.params;

    // Fetch the user from the database
    const user = await model.findById(userId).select('-password'); // Excluding password from the result

    if (!user) {
      // If no user is found with the given ID, return a 404 error
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user data if found
    res.json(user);
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    // Handle potential errors, such as database errors
    res.status(500).json({ message: 'Error fetching user details' });
  }
};

export async function updateUser(req, res) {
  try {
    const { error, value } = validator.updateSchema.validate(
      req.body,
      validator.defaults
    );
    if (error) {
      return errorHandler(403, res, error.message);
    }

    // Determine the target user ID based on the role or if a specific userID is provided
    const isAdmin = req.user.role === 'admin';
    const targetUserId =
      isAdmin && req.params.userId ? req.params.userId : req.user._id;

    // Prepare update object
    let updateObject = value;

    // If a new password is provided, hash it before updating
    if (value.password) {
      const passwordHash = await bcrypt.hash(value.password, 10);
      updateObject = { ...value, password: passwordHash };
    } else {
      // Ensure password isn't unintentionally removed if not provided
      delete updateObject.password;
    }

    const user = await findOneAndUpdate(
      model,
      { _id: targetUserId },
      updateObject,
      { new: true, runValidators: true } // Enable validators
    );

    if (!user) {
      return errorHandler(404, res, 'No user found!');
    }

    // Optionally exclude sensitive fields from the response
    const responseUserData = { ...user._doc };
    delete responseUserData.password;

    responseHandler(responseUserData, res, 'User updated successfully');
  } catch (err) {
    console.log(err);
    errorHandler(500, res, err.message);
  }
}

// Assuming you have a function in your DAL or you can directly use the model
// For example, let's say you have this in your dal.js
// export async function findAll(model) {
//   return await model.find({});
// }

// Import findAll if you're using a separate DAL function
// If not, you'll use the model directly

/* export async function getAllUsers(req, res) {
  try {
    // Directly using model.find() if not using a separate DAL function
    const users = await model.find({}).select("-password"); // Exclude passwords from the response
    if (users) {
      responseHandler(users, res, "Users fetched successfully", 200);
    } else {
      errorHandler(404, res, "No users found");
    }
  } catch (err) {
    console.log(err);
    errorHandler(500, res, "An error occurred while fetching users");
  }
} */

export async function getAllUsers(req, res) {
  try {
    // Query to fetch users with "user" or "editor" roles
    const users = await model
      .find({
        role: { $in: ['user', 'editor', 'admin'] },
      })
      .select('-password'); // Exclude passwords from the response for security

    if (users && users.length > 0) {
      responseHandler(users, res, 'Users fetched successfully', 200);
    } else {
      errorHandler(404, res, 'No users found');
    }
  } catch (err) {
    console.log(err);
    errorHandler(500, res, 'An error occurred while fetching users');
  }
}

/* export async function deleteUser(req, res) {
  try {
    const user = await findOneAndDelete(model, { _id: req.user._id });
    user ? responseHandler(user, res) : errorHandler(404, res, 'No user!');
  } catch (err) {
    console.log(err);
    errorHandler(500, res, err.message);
  }
}
 */

export async function deleteUser(req, res) {
  try {
    // Assuming the user ID to delete is passed as a URL parameter (e.g., /users/:id)
    const { userId } = req.params; // Make sure to extract the correct parameter name as defined in your route

    const user = await findOneAndDelete(model, { _id: userId });
    if (user) {
      responseHandler(user, res, 'User deleted successfully.');
    } else {
      errorHandler(404, res, 'User not found.');
    }
  } catch (err) {
    console.log(err);
    errorHandler(500, res, err.message);
  }
}

export async function deleteMultipleUsers(req, res) {
  try {
    // The request should contain an array of user IDs to be deleted
    const { userIds } = req.body;

    // Perform the delete operation
    const result = await deleteMany(model, {
      _id: { $in: userIds },
    });

    console.log(result);
    // Respond with success message
    // result.deletedCount tells you how many documents were deleted
    res.status(200).json({
      message: `${result.deletedCount} users have been successfully deleted.`,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'An error occurred while deleting users.' });
  }
}
