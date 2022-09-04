import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from "@nestjs/common";
import { User } from "./interfaces/user.interface";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return "Hello";
  }

  @Get(":address")
  getUser(@Param("address") address: string): Promise<User | null> {
    const user = this.userService.getByAddress(address);
    if (!user) {
      throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
