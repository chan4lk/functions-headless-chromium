const puppeteer = require("puppeteer");
const fs = require('fs');
const nodemailer = require('nodemailer');

const file1 = 'Transmission venues of concern.csv';
const file2 = 'NSW COVID-19 case locations.csv';
const file3 = 'Public transport routes.csv';

const content = `
Please be cautious
This email was sent from outside of Civic Disability Services
________________________________

Latest COVID-19 case locations and alerts in NSW
`;

class Email {
    static sendEmail(to, subject, text, files) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secureConnection: true, // Used for Office 365
            tls: { ciphers: 'SSLv3' }, // Used for Office 365
            auth: {
                user: 'cranaweera@outlook.com', // Update username
                pass: 'Ih@tethi5' // Update password
            }
        });

        const mailOptions = {
            from: 'cranaweera@outlook.com', // Update from email
            to: to,
            subject: subject,
            text: text,
            attachments: files
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }

            console.log('Message sent: %s', info.messageId);
        });
    }
}

module.exports = async function (context, req) {
    const url = "https://www.health.nsw.gov.au/Infectious/covid-19/Pages/case-locations-and-alerts.aspx";

    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle0',timeout: 0 });

   
    //await page.screenshot({ path: 'screen.jpg', fullPage: true });

    await page._client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: './folder/'
    });

    const files = [];

    const button = await page.$("#tbl-transmission_wrapper > div.dt-buttons > button.dt-button.buttons-csv.buttons-html5");
    if (button) {
        console.log("Found button");
        await button.click();
        await page.waitForTimeout(5000);
        const file = fs.readFileSync('./folder/Latest COVID-19 case locations and alerts in NSW - COVID-19 (Coronavirus).csv');
        files.push({filename: file1, content: file});
    }

    const button2 = await page.$("#tbl-case-locations_wrapper > div.dt-buttons > button.dt-button.buttons-csv.buttons-html5");
    if (button2) {
        console.log("Found button");
        await button2.click();
        await page.waitForTimeout(5000);
        const file = fs.readFileSync('./folder/Latest COVID-19 case locations and alerts in NSW - COVID-19 (Coronavirus).csv');
        files.push({filename: file2, content: file});
    }

    const button3 = await page.$("#tbl-casual-contacts-transport_wrapper > div.dt-buttons > button.dt-button.buttons-csv.buttons-html5");
    if (button3) {
        console.log("Found button");
        await button3.click();
        await page.waitForTimeout(5000);
        const file = fs.readFileSync('./folder/Latest COVID-19 case locations and alerts in NSW - COVID-19 (Coronavirus).csv');
        files.push({filename: file3, content: file});
    }


    Email.sendEmail('chan4lk@gmail.com', 'CIVIC_Hotspots', content, files);

    await browser.close();

    
    var message = {
        "personalizations": [ { "to": [ { "email": "chan4lk@gmail.com" } ] } ],
       from: { email: "chan4lk@gmail.com" },        
       subject: "Azure news",
       content: [{
           type: 'text/plain',
           value: "abcd"
       }]
   };

   context.done(null, {message});
};