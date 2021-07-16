const { KMSClient, GenerateDataKeyCommand } = require("@aws-sdk/client-kms");
const { STSClient, AssumeRoleCommand } = require("@aws-sdk/client-sts");

const response = {
    'statusCode': 200,
    'body': JSON.stringify({
        message: 'hello world',
    })
}
const genDataKeyInput = {
    KeyId: 'arn:aws:kms:us-east-1:xxx:key/xxx',
    KeySpec: 'AES_256'
}
const assumeRoleInput = {
    ExternalId: '123',
    RoleArn: 'arn:aws:iam::xxx:role/kms-key-user-cross-account-role',
    RoleSessionName: 'kms-key-user-car-session'
}

const config = { region: 'us-east-1' }
const stsClient = new STSClient(config);

exports.lambdaHandler = async (event, context) => {
    try {
        const stsResponse = await assumeRole();
        if (stsResponse) {
            const configInput = {
                ...config,
                credentials: {
                    accessKeyId: stsResponse.Credentials.AccessKeyId,
                    secretAccessKey: stsResponse.Credentials.SecretAccessKey,
                    sessionToken: stsResponse.Credentials.SessionToken
                }
            }
            console.log(configInput)
            const kmsClient = new KMSClient(configInput);
            const command = new GenerateDataKeyCommand(genDataKeyInput);
            const response = await kmsClient.send(command);
            console.log('returned from call')
            var plaintext = new TextDecoder().decode(response.Plaintext);
            console.log(plaintext);
        } else {
            console.log('sts assume role failed-aborting')
        }
    } catch (err) {
        console.log(err);
        return err;
    }
    return response
};

const assumeRole = async () => {
    try {
        const command = new AssumeRoleCommand(assumeRoleInput);
        const response = await stsClient.send(command);
        console.log('assume role call completed')
        console.log(response)
        return response
    } catch (err) {
        console.log(err, err.stack);
        return undefined;
    }

}
