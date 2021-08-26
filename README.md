# Node.JS AWS Software Development Kit (SDK) Demo

## Files:
* index.js - Sample application using Express to expose routes - this should probably be renamed to s3.js

### index.js

### Credentials

For local development and testing AWS credentials can be hardcoded directly in the script. Such credentials should be removed prior to committing changes to the code. For real-world usage, credentials should be provided via environment variables.

### Usage

The application listens on http://localhost:8080 - the command to start the app is...?

### Routes

#### GET /images/:imageId

#### POST /upload-images

#### GET /presigned-images/:imageId

#### GET /upload-presigned-images/:imageId

## Further reading

* https://aws.amazon.com/s3/
* https://aws.amazon.com/sdk-for-javascript/
