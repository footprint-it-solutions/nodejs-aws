# AWS Certificate Manager

AWS Certificate Manager (ACM) handles the complexity of creating, storing, and renewing public and private SSL/TLS X.509 certificates and keys that protect your AWS websites and applications. You can provide certificates for your integrated AWS services either by issuing them directly with ACM or by importing third-party certificates into the ACM management system. 

## Requesting for a Public SSL/TLS Certificate

### Note: AWS Certificate Manager is a regional service, therefore make sure to be in the correct AWS Region. If you are new to AWS just select N. Virginia (us-east-1) as it is one of the cheapest regions.

1. Sign in to the AWS Management Console and open the ACM console at https://console.aws.amazon.com/acm/home. Choose Request a certificate.

2. On the Request a certificate page, choose Request a public certificate and Request a certificate to continue.

3. On the Add domain names page, type your domain name. 

4. To add another name, choose Add another name to this certificate and type the name in the text box. This is useful for protecting both a bare or apex domain such as example.com and its subdomains such as *.example.com. 

5. On the Select validation method page, choose either DNS validation or Email validation, depending on your needs. 

6. To simplify the process, click on <strong>Create record in Route 53</strong>. A screen will pop up confirming that you want to add a new Record in Route 53.

## Further Reading

* https://aws.amazon.com/certificate-manager/
