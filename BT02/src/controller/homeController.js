import db from '../models/index'; // import database
const CRUDService = require('../services'); // import service

// Hàm getHomePage
let getHomePage = async (req, res) => {
    return res.redirect('/get-crud');
};

// Hàm getAbout
let getAboutPage = (req, res) => {
    return res.render('test/about.ejs');
};

// Hàm CRUD - Hiển thị trang CRUD
let getCRUD = (req, res) => {
    return res.render('crud.ejs');
};

// Hàm findAll CRUD - Lấy tất cả user
let getFindAllCrud = async (req, res) => {
    let data = await CRUDService.getAllUser();
    // console.log('---------------------------');
    // console.log(data);
    // console.log('---------------------------');
    // return res.send('FindAll crud to server');
    return res.render('users/findAllUser.ejs', {
        datalist: data
    }); // gọi view và truyền dữ liệu ra view
};

// Hàm post CRUD - Tạo user mới
let postCRUD = async (req, res) => { // dùng async để xử lý bất đồng bộ
    let message = await CRUDService.createNewUser(req.body); // gọi service
    // console.log(req.body); // lấy thông tin body của http request
    console.log(message);
    return res.redirect('/get-crud');
};

// Hàm lấy dữ liệu để edit
let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) { // check Id
        let userData = await CRUDService.getUserInfoById(userId);
        
        // console.log('------------------');
        // console.log(userData);
        // console.log('------------------');
        return res.render('users/updateUser.ejs', {
            data: userData
        });
    } else {
        return res.send('không lấy được id');
    }
    
    // console.log(req.query.id);
};

// Hàm put CRUD - Cập nhật user
let putCRUD = async (req, res) => {
    let data = req.body;
    let data1 = await CRUDService.updateUser(data); // update rồi hiển thị lại danh sách user
    // let data1 = await CRUDService.getAllUser(); // hiển thị danh sách user
    return res.render('users/findAllUser.ejs', {
        datalist: data1
    });
    // return res.send('update thành công');
};

// Hàm xóa user
let deleteCRUD = async (req, res) => {
    let id = req.query.id; // vì trên view ?id=1
    if (id) {
        await CRUDService.deleteUserById(id);
        return res.redirect('/get-crud');
    } else {
        return res.send('Not find user');
    }
};

// Export ra object
module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    getFindAllCrud: getFindAllCrud,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD
};