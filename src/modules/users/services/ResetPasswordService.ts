import AppError from '../../../shared/errors/AppErros';
import { getCustomRepository } from 'typeorm';
import UserTokenRepository from '../typeorm/repositories/UserTokenRepository';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import { isAfter, addHours } from 'date-fns';
import { hash } from 'bcryptjs';

interface IRequest {
  token: string;
  password: string;
}

class ResetPassowrdService {
  public async execute({ token, password }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const userTokenRepository = getCustomRepository(UserTokenRepository);
    const userToken = await userTokenRepository.findByToken(token);
    if (!userToken) {
      throw new AppError('User Token does not exists.');
    }
    const user = await usersRepository.findById(userToken.user_id);
    if (!user) {
      throw new AppError('User does not exists.');
    }

    const tokenCreateAt = userToken.created_at;
    const compareDate = addHours(tokenCreateAt, 2);
    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired');
    }

    user.password = await hash(password, 8);
    console.log(token);
    await usersRepository.save(user);
  }
}

export default ResetPassowrdService;
