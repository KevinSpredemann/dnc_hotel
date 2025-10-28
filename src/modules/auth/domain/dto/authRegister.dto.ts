import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDTO } from "../../../users/domain/dto/createUser.dto";

export class AuthRegisterDTO extends PartialType(CreateUserDTO) {}