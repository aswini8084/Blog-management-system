const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: "aswini8084@gmail.com",
        pass: "xicd onsq azpb ciav",
    },
});

module.exports=transporter;