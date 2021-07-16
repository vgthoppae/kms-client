# kms-client

A Lambda function that illustrates a cross account KMS Key usage generating a data key. The codebase is equipped to get a temporary session with STS assume role (on a Cross Account Role) and using the response credentials for the KMS Client operation. 

Alternatively, if the cross account KMS Key resource policy can give permission to this account Lambda execution role, the STS assume role step is not needed. 

Unfortunately I did the role/policy/permission set up manually from the console and does not form part of this codebase.