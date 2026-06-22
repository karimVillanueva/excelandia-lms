import { jwtVerify, createRemoteJWKSet } from "jose";

const userPoolId = "us-east-1_o6u22DMEO";
const region = "us-east-1";

const JWKS = createRemoteJWKSet(
    new URL(
        `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`
    )
);

export async function verifyToken(token: string) {
    const { payload } = await jwtVerify(token, JWKS);

    return payload;
}