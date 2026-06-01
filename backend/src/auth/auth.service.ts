import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../common/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user._id.toString(), email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const exists = await this.userModel.findOne({ email: registerDto.email });
    if (exists) {
      throw new ConflictException('Email already in use');
    }
    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const user = await this.userModel.create({
      name: registerDto.name,
      email: registerDto.email,
      passwordHash,
      role: registerDto.role,
      department: registerDto.department,
    });
    const payload = { sub: user._id.toString(), email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    };
  }

  getProfile(user: Express.User) {
    return user;
  }
}
