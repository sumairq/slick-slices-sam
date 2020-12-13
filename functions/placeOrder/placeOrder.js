const nodemailer = require('nodemailer');


function generateOrderEmail({order, total}){
    return `<div>
    <h2>Your Recent Order for ${total}</h2>
    <p>Please start walking over, we will have your order ready in the next 20 mins. </p>
    <ul>
    ${order.map(item => `<li>
    <img src="${item.thumbnail}" alt="${item.name}"/>
    ${item.size} ${item.name} - ${item.price}
    </li>`).join('')}
    </ul>
    <p>Your total is $${total} due at pickup</p>
    <style>
     ul {
         list-style: none;
     }
    </style>
    </div>`
}

// create a transport for nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, 
    }
});

function wait(ms = 0) {
    return new Promise((resolve, reject)=> {
        setTimeout(resolve, ms);
    });
}


exports.handler = async (event, context)=>{
    await wait(5000);
const body = JSON.parse(event.body);

//check if they have filled out the honeypot 

if(body.mapleSyrup){
    return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Beep Boop Bop zzZZt  Goodbye! ERR'})
    }
}
console.log(body);
//validate the data comming in is correct.
const requiredFields = ['email','name','order'];
if(!body.order.length){
    return{
        statusCode: 400,
        body: JSON.stringify({
            message: "You have not ordered anything",
        })
    };
}
for(const field of requiredFields){
    console.log(`Checking that ${field} is good`);
    if(!body[field]){
        return{
            statusCode: 400,
            body: JSON.stringify({
                message: `Oops! You are missing the ${field} field`,
            }),
        };
    }
}




    // Test send an email
const info = await transporter.sendMail({
    from: "Slicks Slices <slicks@example.com>",
    to: `${body.name} <${body.email}>, orders@example.com`,
    subject: "New Order!",
    html: generateOrderEmail({order: body.order, total: body.total}),
 })
 console.log(info); 
 return {
     statusCode: 200,
     body: JSON.stringify({message: 'Success'}),
 }
}