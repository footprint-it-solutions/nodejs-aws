const AWS = require('aws-sdk');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs')
const morgan = require('morgan');
const { eventNames } = require('process');
const { callbackify } = require('util');
const PORT = process.env.PORT || 8080;
const app = express();

// Enable files upload
app.use(fileUpload({
  createParentPath: true
}));

// Other middleware
app.use(cors());
app.use(morgan('dev'))

// The app is listening to port 8080
app.listen(PORT, () => {
  console.log(`Web Server running on port ${PORT}`);
});

dotenv.config();
// The IAM user credentials used to access the S3 bucket
var awsConfig = {
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: 'eu-west-1'
};

let s3 = new AWS.S3(awsConfig);

// Create a Secrets Manager client
let sm = new AWS.SecretsManager({
  region: 'eu-west-1'
});

let secret;
let decodedBinarySecret;
var obj;

sm.getSecretValue({ SecretId: "foo" }, function (err, data) {
  if (err) {
    if (err.code === 'DecryptionFailureException')
      // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw err;
    else if (err.code === 'InternalServiceErrorException')
      // An error occurred on the server side.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw err;
    else if (err.code === 'InvalidParameterException')
      // You provided an invalid value for a parameter.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw err;
    else if (err.code === 'InvalidRequestException')
      // You provided a parameter value that is not valid for the current state of the resource.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw err;
    else if (err.code === 'ResourceNotFoundException')
      // We can't find the resource that you asked for.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw err;
  }
  else {
    // Decrypts secret using the associated KMS CMK.
    // Depending on whether the secret is a string or binary, one of these fields will be populated.
    if ('SecretString' in data) {
      secret = data.SecretString;
    } else {
      let buff = new Buffer(data.SecretBinary, 'base64');
      decodedBinarySecret = buff.toString('ascii');
    }
  }
  obj = JSON.parse(secret)
  console.log("Secret value for foo is " + obj.foo)
});

// ELB Health check URL
app.get('/health', (req, res) => {
  res.send("App is running!")
})

// Route to access images as a stream
app.get('/images/:imageId', (req, res) => {
  // Declare asnyc funtion
  async function getImage() {
    const data = s3.getObject(
      {
        // S3 bucket name
        Bucket: 'test-bucket-100821',
        // S3 Object Key
        Key: "images/" + req.params.imageId
      }
    ).promise();
    return data;
  }
  // This encode the image into base64 string
  function encode(data) {
    let buf = Buffer.from(data);
    let base64 = buf.toString('base64');
    return base64
  }
  // Function to stream the image in HTML
  getImage()
     // img is the data retrieve from the S3 bucket
    .then((img) => {
      // The image is from the return data which is a base64 encoded jpeg
      let image = "<img src='data:image/jpeg;base64," + encode(img.Body) + "'" + "/>";
      let startHTML = "<html><body>";
      let endHTML = "</body></html>";
      let html = startHTML + image + endHTML;
      res.send(html)
    }).catch((e) => {
      res.send(e)
    })
})

// Upload the image to S3 via a POST to the application
app.post('/upload-images', async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded'
      });
    } else {
    // Use the name of the input field (i.e "upload") to retrieve the upload file
      let upload = req.files.upload;
      var params = {
        // S3 bucket name
        Bucket: 'test-bucket-100821',
        // S3 object key which is used to place the file in upload directory (ie "uploads")
        Key: "uploads/" + upload.name,
        Body: upload.data
      };
      s3.putObject(params, function (err, data) {
         // an error occurred
        if (err) console.log(err, err.stack);
        // successful response
        else console.log(data);
      });
      // This is a response sent back to confirm that the file has been uploaded
      res.send({
        status: true,
        message: 'File is uploaded',
        data: {
          name: upload.name,
          mimetype: upload.mimetype,
          size: upload.size
        }
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route to access images using presigned URL
app.get('/presigned-images/:imageId', (req, res) => {

  var params = {
    Bucket: 'test-bucket-100821',
    Key: req.params.imageId
  };

  // Invoke S3 API to get presigned URL
  // The application authenticates on behalf of the client
  // otherwise the client will get access denied
  var url = s3.getSignedUrl('getObject', params);
  console.log('The URL is', url);

  // The
  let image = "<img src='" + url + "'>";
  let startHTML = "<html><body>";
  let endHTML = "</body></html>";
  let html = startHTML + image + endHTML;
  res.send(html)
})

// Using GET Method to generate a one time pre-signed URL
// The pre-signed URL can then be used with PUT method
//  to be used for secure upload of objects to S3 bucket
app.get('/upload-presigned-images/:imageId', (req, res) => {
  var params = {
    Bucket: 'test-bucket-100821',
    Key: "uploads/" + req.params.imageId,
    // Presigned url is only valid for 100 seconds
    // Expires: 100
  };

  // Invoke S3 API to get presigned URL
  // The application authenticates on behalf of the client
  // otherwise the client will get access denied
  var url = s3.getSignedUrl('putObject', params);
  let startHTML = "<html><body>";
  let endHTML = "</body></html>";
  let html = startHTML + url + endHTML;
  res.send(html)
})

AWS.config.update({
  region: "eu-west-1"
});

let docClient = new AWS.DynamoDB.DocumentClient();
app.get('/event/:eventId', (req, res) => {
  console.log("Querying for IDs");

  var params = {
      TableName : "events",
      KeyConditionExpression: "#id = :id",
      ExpressionAttributeNames:{
        "#id": "id"
      },
      ExpressionAttributeValues: {
        ":id": req.params.eventId
      },
      ProjectionExpression: "EventName"
  };

  docClient.query(params, function(err, data) {
      if (err) {
          console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      } else {
          console.log("Query succeeded.");
          data.Items.forEach(function(item) {
              console.log(" -", item.EventName);
          });
          let startHTML = "<html><body>";
          let endHTML = "</body></html>";
          let html = startHTML + data.Items[0].EventName + endHTML;
          res.send(html)
      }
  });
});
