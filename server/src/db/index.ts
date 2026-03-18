import _dynamoose from "dynamoose";
const dynamoose = (_dynamoose as any).default ?? _dynamoose;

const endpoint = process.env.DYNAMODB_ENDPOINT;

if (endpoint) {
  dynamoose.aws.ddb.local(endpoint);
  console.log(`DynamoDB configured for local endpoint: ${endpoint}`);
} else {
  console.log("DynamoDB configured for AWS (using default credentials)");
}

export default dynamoose;
