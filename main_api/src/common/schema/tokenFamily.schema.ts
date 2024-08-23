
export class TokenFamily {
    userId: string;
    activeRefreshToken: string;
    activeAccessToken: string;
    oldAccessTokens: string[];
    oldRefreshTokens: string[];
}
