// src/lib/auth-url.ts

const hostedUi = process.env.NEXT_PUBLIC_COGNITO_HOSTED_UI!;
const clientId = process.env.NEXT_PUBLIC_OIDC_CLIENT_ID!;
const redirectUri = process.env.NEXT_PUBLIC_OIDC_REDIRECT_URI!;
const responseType =
    process.env.NEXT_PUBLIC_OIDC_RESPONSE_TYPE || "code";
const scope =
    process.env.NEXT_PUBLIC_OIDC_SCOPE || "openid email";
const logoutUri =
    process.env.NEXT_PUBLIC_COGNITO_LOGOUT_URI!;

export function getLoginUrl() {
    const params = new URLSearchParams({
        client_id: clientId,
        response_type: responseType,
        scope,
        redirect_uri: redirectUri,
        lang: "es-MX",
    });

    return `${hostedUi}/oauth2/authorize?${params.toString()}`;
}

export function getLogoutUrl() {
    const params = new URLSearchParams({
        client_id: clientId,
        logout_uri: logoutUri,
    });

    return `${hostedUi}/logout?${params.toString()}`;
}