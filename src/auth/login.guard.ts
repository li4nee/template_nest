import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { LoginGlobalStore } from 'src/shared/store/login.store';
import { Token } from 'src/types/base.type';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(
    private readonly loginGlobalStore: LoginGlobalStore
  ){}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let request = context.switchToHttp().getRequest();
    let cookieToken = request.cookies["token"];
    if(!cookieToken) 
      return false
    // let bearerToken = cookie.split(' ');
    // if(bearerToken.length !== 2 || bearerToken[0] !== 'Bearer')
    //   return false
    let token:Token | undefined = await this.loginGlobalStore.verifyLoginToken(cookieToken) 
    if(!token)
      return false
    request.user = token.user
    request.token = cookieToken
    return true
  }
}
