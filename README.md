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

## Creating an IAM user

* Sign in to the AWS Management Console and open the Amazon IAM console.

* Create credentials for the user, depending on the type of access the user requires. Programmatic access will allow the user to make make API calls or use the AWS CLI. Choose AWS Management Console if the user needs to access the AWS Management Console, create a password for the user. As a best practice, create only the credentials that the user needs.

* Give the user permissions to perform the required tasks by adding the user to one or more groups. For this demo an inline policy was added to the IAM user given with the least privileges

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:Get*",
                "s3:List*"
            ],
            "Resource": "arn:aws:s3:::bucketName/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:Put*"
            ],
            "Resource": "arn:aws:s3:::bucketName/optionalFolderName/*"
        }
    ]
}
```

* (Optional) Add metadata to the user by attaching tags.

* Review the IAM user details, to check whether it is correct, click on Create user.

* Successfully, the IAM user has been created, check the AWS sign URL and download the .csv of access credentials.


## Further reading

* https://aws.amazon.com/s3/
* https://aws.amazon.com/iam/
* https://aws.amazon.com/sdk-for-javascript/

# AWS Elastic Beanstalk

Elastic Beanstalk is a platform within AWS that is used for deploying and scaling web applications. In simple terms this platform as a service (PaaS) takes your application code and deploys it while provisioning the supporting architecture and compute resources required for your code to run. Elastic Beanstalk also fully manages the patching and security updates for those provisioned resources. There is no charge to use Elastic Beanstalk to deploy your applications, you are only charged for the resources that are created to support your application, such as the EC2 instance(s) and the Elastic Load Balancer.

Supported language platforms include:

* Ruby
* Python
* PHP
* Go
* Node.js
* Java 
* .NET on Windows Server IIS
* .NET Core on Linux
* Packer Builder
* Glassfish
* Docker
* Tomcat
## Installing EB CLI

Follow this link to install https://github.com/aws/aws-elastic-beanstalk-cli-setup

## Deploying an application in Elastic Beanstalk

Below is a sample of Nodejs Project directory structure
```
nodejs-aws
├── .ebextensions
│   ├── alb-default-process.config
│   ├── instance.config
│   └── securelistener-alb.config
├── .elasticbeanstalk
│   └── config.yml
├── package.json
├── package-lock.json
├── .platform
│   └── nginx
│       └── conf.d
│           └── myconf.conf
└── s3.js
```

There are two ways to deploy an application, this is through the CLI or in the console.
### Creating the Elastic Beanstalk App

First, initialise our Node project as an EB project. For this we’ll use the `eb init` command. The command will create the `.elasticbeanstalk` folder along with the `config.yml`. The file will have the following values.

![](https://i.imgur.com/wNFeY10.png)

