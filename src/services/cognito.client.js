import { CognitoUserPool } from "amazon-cognito-identity-js";

const {
  VITE_COGNITO_USER_POOL_ID,
  VITE_COGNITO_CLIENT_ID,
  VITE_AWS_REGION = "eu-north-1",
} = import.meta.env;

void VITE_AWS_REGION;

if (!VITE_COGNITO_USER_POOL_ID || !VITE_COGNITO_CLIENT_ID) {
  throw new Error(
    "Missing Cognito configuration: VITE_COGNITO_USER_POOL_ID and VITE_COGNITO_CLIENT_ID must be set."
  );
}

export const userPool = new CognitoUserPool({
  UserPoolId: VITE_COGNITO_USER_POOL_ID,
  ClientId: VITE_COGNITO_CLIENT_ID,
});
