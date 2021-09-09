# AWS Identity and Access Management (IAM)

AWS Identity and Access Management (IAM) is a web service that helps you securely control access to AWS resources. You use IAM to control who is authenticated (signed in) and authorized (has permissions) to use resources. 

## Creating an IAM user

1. Sign in to the AWS Management Console and open the Amazon IAM console.

2. Create credentials for the user, depending on the type of access the user requires. Programmatic access will allow the user to make make API calls or use the AWS CLI. Choose AWS Management Console if the user needs to access the AWS Management Console, create a password for the user. As a best practice, create only the credentials that the user needs.

3.  Give the user permissions to perform the required tasks by adding the user to one or more groups. For this demo an inline policy was added to the IAM user given with the least privileges

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:List*"
            ],
            "Resource": "arn:aws:s3:::bucketName"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:Get*",
                "s3:List*",
                "s3:Put*"
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

4. (Optional) Add metadata to the user by attaching tags.

5. Review the IAM user details, to check whether it is correct, click on Create user.

6. Successfully, the IAM user has been created, check the AWS sign URL and download the .csv of access credentials.

## Creating an IAM Policy using JSON tab

1. Sign in to the AWS Management Console and open the IAM console at https://console.aws.amazon.com/iam/

2. In the navigation pane on the left, choose Policies.

3. Choose Create policy.

4. Choose the JSON tab.

5. Type or paste a JSON policy document. Below is an example policy. The example policy has three parts. First, it can only list the specific bucket. Secondly, it can list, read, and write inside the bucket. Lastly, it can write to a specific folder.

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:List*"
            ],
            "Resource": "arn:aws:s3:::bucketName"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:Get*",
                "s3:List*",
                "s3:Put*"
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

6. Resolve any security warnings, errors, or general warnings generated during policy validation, and then choose Review policy.

7. When you are finished, choose Next: Tags.

8. On the Review policy page, type a Name and a Description (optional) for the policy that you are creating. Review the policy Summary to see the permissions that are granted by your policy. Then choose Create policy to save your work.

## Creating an IAM Role using the AWS Management Console

1. Sign in to the AWS Management Console and open the IAM console at https://console.aws.amazon.com/iam/

2. In the navigation pane of the console, click Roles and then click on "Create Role". The screen appears shown below on clicking Create Role button.

3. Choose the service that you want to use with the role.

4. Select the managed policy or custom policy that attaches the permissions to the service.

5. In a role name box, enter the role name that describes the role of the service, and then click on "Create role".

## Further reading

* https://aws.amazon.com/iam/
