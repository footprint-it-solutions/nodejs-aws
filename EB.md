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
## Creating the Elastic Beanstalk App using the CLI

First, initialise our Node project as an EB project. For this we’ll use the `eb init` command.Follow the prompts using the options.

```
eb init

Select a default region
1) us-east-1 : US East (N. Virginia)
2) us-west-1 : US West (N. California)
3) us-west-2 : US West (Oregon)
4) eu-west-1 : EU (Ireland)
5) eu-central-1 : EU (Frankfurt)
6) ap-south-1 : Asia Pacific (Mumbai)
7) ap-southeast-1 : Asia Pacific (Singapore)
8) ap-southeast-2 : Asia Pacific (Sydney)
9) ap-northeast-1 : Asia Pacific (Tokyo)
10) ap-northeast-2 : Asia Pacific (Seoul)
11) sa-east-1 : South America (Sao Paulo)
12) cn-north-1 : China (Beijing)
13) cn-northwest-1 : China (Ningxia)
14) us-east-2 : US East (Ohio)
15) ca-central-1 : Canada (Central)
16) eu-west-2 : EU (London)
17) eu-west-3 : EU (Paris)
18) eu-north-1 : EU (Stockholm)
19) eu-south-1 : EU (Milano)
20) ap-east-1 : Asia Pacific (Hong Kong)
21) me-south-1 : Middle East (Bahrain)
22) af-south-1 : Africa (Cape Town)
(default is 3): 4

Select an application to use
1) [ Create new Application ]
(default is 1): 1

Enter Application Name
(default is "nodejs"): 
Application nodejs has been created.

Select a platform.
1) .NET Core on Linux
2) .NET on Windows Server
3) Docker
4) GlassFish
5) Go
6) Java
7) Node.js
8) PHP
9) Packer
10) Python
11) Ruby
12) Tomcat
(make a selection): 7

Select a platform branch.
1) Node.js 14 running on 64bit Amazon Linux 2
2) Node.js 12 running on 64bit Amazon Linux 2
3) Node.js 10 running on 64bit Amazon Linux 2 (Deprecated)
4) Node.js running on 64bit Amazon Linux (Deprecated)
(default is 1): 1
```

## Creating the Elastic Beanstalk Environment

In order to create our first environment we’ll use the `eb create` command. Again, follow the prompt using all the default options for now:

```
eb create
Enter Environment Name
(default is nodejs-dev):
Enter DNS CNAME prefix
(default is nodejs-dev):

Select a load balancer type
1) classic
2) application
3) network
(default is 2):


Would you like to enable Spot Fleet requests for this environment? (y/N): N
Creating application version archive "app-7493-210903_163432".
Uploading nodejs/app-7493-210903_163432.zip to S3. This may take a while.
Upload Complete.
Environment details for: nodejs-dev
  Application name: nodejs
  Region: eu-west-1
  Deployed Version: app-7493-210903_163432
  Environment ID: e-73bakajvyv
  Platform: arn:aws:elasticbeanstalk:eu-west-1::platform/Node.js 14 running on 64bit Amazon Linux 2/5.4.5
  Tier: WebServer-Standard-1.0
  CNAME: nodejs-dev.eu-west-1.elasticbeanstalk.com
..................................................
2021-09-03 15:38:31    INFO    Instance deployment completed successfully.
```

After creating the EB app and environment, notice that there is a new directory in the root of you Node project called `.elasticbeanstalk`. This directory contains a YML file with the deployment configuration and looks like this:

![](https://i.imgur.com/wNFeY10.png)

## Creating the Elastic Beanstalk App using the Console

### Creating the Application

1. Open the Elastic [Beanstalk console](https://console.aws.amazon.com/elasticbeanstalk/home#).

2. Choose <strong>Applications</strong>.

3. Click on <strong>Create a new application</strong>.

4. Fill out the application information and then clink on <strong>Create</strong>.

### Creating the the Environment

1. Open the Elastic [Beanstalk console](https://console.aws.amazon.com/elasticbeanstalk/home#).

2. Choose <strong>Environments</strong>.

3. Click on <strong>Create a new environment</strong>.

4. Select the environment tier.

* Amazon Elastic Beanstalk has two types of environment tiers to support different types of web applications. Web servers are standard applications that listen for and then process HTTP requests, typically over port 80. Workers are specialized applications that have a background processing task that listens for messages on an Amazon SQS queue. Worker applications post those messages to your application by using HTTP. 

5. Fill out the Environment information

* Name – Enter a name for the environment. The form provides a generated name.

* Domain – (web server environments) Enter a unique domain name for your environment. The default name is the environment's name. You can enter a different domain name. Elastic Beanstalk uses this name to create a unique CNAME for the environment. To check whether the domain name you want is available, choose Check Availability.

* Description – Enter a description for this environment.

6. Select a platform for the new environment.

* You can create a new environment from two types of platforms, Managed platform or Custom platform.

* Select a platform, a platform branch within that platform, and a specific platform version in the branch. When you select a platform branch, the recommended version within the branch is selected by default. In addition, you can select any platform version you've used before. 

7. Provide the application code.

* Use the sample application that Elastic Beanstalk provides for each platform.

* Use an application code that is already deployed to Elastic Beanstalk. Choose Existing version and the application in the Application code section.

* Upload a new code. Choose Upload your code, and then choose Upload. You can upload new application code from a local file, or you can specify the URL for the Amazon S3 bucket that contains your application code. 

8. Click on <strong>Create environment</strong>
