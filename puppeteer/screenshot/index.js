const puppeteer = require("puppeteer");
const fs = require('fs');
const nodemailer = require('nodemailer');
class Email {
    static sendEmail(to, subject, text, filename, fileContent) {
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
            attachments: [{
                filename: filename,
                content: fileContent
            }]
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

    page.on('response', async (response) => {
        if (response.url()) {
            console.info(JSON.stringify(response));
            const buffer = await response.buffer();
            // handle buffer
        }
    });

    const [button] = await page.$x("//button[contains(., 'CSV')]");
    if (button) {
        console.log("Found button");
        await button.click();
        await page.waitForTimeout(5000);
        const file = fs.readFileSync('./folder/Latest COVID-19 case locations and alerts in NSW - COVID-19 (Coronavirus).csv');
        Email.sendEmail('chan4lk@gmail.com', 'HOT_SPOTS', 'HOT_SPOTS', 'Latest COVID-19 case locations and alerts in NSW - COVID-19 (Coronavirus).csv', file);
    }
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