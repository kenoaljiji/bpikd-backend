// Import jwt using ES6 module syntax
import jwt from "jsonwebtoken";

export const generateToken = async (user) => {
  try {
    let token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "90d",
    });
    return token;
  } catch (err) {
    console.log(err);
  }
};
