export const JwtServiceMock = {
    sign: () => {
        return Promise.resolve('resolve');
    },
    signRefreshToken: () => {
        return Promise.resolve('resolve');
    },
    destroy: () => {
        return Promise.resolve(false);
    },
    verify: () => {
        return Promise.resolve({});
    },
    decode: function fn<T>(token: string) {
        return {} as T;
    }
};