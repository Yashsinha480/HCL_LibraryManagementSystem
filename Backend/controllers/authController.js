import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";
import { apiResponse } from "../utils/apiResponse.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = "student" } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    status: "pending"
  });

  return apiResponse(res, 201, `${role === "admin" ? "Administrator" : "Student"} registration submitted for approval.`, {
    id: user._id,
    email: user.email,
    role: user.role,
    status: user.status
  });
});

const buildLoginHandler = (role) =>
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role });

    if (!user) {
      throw new ApiError(401, "Invalid email or password.");
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new ApiError(401, "Invalid email or password.");
    }

    if (user.status !== "approved") {
      throw new ApiError(403, `${user.role === "admin" ? "Administrator" : "Student"} account is ${user.status}.`);
    }

    const token = generateToken({
      id: user._id,
      role: user.role
    });

    return apiResponse(res, 200, "Login successful.", {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  });

export const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!role || !["student", "admin"].includes(role)) {
    throw new ApiError(401, "Invalid email or password.");
  }

  req.body = { email, password };
  return buildLoginHandler(role)(req, res);
});

export const loginStudent = buildLoginHandler("student");
export const loginAdmin = buildLoginHandler("admin");
