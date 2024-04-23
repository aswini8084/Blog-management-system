const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
const blogModel = require('../models/blog.model');
const randomstring = require('randomstring');
const transporter = require('../mail/transporter');



const index = async (req, res) => {
    let blogs = await blogModel.find({ status: 1 });
    let isUserAuthenticated = req.session.user ? true : false;
    res.render('front/index', { blogs, isUserAuthenticated })


}

const detail = async (req, res) => {
    let isUserAuthenticated = req.session.user ? true : false;
    try {
        let blog = await blogModel.findOne({ _id: req.params.id });
        res.render('front/detail', { isUserAuthenticated, blog })
    } catch (error) {
        res.redirect('/')
    }

}

const login = (req, res) => {
    let isUserAuthenticated = req.session.user ? true : false;

    res.render('front/login', { isUserAuthenticated })
}

const loginUser = async (req, res) => {
    let user = await userModel.findOne({ email: req.body.email });
    if (user) {
        let authenticated = await bcrypt.compare(req.body.password, user.password);

        if (authenticated) {
            req.session.user = user
            res.redirect('/admin')
        } else {
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
}

const register = (req, res) => {
    let isUserAuthenticated = req.session.user ? true : false;

    res.render('front/register', { isUserAuthenticated })
}

const addUser = async (req, res) => {
    let hashPassword = await bcrypt.hash(req.body.password, 10);
    try {
        await userModel.create({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword,
            status: true
        })
        res.redirect('/login')
    } catch (err) {

    }

}

const forgetPassword = async (req, res) => {
    let isUserAuthenticated = req.session.user ? true : false;

    let error = req.session.error;
    let success = req.session.success;
    let message = req.session.message

    delete req.session.error;
    delete req.session.success;
    delete req.session.message;

    res.render('front/forgetPassword', { isUserAuthenticated, error, success, message })


}

const forgetPasswordPost = async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.body.email })

        if (user) {
            let token = randomstring.generate();
            await userModel.updateOne({ _id: user._id }, {
                token: token
            })

            let url = 'https://localhost:3000/create-new-password/'+ token;

            const info = await transporter.sendMail({
                from: '"Ashwini kumar 👻" <aswini8084@gmail.com>', // sender address
                to: "aswini8084@gmail.com,  ", // list of receivers
                subject: "Create Password", // Subject line
                // text: "Hello world?", // plain text body
                html: `<a href="${url}">Create Password</a>`,  //html body

            });
            req.session.error = false;
            req.session.success = true;
            req.session.message = 'forget password link has been sent to your mail'
            res.redirect('/forget-password')

        } else {
            req.session.error = true;
            req.session.success = false;
            req.session.message = 'something went wrong'
            res.redirect('/forget-password');
        }
    } catch (error) {

    }

}

const createNewPassword = async (req, res) => {
    let isUserAuthenticated = req.session.user ? true : false;
    let token = req.params.token;

    let error = req.session.error;
    let success = req.session.success;
    let message = req.session.message;

    delete req.session.error;
    delete req.session.success;
    delete req.session.message;
    res.render('front/createNewPassword', { isUserAuthenticated, token, error, message, success })


}

const createNewPasswordPost = async (req, res) => {


}

module.exports = {
    index,
    detail,
    login,
    register,
    loginUser,
    addUser,
    forgetPassword,
    forgetPasswordPost,
    createNewPassword,
    createNewPasswordPost
}