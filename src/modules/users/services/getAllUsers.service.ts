import { Inject, Injectable } from "@nestjs/common";
import type { IUserRepository } from "../domain/repositories/Iusers.repository";
import { REPOSITORY_TOKEN_USER } from "../utils/usersTokens";

@Injectable()
export class GetAllUserService {
    constructor(
        @Inject(REPOSITORY_TOKEN_USER)
        private readonly userRepositories: IUserRepository) {}
    async execute() {
        const users = await this.userRepositories.getAllUsers();
        return users;
    }
}    