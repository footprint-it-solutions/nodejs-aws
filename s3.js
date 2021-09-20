const AWS = require('aws-sdk');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs')
const morgan = require('morgan');
const { eventNames } = require('process');
const { callbackify } = require('util');
const {
  v4: uuidv4,
} = require('uuid');
const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
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

/*
 Start of DynamoDB code
*/

let docClient = new AWS.DynamoDB.DocumentClient();
// Retrieve whole document
app.get('/event/:eventId', (req, res) => {
  console.log("Querying for IDs");

  var params = {
      TableName : "events",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": req.params.eventId
      }
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
          let html = startHTML + data.Items[0].id + endHTML;
          res.send(html)
      }
  });
});


// Retrieve selected elements of the document
app.get('/event-name/:eventId', (req, res) => {
  console.log("Querying for IDs");

  var params = {
      TableName : "events",
      KeyConditionExpression: "id = :id",
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

// Create a new document
app.post('/create-event', (req, res) =>{
  console.log("Creating new event");

  // merge document with the JSON document that has been posted
  var document = req.body
  if (!("id" in document)){
    document.id = uuidv4()
  }

  var params = {
      TableName : "events",
      Item: document
  };
  console.log("Adding a new event...");
  docClient.put(params, function(err, data) {
      if (err) {
          console.error("Unable to add event. Error JSON:", JSON.stringify(err, null, 2));
          res.send("Failed")
      } else {
          console.log("Added item:", JSON.stringify(data, null, 2));
          res.send("Successfully added item with ID " + document.id)
      }
  });
});

// Update an existing document
app.post('/update-event', (req, res) =>{
  console.log("Updating event");

  var params = {
      TableName : "events",
      Key: {
        "id" : req.body.id
      },
      UpdateExpression: "set " + req.body.UpdateExpression + " = :ld",
      ExpressionAttributeValues:{
       ":ld" : req.body.Value
      },
      ReturnValues:"NONE"
  };
  console.log("Updating the event...");
  docClient.update(params, function(err, data) {
      if (err) {
          console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
          res.send("Failed")
      } else {
          console.log("Successfully updated item:", JSON.stringify(data, null, 2));
          res.send("Success")
      }
  });
});

// Updates the entire sub-document
app.post('/update-sub-document', (req, res) =>{
  console.log("Updating entire sub-document")

  var params = {
    TableName : "events",
    Key: {
     "id" : req.body.EventId
    },
    UpdateExpression : "set LayoutData[" + req.body.LayoutDataIndex +  "].LayoutObject = :lo",
    ExpressionAttributeValues : {
    ":lo" : req.body.LayoutDataObject
    },
    ReturnValues : "NONE"
  };
  console.log("Updating sub-document...");
  docClient.update(params, function(err, data) {
      if (err) {
          console.error("Unable to update sub-document. Error JSON:", JSON.stringify(err, null, 2));
          res.send("Failed")
      } else {
          console.log("Successfully updated sub-document:", JSON.stringify(data, null, 2));
          res.send("Success")
      }
  });
});

// Updates document attribute
app.post('/update-layout-name', (req, res) => {
  console.log("Updating attribute")

  var params = {
    TableName : "events",
    Key : {
     "id" : req.body.EventId
    },
    UpdateExpression : "set LayoutData[" + req.body.LayoutDataIndex + "].LayoutName = :ln",
    ExpressionAttributeValues : {
    ":ln" : req.body.LayoutName
    },
    ReturnValues : "NONE"
  };
  console.log("Updating layout name...");
  docClient.update(params, function(err, data) {
      if (err) {
          console.error("Unable to update layout name. Error JSON:", JSON.stringify(err, null, 2));
          res.send("Failed")
      } else {
          console.log("Successfully updated layout name:", JSON.stringify(data, null, 2));
          res.send("Successfully  updated layout name in ID " + req.body.EventId)
      }
  });
});

// Updates document attribute
app.post('/update-scene-name', (req, res) => {
  console.log("Updating scene name")

  var params = {
    TableName : "events",
    Key: {
     "id" : req.body.EventId
    },
    UpdateExpression : "set LayoutData[" + req.body.LayoutDataIndex + "].SceneData.SceneName = :sn",
    ExpressionAttributeValues : {
    ":sn" : req.body.SceneName
    },
    ReturnValues : "NONE"
  };
  console.log("Updating Scene name...");
  docClient.update(params, function(err, data) {
      if (err) {
          console.error("Unable to update scene name. Error JSON:", JSON.stringify(err, null, 2));
          res.send("Failed")
      } else {
          console.log("Successfully updated scene name:", JSON.stringify(data, null, 2));
          res.send("Successfully  updated scene name in ID " + req.body.EventId)
      }
  });
});

// Updates array in document
app.post('/update-partition-data', (req, res) => {
  console.log("Updating array")

  var params = {
    TableName : "events",
    Key: {
     "id" : req.body.EventId
    },
    UpdateExpression : "set LayoutData[" + req.body.LayoutDataIndex + "].SceneData.SettingProperties.partitionData = :pd",
    ExpressionAttributeValues : {
    ":pd" : req.body.partitionData
    },
    ReturnValues : "NONE"
  };
  console.log("Updating array...");
  docClient.update(params, function(err, data) {
      if (err) {
          console.error("Unable to update partition data. Error JSON:", JSON.stringify(err, null, 2));
          res.send("Failed")
      } else {
          console.log("Successfully updated partition data:", JSON.stringify(data, null, 2));
          res.send("Successfully  updated partition data in ID " + req.body.EventId)
      }
  });
});

// Delete the whole document
app.post('/delete-event', (req, res)=>{
  console.log("Deleting event");

  var params = {
      TableName : "events",
      Key: {
        "id": req.body.EventId
      }
  };

  console.log("Attempting to delete the whole document...");
  docClient.delete(params, function(err, data) {
    if (err) {
        console.error("Unable to delete the document. Error JSON:", JSON.stringify(err, null, 2));
        res.send("Failed")
    } else {
        console.log("Delete document succeeded:", JSON.stringify(data, null, 2));
        res.send("Success")
    }
  });
});

// Deletes item from array in document
app.post('/delete-partition-data', (req, res)=>{
  console.log("deleting partition data");

  var params = {
      TableName : "events",
      Key: {
        "id": req.body.EventId
      },
      UpdateExpression: "set LayoutData[" + req.body.LayoutDataIndex + "].SceneData.SettingProperties.partitionData[" + req.body.partitionDataIndex + "] = :pd",
      ExpressionAttributeValues: {
        ":pd": null
      },
      ReturnValues: "NONE"
  };

  console.log("Attempting to delete partition data...");
  docClient.update(params, function(err, data) {
    if (err) {
        console.error("Unable to delete partition data. Error JSON:", JSON.stringify(err, null, 2));
        res.send("Failed")
    } else {
        console.log("delete partition data succeeded:", JSON.stringify(data, null, 2));
        res.send("Success")
    }
  });
});
