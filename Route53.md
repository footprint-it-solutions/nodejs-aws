# Route53

Amazon Route53 is a highly available and scalable DNS service offered by AWS. Like any DNS service, Route 53 handles domain registration and routes users’ Internet requests to your application – whether it’s hosted on AWS or elsewhere.

## Creating a Public Hosted Zone

A public hosted zone is a container that holds information about how you want to route traffic on the internet for a specific domain, such as example.com, and its subdomains. After you create a hosted zone, you create records that specify how you want to route traffic for the domain and subdomains. 

1. Sign in to the AWS Management Console and open the Route 53 console at https://console.aws.amazon.com/route53/.

2. If you're new to Route 53, choose Get started under DNS management. If you're already using Route 53, choose Hosted zones in the navigation pane.

3. Choose Create hosted zone.

4. In the Create Hosted Zone pane, enter the name of the domain that you want to route traffic for. You can also optionally enter a comment.

5. For Type, accept the default value of Public Hosted Zone.

6. Choose Create.

## Adding records

1. Sign in to the AWS Management Console and open the Route 53 console at https://console.aws.amazon.com/route53/.

2. In the navigation pane, choose Hosted zones.

3. On the Hosted zones page, choose the name of the hosted zone that you want to create records in.

4. Choose Create record.

5. Choose and define the applicable routing policy, values, or alias.

6. Choose Create records. 

## Further reading

* https://aws.amazon.com/route53/
