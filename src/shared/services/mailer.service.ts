import { Injectable } from "@nestjs/common";
import {Transporter, createTransport} from "nodemailer"
import SMTPTransport = require("nodemailer/lib/smtp-transport")
import { MailSendError } from "src/types/error.type";
import { Readable, Stream } from "stream"
import { Logger } from "./logger.service";
import { EMAIL_TYPE, MailerConfig, MessageMailInterface } from "src/types/base.type";
import { globalSettings } from "src/config/settings.config";

@Injectable()
export class Mailer{
    constructor (private readonly logger:Logger){
        this.connect()
    }

    connect=()=>{
        return new Promise<Transporter<SMTPTransport.SentMessageInfo>>((resolve,reject)=>{
            try{
                let transport= createTransport({
                    host:globalSettings.MAILER.host,
                    auth:{
                        user:globalSettings.MAILER.username,
                        pass:globalSettings.MAILER.password
                    },
                    secure:true,
                    port:465,
                    connectionTimeout:10000,
                    socketTimeout:10000
                } as unknown)
                resolve(transport)
            }
            catch(e){
                reject(new MailSendError(e.message))
            }
        })
    }

    sendMail= async (message:MessageMailInterface,MAIL_TYPE:EMAIL_TYPE=EMAIL_TYPE.TEXT)=>{
        let transport=await this.connect()
        transport.sendMail(message).catch((e: any)=>this.logger.logEmailError(message.to,MAIL_TYPE,e))
        return {
            message:"Mail sent seccess"
        }
    }

    sendMailHTML=async(email:string,template:string,subject:string)=>{
        this.sendMail({
            from: globalSettings.MAILER.from,
            to: email,
            html:template,
            subject
        },EMAIL_TYPE.HTML)
    }
}