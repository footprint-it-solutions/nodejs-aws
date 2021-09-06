# Node.JS AWS Software Development Kit (SDK) Demo

## Files:
* s3.js - Sample application using Express to expose routes that use the S3 APIs server-side.

### Credentials

For local development and testing AWS credentials can be hardcoded directly in the script. Such credentials should be removed prior to committing changes to the code. For real-world usage, credentials should be provided via environment variables.

### Usage

The application listens on http://localhost:8080 - the command to start the app is `node s3.js`

### Routes

#### GET /images/:imageId

#### POST /upload-images

#### GET /presigned-images/:imageId

#### GET /upload-presigned-images/:imageId


## Creating S3 Bucket

* Sign in to the AWS Management Console and open the Amazon S3 console.

* Choose Create bucket.

* In Bucket name, enter a DNS-compliant name for your bucket.

* In Region, choose the AWS Region where you want the bucket to reside.

* By default the block all Public Access for the bucket is selected. Leave this on default.

* Choose Create bucket.

## Further reading

* https://aws.amazon.com/s3/
* https://aws.amazon.com/sdk-for-javascript/
