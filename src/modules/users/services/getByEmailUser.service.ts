import { Inject, Injectable } from "@nestjs/common";
import type { IUserRepository } from "../domain/repositories/Iusers.repository";
import { REPOSITORY_TOKEN_USER } from "../utils/usersTokens";

Injectable()
export class GetByEmailUserService {
    constructor(
        @Inject(REPOSITORY_TOKEN_USER)
        private readonly userRepositories: IUserRepository) {}
    async execute(email: string) {
        return await this.userRepositories.getByEmailUser(email);
    }
}