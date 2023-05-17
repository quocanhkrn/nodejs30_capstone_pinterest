import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, decodedToken: any, info: any, context: any) {
    const { password, is_remove, ...data } = decodedToken;
    if (err || !decodedToken) {
      throw (
        err ||
        new UnauthorizedException('Please sign in or create new account!')
      );
    }
    return data;
  }
}
