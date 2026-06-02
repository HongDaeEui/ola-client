export declare class AuthController {
    signIn(body: any): {
        data: {
            accessToken: string;
        };
    };
    getSelf(req: any): {
        data: {
            id: number;
            loginId: string;
            name: string;
            email: string;
            createdAt: string;
        };
    };
}
