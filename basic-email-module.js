const mail = require('@sendgrid/mail');
const htmlToFormattedText = require('html-to-formatted-text');

module.exports = class Mailer{

    constructor(API_KEY){
        if( API_KEY === undefined || API_KEY == ""){
            throw new Error("API KEY can't be empty!");
        }
        if(API_KEY.substring(0,3) != "SG."){
            throw new Error("API KEY must start with SG.");
        }
        this.sendgrid_api_key = API_KEY;
        mail.setApiKey(this.sendgrid_api_key);
        this.mail = mail;
        this.html = "";
    }

    async sendEmail(next){
        let result = {};
        if(this.to == undefined || this.from == undefined){
            result.error = true;
            result.message = "Email must have at least sender and one recipient";
            return result;
        }
        const msg = {
            to: this.to,
            from: this.from,
            subject: this.subject,
            text: htmlToFormattedText(this.html),
            html: this.html
        };
        try{
            await this.mail.send(msg);
            result = msg;
        }catch(error){
            result = error;
        };
        if(next != undefined){
            next(result);
        }else{
            return result;
        }
    }

    setRecipient(to){
        if(this.checkEmail(to)){
            this.to = to;
        }else{
            throw new Error('Wrong recipient');
        }
    }

    getRecipient(){
        return this.to;
    }

    setSender(from){
        if(this.checkEmail(from)){
            this.from = from;
        }else{
            throw new Error('Wrong sender');
        }
    }

    getSender(){
        return this.from;
    }

    setSubject(subject){
        if(subject === undefined){
            throw new Error('The subject of the message cannot be empty');
        }else{
            this.subject = this.removeScripts(subject);
        }
    }

    getSubject(){
        return this.subject;
    }

    setContent(html){
        if(html === undefined){
            throw new Error('The content of the message cannot be undefined');
        }else{
            this.html = this.removeScripts(html);
        }
    }

    getContent(){
        return this.html;
    }

    checkEmail(email){
        let rgx = new RegExp('^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' +
            '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
            '(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$');
        if(email == undefined || !rgx.test(email)){
            return false;
        }else{
            return true;
        }
    }

    removeScripts(txt){
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