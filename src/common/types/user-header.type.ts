import { UserDocument } from 'src/modules/user/entities/user.entity';
import { AuthMode } from './auth-mode.type';

export type UserHeader = UserDocument & { authMode?: AuthMode };
