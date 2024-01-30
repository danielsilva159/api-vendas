import AppError from 'src/shared/errors/AppErros';
import { getCustomRepository } from 'typeorm';
import UserTokenRepository from '../typeorm/repositories/UserTokenRepository';
import UsersRepository from '../typeorm/repositories/UsersRepository';

interface IRequest {
  email: string;
}

class SendForgotPasswordEmailService {
  public async execute({ email }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const userTokenRepository = getCustomRepository(UserTokenRepository);
    const user = await usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('User does not exists.');
    }

    const token = await userTokenRepository.generate(user.id);
    console.log(token);
  }
}

export default SendForgotPasswordEmailService;
