import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { User } from "./interfaces/user.interface";

@Injectable()
export class UserService {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  async getByAddress(address: string): Promise<User | null> {
    const user = await this.prismaService.user.findFirst({
      where: { address },
    });
    if (!user) return null;

    return { address: user.address };
  }
}
