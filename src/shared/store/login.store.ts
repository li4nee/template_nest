import * as jwt from "jsonwebtoken";
import { createClient, RedisClientType } from "redis";
import { globalSettings } from "src/config/settings.config";
import { Token } from "src/types/base.type";
import { PermissionNotGranted } from "src/types/error.type";
import { Logger } from "src/shared/services/logger.service";
import { RedisService } from "src/shared/services/redis.service";
import { Injectable } from "@nestjs/common";

/**
 * LoginGlobalStore class is used to manage login tokens and secondary tokens for users.
 * It provides methods to set, verify, and remove tokens from a Redis database.
 */
@Injectable()
export class LoginGlobalStore {
  
  login_hash = "login_store"
  secondary_hash = "secondary_store"
  private secret: string =globalSettings.JWT_SECRET || "miccheck1212miccheck1212"
  private client : RedisClientType
  constructor(private readonly redisService: RedisService) {
  }

  onModuleInit() {
    this.client = this.redisService.getClient();
  }

  private validateToken = (token: string): Token | undefined => {
    try {
      
      return jwt.verify(token, this.secret) as Token;
    } catch(err) {
      return undefined;
    }
  };
  
  private setToken = async (hash: string, userId: string, token: string, expiry?: number) => {
    const key = `${hash}:${userId}`;
    await this.client.sAdd(key, token);
    if (expiry) 
      await this.client.expire(key, expiry);
  };
  
  private getToken = async (hash: string, userId: string) => {
    const key = `${hash}:${userId}`;
    const exists = await this.client.exists(key);
    if (!exists) 
      return { found: false, tokens: [] };
    const tokens = await this.client.sMembers(key); // sab token dincha esle
    return { found: true, tokens };
  };
  
  private removeToken = async (hash: string, userId: string, token: string) => {
    const key = `${hash}:${userId}`;
    const removed = await this.client.sRem(key, token);
    const remaining = await this.client.sCard(key);  // Kati ota remaining tokens cha tesko count dincha esle
    if (remaining === 0) 
      await this.client.del(key);
    return removed === 1;
  };
  

  removeLoginToken = async (userId: string, token: string) => {
    return await this.removeToken(this.login_hash, userId, token);
  };

  verifyLoginToken = async (token: string) => {
    if (!token) throw new PermissionNotGranted("Token not found");
    let verify = this.validateToken(token);
    if (!verify) return undefined;
    let { found, tokens } = await this.getToken(
      this.login_hash,
      verify.user.userId,
    );
    if (!found || tokens.indexOf(token) <= -1)
      throw new PermissionNotGranted("Session expired");
    return verify;
  };

  setLoginToken = async (token: string, userId: string) => {
    await this.setToken(this.login_hash, userId, token);
  };

  removeSecondaryToken = async (userId: string, token: string) => {
    return await this.removeToken(this.secondary_hash, userId, token);
  }

  verifySecondaryToken = async (token: string) => {
    if (!token) throw new PermissionNotGranted("Token not found");
    let verify = this.validateToken(token) as Token;
    console.log("verify",verify)
    if (!verify) 
      throw new PermissionNotGranted("Invalid token");
    let { found, tokens } = await this.getToken(
      this.secondary_hash,
      verify.user.userId,
    );
    if (!found || tokens.indexOf(token) <= -1)
      throw new PermissionNotGranted("Token expired");
    return verify;
  };

  setSecondaryToken = async (token: string, userId: string,expiry:number=60*60) => {
    await this.setToken(this.secondary_hash, userId, token,expiry);
  };
}

