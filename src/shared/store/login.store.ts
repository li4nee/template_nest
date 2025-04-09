import jwt from "jsonwebtoken";
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
  
  private login_hash = "login_store";
  private secret: string =globalSettings.JWT_SECRET || "miccheck1212miccheck1212";
  private client : RedisClientType
  constructor(private readonly redisService: RedisService) {
  }

  onModuleInit() {
    this.client = this.redisService.getClient();
  }

  private validateToken = (token: string): Token | undefined => {
    try {
      let validate = jwt.verify(token, this.secret) as Token;
      return validate;
    } catch (err) {
      return undefined;
    }
  };

  private setToken = async (hash: string, userId: string, token: string) => {
    let existingToken = await this.client.hGet(hash, userId);
    let tokens: string[] = existingToken ? JSON.parse(existingToken) : [];
    tokens.push(token);
    return await this.client.hSet(hash, userId, JSON.stringify(tokens));
  };

  private getToken = async (hash: string, userId: string) => {
    if (!(await this.client.hExists(hash, userId)))
      return { found: false, tokens: [] };
    let stringifiedToken = await this.client.hGet(hash, userId);
    let tokens = stringifiedToken ? JSON.parse(stringifiedToken) : [];
    return { found: true, tokens };
  };

  private removeToken = async (hash: string, userId: string, token: string) => {
    let stringifiedToken = await this.client.hGet(hash, userId);
    if (!stringifiedToken) return false;
    let tokens = stringifiedToken ? JSON.parse(stringifiedToken) : [];
    if (tokens.length <= 1) {
      await this.client.hDel(hash, userId);
      return false;
    }
    let index = tokens.indexOf(token);
    if (tokens.length > 1)
      await this.client.hSet(
        hash,
        userId,
        JSON.stringify([...tokens.slice(0, index), ...tokens.slice(index + 1)]),
      );
    else await this.client.hDel(hash, userId);
    return true;
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

  setLoginToken = (token: string, userId: string) => {
    this.setToken(this.login_hash, userId, token);
  };
}

