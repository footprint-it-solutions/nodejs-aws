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

#### PUT /upload-presigned-images/:imageId

### Prerequisites for setting up Elastic Beanstalk

1. [S3 Bucket](https://github.com/footprintmediaits/nodejs-aws/blob/main/S3.md)

2. [IAM User and Policy](https://github.com/footprintmediaits/nodejs-aws/blob/main/IAM.md)

3. [Certificate Manager](https://github.com/footprintmediaits/nodejs-aws/blob/main/ACM.md)

4. [Route53](https://github.com/footprintmediaits/nodejs-aws/blob/main/Route53.md)

### Deploying the application in [Elastic Beanstalk](https://github.com/footprintmediaits/nodejs-aws/blob/main/EB.md)

## Further reading

* https://aws.amazon.com/sdk-for-javascript/
