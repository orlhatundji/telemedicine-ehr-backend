import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ email });
    const isMatch = await bcrypt.compare(pass, user.password);
    if (user && isMatch) {
      delete user.password;
      return user;
    }
    return null;
  }

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({
      email,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    return {
      access_token: await this.jwtService.signAsync(
        { email, role: user.role, id: user.id },
        { expiresIn: '1d', secret: this.configService.get('JWT_SECRET') },
      ),
      email: user.email,
      id: user.id,
      role: user.role,
      name: user.name,
      patient: user.patient,
      doctor: user.doctor,
    };
  }
}
