import {
  aws_lambda_nodejs,
  Stack,
  App,
  CfnOutput,
  Duration,
  aws_lambda,
  StackProps,
} from "aws-cdk-lib";
import { Construct } from "constructs";

class LambdaUrlStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const handler = new aws_lambda_nodejs.NodejsFunction(
      this,
      "lambda-handler",
      {
        timeout: Duration.minutes(15),
        memorySize: 128,
        handler: "handler",
        awsSdkConnectionReuse: true,
        runtime: aws_lambda.Runtime.NODEJS_16_X,
      }
    );

    const fnUrl = new aws_lambda.FunctionUrl(this, "lambda-handler-url", {
      function: handler,
      authType: aws_lambda.FunctionUrlAuthType.NONE,
    });

    new CfnOutput(this, "lambda-name", {
      value: handler.functionName,
    });

    new CfnOutput(this, "lambda-url", {
      value: fnUrl.url,
    });
  }
}

const app = new App();
new LambdaUrlStack(app, `stk-stack-${process.env.STACKID}`);
