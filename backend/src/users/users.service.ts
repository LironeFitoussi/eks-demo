import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../common/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll() {
    return this.userModel.find({}, { passwordHash: 0 }).lean();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id, { passwordHash: 0 }).lean();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(dto: CreateUserDto) {
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists) throw new ConflictException('Email already in use');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: dto.role,
      department: dto.department,
      isActive: dto.isActive ?? true,
    });
    const { passwordHash: _, ...result } = user.toObject();
    return result;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.userModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true, projection: { passwordHash: 0 } })
      .lean();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new NotFoundException('User not found');
    return { deleted: true };
  }
}
