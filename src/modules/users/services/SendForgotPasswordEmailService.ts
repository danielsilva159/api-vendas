import AppError from '../../../shared/errors/AppErros';
import { getCustomRepository } from 'typeorm';
import path from 'path';
import UserTokenRepository from '../typeorm/repositories/UserTokenRepository';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import EtherealMail from '../../../config/mail/EtherealMail';

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

    const { token } = await userTokenRepository.generate(user.id);
    const forgotPassowrdTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );
    console.log(token);
    await EtherealMail.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[API Vendas] Recuperação de senha',

      templateDta: {
        file: forgotPassowrdTemplate,
        variables: {
          name: user.name,
          link: `http://localhost:3000/reset_password?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
