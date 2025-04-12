import Stream from "stream";
import { Request } from "express";
export enum ROLES {
  USER = "user",
  ADMIN = "admin",
}

export interface Token {
  user: {
    userId: string;
    role: ROLES;
  };
  token: string;
}

export interface MailAuth{
  username?:string,
  password?:string,
}
export interface MailerConfig{
  host?:string,
  auth?:MailAuth,
  port?:number,
  secure?:boolean,
}

export interface MessageMailInterface{
  from:string,
  to:string,
  subject?:string,
  bcc?:string,
  cc?:string,
  text?:string,
  html?:string,
  attachment?:MailAttachment
}

export interface MailAttachment{
  filename:string,
  content?:Stream | Buffer | string
  path?:string
  raw?:string
}


export enum EMAIL_TYPE{
  TEXT= 'text',
  HTML= 'html',
  ATTACHMENT= 'attachment'
};

export enum TASK_STATUS{
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  SCHEDULED = "scheduled",
  CANCELLED = "cancelled",
}

export enum TASK_TYPE{
  EMAIL = "email",
  SMS = "sms",
  NOTIFICATION = "notification",
  OTHER = "other",
}

export enum TASK_PRIORITY{
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3,
  IMMEDIATE = 0,
}

export interface AuthorizedRequest extends Request {
  user:{
    userId:string,
    role:ROLES
  },
  token: string;
}


