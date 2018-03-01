const nodemailer = require('nodemailer');
const mailTransport = nodemailer.createTransport({
    host:'smtp.ethereal.email',
    secure:false,
    port:587,
    //service:'Gmail',
    auth:{
        name:'user@gmail.com',
        password:'qwertyu'
    }
});

function sendMailOne(email,subject,message){
    mailTransport.sendMail({
        from:'Testing send"<info@mysite.com>"',
        to:email,
        subject:subject,
        text:message
    },(error,info)=>{
        if(error) console.log(error);
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
}
function sendMailMany(email,subject,message){
    mailTransport.sendmail({
        from:'Testing send"<info@mysite.com>"',
        to:email.join(),
        subject:subject,
        text:message
    },(error,info)=>{
        if(error) console.log(error);
        console.log('Message sent: %s', info);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
}
module.exports = {
    sendMailOne,
    sendMailMany
};