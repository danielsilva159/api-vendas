import { Request, Response } from 'express';
import SendForgotPasswordEmailService from '../services/SendForgotPasswordEmailService';
import ResetPassowrdService from '../services/ResetPasswordService';

export default class ResetPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { password, token } = request.body;
    const resetPassword = new ResetPassowrdService();
    await resetPassword.execute({ password, token });
    return response.status(204).json();
  }
}
