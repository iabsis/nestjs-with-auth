import { Injectable, Logger } from '@nestjs/common';
import { ForgotPasswordDto } from '../../auth/dto/forgot-password.dto';
import { User, UserDocument } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { AuthToken } from 'src/common/types/auth-token.type';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';

@Injectable()
export class UserService {
  private logger: Logger = null;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private mailerService: MailerService,
    private jwtService: JwtService,
  ) {
    this.logger = new Logger(UserService.name);
  }

  async encryptPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const userData = { ...registerUserDto };
    userData.password = await this.encryptPassword(userData.password);

    return this.userModel.create(userData);
  }

  findAll() {
    return this.userModel.find().exec();
  }

  findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  findByEmail(email: string): Promise<UserDocument> {
    return this.userModel
      .findOne({ email })
      .collation({ locale: 'en', strength: 2 })
      .exec();
  }

  findOne(id: string) {
    return this.userModel.findById(id).exec();
  }

  remove(id: string) {
    return this.userModel.deleteOne({ _id: new Types.ObjectId(id) }).exec();
  }

  async resetPassword(
    user: UserDocument,
    newPassowrd: string,
  ): Promise<boolean> {
    const password = await this.encryptPassword(newPassowrd);

    try {
      await this.userModel
        .updateOne(
          {
            _id: user._id,
          },
          { $set: { password } },
        )
        .exec();
      return true;
    } catch (err) {
      return false;
    }
  }

  async forgotPassword(forgotPassword: ForgotPasswordDto) {
    const user = await this.findByEmail(forgotPassword.email);

    if (!user) {
      this.logger.warn(
        `Email $ ${forgotPassword.email} does not exist. Don't send token`,
      );
      return;
    }
    if (user) {
      const userDetails: AuthToken = {
        email: user.email,
        _id: user._id,
        role: user.role,
        authMode: 'reset-password',
      };

      const token = this.jwtService.sign(userDetails, { expiresIn: '10h' });
      this.mailerService
        .sendMail({
          to: forgotPassword.email,
          template: 'emails/confirm-email',
          subject: `${process.env.EMAIL_PREFIX}Confirm your email address`,
          context: {
            link: `${process.env.PUBLIC_URL}/reset-password?token=${token}`,
            user: user.toObject(),
          },
        })
        .then(() => {
          this.logger.log(
            `Password reset link sent to ${forgotPassword.email}`,
          );
        })
        .catch((error) => {
          this.logger.error(
            `An error occurred while trying to send password reset to ${forgotPassword.email} : ${error.message}`,
          );
        });
    }
  }
}
