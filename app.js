const express = require('express');
const bodyParser = require('body-parser');

const MAILCHIMP_API_KEY = env.API_KEY;

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

const port = process.env.PORT || 3000;

// since we are using our local folders such as css and images

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html"); 
})

app.post("/", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const https = require('node:https');

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = 'https://us22.api.mailchimp.com/3.0/lists/f1032ce2ee';

    const options = {
        method: "POST",
        auth: `dul1:${MAILCHIMP_API_KEY}`,
    }

    const request = https.request(url, options, (response) => {
        response.on("data", (data) => {
            var responseData = JSON.parse(data);

            // if(response.statusCode === 200) {
            if(responseData.errors.length === 0) {
                res.sendFile(__dirname + "/success.html");
            }else {
                res.sendFile(__dirname + "/faliure.html");
            }
        
        });
    });

    request.write(jsonData);
    request.end();

})

app.post("/faliure", (req, res) => {
    res.redirect("/");
})

app.listen(port, (req, res) => {
    console.log(`Server running on ${port}.`);
})


// MAILCHIMP_API_KEY = 9b63504198dbc666ceaf8c8e6978e897-us22

// audianceID = f1032ce2ee
