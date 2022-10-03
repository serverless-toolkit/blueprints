import { join } from "path";
import {
  aws_s3,
  Stack,
  App,
  RemovalPolicy,
  CfnOutput,
  aws_s3_deployment,
  StackProps,
} from "aws-cdk-lib";
import { Construct } from "constructs";

class S3Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const websiteBucket = new aws_s3.Bucket(this, "s3-bucket", {
      publicReadAccess: true,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
      websiteIndexDocument: "index.html",
    });

    new aws_s3_deployment.BucketDeployment(this, "s3-bucket-deployment", {
      sources: [aws_s3_deployment.Source.asset(join(__dirname, "website"))],
      destinationBucket: websiteBucket,
    });

    new CfnOutput(this, "bucketName", {
      value: websiteBucket.bucketName,
    });

    new CfnOutput(this, "bucketUrl", {
      value: websiteBucket.bucketWebsiteUrl,
    });
  }
}

const app = new App();
new S3Stack(app, 's3-website-stack');
