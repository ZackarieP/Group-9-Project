// Layer 1
const express = require("express");
const fileUpload = require('express-fileupload');
const app = express();
app.use(express.json({limit: '5mb'}));
const port = 8080;
const http = require('http');
const fs = require('fs');

// default options
app.use(fileUpload());

// Layer 1 display form and image links
app.get('/', (req, res) => {
    http.get('http://10.142.0.3:8080/images', (response) => {
        const {statusCode} = response;
        const contentType = response.headers['content-type'];

        let error;
        // Any 2xx status code signals a successful response but
        // here we're only checking for 200.
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
        }

        if (error) {
            console.error(error.message);
            // Consume response data to free up memory
            response.resume();
            return;
        }

        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', (chunk) => {
            rawData += chunk;
        });
        response.on('end', () => {
            try {
                // console.log(rawData);
                let formHTML = `
<form action="/upload" method="POST" enctype="multipart/form-data">
    <input type="file" name="image">
    <button type="submit">Upload</button><br /><br />
    ${rawData}
</form>
`;
                res.send(formHTML);
            } catch (e) {
                console.error(e.message);
            }
        });
    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
    });
});

app.post("/upload", (req, res) => {
    const postData = JSON.stringify(req.files);
    let options = {
        host: '10.142.0.3', port: port, path: '/upload', method: 'POST', headers: {
            'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData),
        }
    };

    let httpRequest = http.request(options, function (response) {
        console.log(`STATUS: ${response.statusCode}`);
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
        response.on('end', () => {
            console.log('Tier 1 upload complete..');
            res.redirect('/');
        });
    });

    httpRequest.write(postData);
    httpRequest.end();
});

app.get("/images/*", (req, res) => {
    let paramImage = req.params[0];
    http.get('http://10.142.0.3:8080/images/' + paramImage, (result) => {
        const {statusCode} = result;
        const contentType = result.headers['content-type'];

        let error;
        // Any 2xx status code signals a successful response but
        // here we're only checking for 200.
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
        }
        if (error) {
            console.error(error.message);
            // Consume response data to free up memory
            result.resume();
            return;
        }

        result.setEncoding('utf8');
        let rawData = '';
        result.on('data', (chunk) => {
            rawData += chunk;
        });

        result.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                let imgBuff = Buffer.from(parsedData.data);
                let strHTML = "<img src='data:image/jpeg;base64," + imgBuff.toString('base64') + "' />";
                res.send(strHTML);
            } catch (e) {
                console.error(e.message);
            }
        });
    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
    });

});

app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`Listening on port ${port}`);
});