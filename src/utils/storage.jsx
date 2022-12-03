import { EncryptStorage } from 'encrypt-storage';
import { ENCRYPT } from '../common/const';

// const encryptStorage = new EncryptStorage(process.env.SECRET_KEY, options);
export const encryptStorage = new EncryptStorage(ENCRYPT,{});