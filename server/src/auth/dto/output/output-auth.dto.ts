export class OutputAuthDto {
    constructor(public readonly accessToken: string, public readonly refreshToken: string) {}
}