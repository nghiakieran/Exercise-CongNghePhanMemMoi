import bcryptjs from "bcryptjs";
import { User } from "../models";

interface UserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address?: string;
  phoneNumber?: string;
  gender?: string;
  roleId?: string;
}

const salt = bcryptjs.genSaltSync(10);

// Hash password
const hashUserPassword = async (password: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashPassword = await bcryptjs.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

// Create new user
const createNewUser = async (data: UserData): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashPasswordFromBcrypt = await hashUserPassword(data.password);
      await User.create({
        email: data.email,
        password: hashPasswordFromBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address || "",
        phoneNumber: data.phoneNumber || "",
        gender: data.gender === "1" ? true : false,
        roleId: data.roleId || "user",
      });
      resolve("OK create a new user successful");
    } catch (e) {
      reject(e);
    }
  });
};

// Get all users
const getAllUser = (): Promise<any[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await User.find({}).lean();
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

// Get user by ID
const getUserInfoById = (userId: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId).lean();
      if (user) {
        resolve(user);
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  });
};

// Update user
const updateUser = (data: UserData & { id: string }): Promise<any[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.findByIdAndUpdate(data.id, {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address || "",
        phoneNumber: data.phoneNumber || "",
        gender: data.gender === "1" ? true : false,
        roleId: data.roleId || "user",
      });
      const users = await User.find({}).lean();
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

// Delete user by ID
const deleteUserById = (userId: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.findByIdAndDelete(userId);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  createNewUser,
  getAllUser,
  getUserInfoById,
  updateUser,
  deleteUserById,
  hashUserPassword,
};
