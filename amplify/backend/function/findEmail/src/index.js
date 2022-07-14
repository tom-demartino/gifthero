/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["GOOGLE_API_KEY"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/

const aws = require('aws-sdk');

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    // get secrets
    const { Parameters } = await new aws.SSM()
    .getParameters({
      Names: [
        "GOOGLE_API_KEY"
      ].map(secretName => process.env[secretName]),
      WithDecryption: true,
    })
    .promise();

    const mySecrets = {};
    Parameters.forEach(secret => {
      mySecrets[secret.Name] = secret.Value;
    });

    const GOOGLE_API_KEY = mySecrets[process.env.GOOGLE_API_KEY];

    console.log("GOOGLE_API_KEY: ", GOOGLE_API_KEY);

    return {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  }, 
        body: JSON.stringify('Hello from Lambda!'),
    };
};
