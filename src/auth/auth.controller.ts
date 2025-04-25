import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login";

export class AuthController {
  constructor(private authService: AuthService) {}

  async login(req: Request, res: Response) {
    const { email, password } = req.body as LoginDto;

    const user = await this.authService.validateUser(email, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = this.authService.generateToken(user);
    res.json({ access_token: token });
  }
}
