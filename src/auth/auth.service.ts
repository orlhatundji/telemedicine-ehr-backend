import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { ConfigService } from '@nestjs/config';
import { HospitalService } from 'src/hospital/hospital.service';
import { PrismaService } from 'src/prisma.service';
import { Hospital, Role, User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prismaService: PrismaService,
    private hospitalService: HospitalService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
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
  async validateHospital(email: string, pass: string): Promise<Hospital> {
    const hospital = await this.prismaService.hospital.findUnique({
      where: { email },
    });
    const isMatch = await bcrypt.compare(pass, hospital.password);
    if (hospital && isMatch) {
      delete hospital.password;
      return hospital;
    }
    return null;
  }

  async hospitalSignIn(email: string, pass: string): Promise<any> {
    const hospital = await this.validateHospital(email, pass);
    if (!hospital) {
      throw new UnauthorizedException();
    }

    return {
      access_token: await this.jwtService.signAsync(
        { email, id: hospital.id, role: Role.HOSPITAL },
        { expiresIn: '1d', secret: this.configService.get('JWT_SECRET') },
      ),
      email: hospital.email,
      id: hospital.id,
      name: hospital.name,
      role: Role.HOSPITAL,
    };
  }
}
