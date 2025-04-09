import Stream from "stream";

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


