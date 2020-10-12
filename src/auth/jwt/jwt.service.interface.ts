export default interface JwtServiceInterface {
    sign<T>(payload: T): Promise<string>;
    signRefreshToken<T>(payload: T): Promise<string>;
    destroy(token: string): Promise<boolean>;
    verify(token: string): Promise<object>;
    decode<T>(token: string): Promise<T>;
}