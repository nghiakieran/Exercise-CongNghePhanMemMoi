import { Request, Response } from "express";
import CRUDService from "../services/CRUDService";

// Get home page - redirect to get-crud
const getHomePage = async (req: Request, res: Response): Promise<void> => {
  res.redirect("/get-crud");
};

// Get about page
const getAboutPage = (req: Request, res: Response): void => {
  res.render("test/about.ejs");
};

// Get CRUD - Display CRUD page
const getCRUD = (req: Request, res: Response): void => {
  res.render("crud.ejs");
};

// Get all users - Find all CRUD
const getFindAllCrud = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await CRUDService.getAllUser();
    res.render("users/findAllUser.ejs", {
      datalist: data,
    });
  } catch (error) {
    res.send("Error fetching users");
  }
};

// Post CRUD - Create new user
const postCRUD = async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await CRUDService.createNewUser(req.body);
    console.log(message);
    res.redirect("/get-crud");
  } catch (error) {
    console.error(error);
    res.send("Error creating user");
  }
};

// Get edit CRUD - Get user info for editing
const getEditCRUD = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.query.id as string;
    if (userId) {
      const userData = await CRUDService.getUserInfoById(userId);
      res.render("users/updateUser.ejs", {
        data: userData,
      });
    } else {
      res.send("Cannot get user id");
    }
  } catch (error) {
    res.send("Error getting user info");
  }
};

// Put CRUD - Update user
const putCRUD = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;
    const data1 = await CRUDService.updateUser(data);
    res.render("users/findAllUser.ejs", {
      datalist: data1,
    });
  } catch (error) {
    res.send("Error updating user");
  }
};

// Delete CRUD - Delete user
const deleteCRUD = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.query.id as string;
    if (id) {
      await CRUDService.deleteUserById(id);
      res.redirect("/get-crud");
    } else {
      res.send("Not find user");
    }
  } catch (error) {
    res.send("Error deleting user");
  }
};

export default {
  getHomePage,
  getAboutPage,
  getCRUD,
  postCRUD,
  getFindAllCrud,
  getEditCRUD,
  putCRUD,
  deleteCRUD,
};
