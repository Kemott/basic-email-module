const mail = require('@sendgrid/mail');
const htmlToFormattedText = require('html-to-formatted-text');

export class Mailer{

    #to;
    #sendgrid_api_key;
    #from;
    #subject;
    #html;

    constructor(API_KEY){
        this.sendgrid_api_key = API_KEY;
        mail.setApiKey(this.sendgrid_api_key);
    }

    async sendEmail(next){
        let result = true;
        const msg = {
            to: this.to,
            from: this.from,
            subject: this.subject,
            text: htmlToFormattedText(this.html),
            html: this.html
        };
        await mail.send(msg).then(() => {
            result = true;
        }).catch((error) => {
            console.error(error);
            result = error;
        });
        return result;
    }

    setRecipient(to){
        if(checkEmail(to)){
            this.to = to;
        }else{
            throw new Error('Wrong recipient');
        }
    }

    getRecipient(){
        return this.to;
    }

    setSender(from){
        if(checkEmail(from)){
            this.from = from;
        }else{
            throw new Error('Wrong sender');
        }
    }

    getSender(){
        return this.from;
    }

    setSubject(subject){
        if(!is_set(subject)){
            throw new Error('The subject of the message cannot be empty');
        }else{
            this.subject = removeScripts(subject);
        }
    }

    getSubject(){
        return this.subject;
    }

    setContent(html){
        if(!is_set(html)){
            throw new Error('The content of the message cannot be empty');
        }else{
            this.html = removeScripts(html);
        }
    }

    getContent(){
        return this.html;
    }

    #checkEmail(email){
        let rgx = new RegExp('^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' +
            '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
            '(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$');
        if(email == undefined || !rgx.test(email)){
            return false;
        }else{
            return true;
        }
    }

    #removeScripts(txt){
        let pos = txt.search(/<script/i);
        let pos2 = txt.search(/<\/script>/i);
        let part1 = '';
        let part2 = '';
        let result = txt;
        while(pos > -1){
            part1 = result.substring(0,pos);
            part2 = result.substring(pos2+9);
            result = part1 + part2;
            pos = result.search('<script');
            pos2 = result.search('</script>');
        }
        result = result.replace(/\s+/g,' ').trim();
        return result;
    }
}