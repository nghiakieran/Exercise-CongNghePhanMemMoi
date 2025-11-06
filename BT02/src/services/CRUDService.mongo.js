const bcrypt = require('bcryptjs');
const User = require('../mongo/User');

const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
  const password = bcrypt.hashSync(data.password, salt);
  await User.create({
    email: data.email,
    password,
    firstName: data.firstName,
    lastName: data.lastName,
    address: data.address,
    phoneNumber: data.phoneNumber,
    gender: data.gender === '1' ? true : false,
    roleId: data.roleId,
  });
  return 'Tạo user thành công';
};

let getAllUser = async () => {
  const users = await User.find({}).lean();
  return users;
};

let getUserInfoById = async (userId) => {
  const user = await User.findById(userId).lean();
  return user || [];
};

let updateUser = async (data) => {
  await User.findByIdAndUpdate(
    data.id,
    { firstName: data.firstName, lastName: data.lastName, address: data.address },
    { new: true }
  );
  return await User.find({}).lean();
};

let deleteUserById = async (userId) => {
  await User.findByIdAndDelete(userId);
};

module.exports = {
  createNewUser,
  getAllUser,
  getUserInfoById,
  updateUser,
  deleteUserById,
};
