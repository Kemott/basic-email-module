/**
* @module Basic-Email-Module
* @since 1.0.0
* @requires @sendgrid/mail
* @requires @html-to-formatted-text
*/
const mail = require('@sendgrid/mail');
const htmlToFormattedText = require('html-to-formatted-text');

module.exports = class Mailer/** @lends Mailer */{
    /**
     * @constructor
     * @param { string } API_KEY - SendGrid API_KEY
     * @throws Will throw an error if sent API_KEY is empty.
     * @throws Will throw an error if sent API_KEY doesn't start with 'SG.' (Isn't SendGrid API_KEY).
     */
    constructor(API_KEY){
        if( API_KEY === undefined || API_KEY == " "){
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

    /**
     * Method sending email constructed with rest of this class methods
     * @async
     * @param {sendEmailCallback} [next] - callback function - optional
     * @returns {Object} - error object (containing message about error) or mail params (if function end properly)(Everything like params of the "next" callback)
     */
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

    /**
     * Method setting recipient for email. It checks if given value is proper email and if not, throwing error.
     * @see checkEmail
     * @param {string} to - proper email address
     * @throws Will throw an error when given value don't match email regex 
     */
    setRecipient(to){
        if(this.checkEmail(to)){
            this.to = to;
        }else{
            throw new Error('Wrong recipient');
        }
    }

    /**
     * Getter method for recipient
     * @returns {(string|undefined)} - returns setted email address or undefined if it isn't set properly 
     */
    getRecipient(){
        return this.to;
    }

    /**
     * Method setting sender for email. It checks if given value is proper email and if not, throwing error.
     * @see checkEmail
     * @param {string} from - proper email address
     * @throws Will throw an error when given value don't match email regex
     */
    setSender(from){
        if(this.checkEmail(from)){
            this.from = from;
        }else{
            throw new Error('Wrong sender');
        }
    }

    /**
     * Getter method for sender
     * @returns {(string|undefined)} - returns setted email address or undefined if it isn't set properly
     */
    getSender(){
        return this.from;
    }

    /**
     * Method setting subject for email. Before setting it removes all scripts from subject.
     * @see removeScripts
     * @param {string} subject - string to set for subject
     * @throws Will throw an error if given variable is undefined
     */
    setSubject(subject){
        if(subject === undefined){
            throw new Error('The subject of the message cannot be empty');
        }else{
            this.subject = this.removeScripts(subject);
        }
    }

    /**
     * Getter method for subject
     * @returns {(string|undefined)} - returns setted message subject or undefined if it isn't set properly
     */
    getSubject(){
        return this.subject;
    }

    /**
     * Method setting html content of email. Before setting it removes all script from variable.
     * @param {string} html - html formatted text
     * @see removeScripts
     * @throws Will throw an error if variable is undefined
     */
    setContent(html){
        if(html === undefined){
            throw new Error('The content of the message cannot be undefined');
        }else{
            this.html = this.removeScripts(html);
        }
    }

    /**
     * Getter method for html content
     * @returns {(string|undefined)} - returns setted message html or undefined if it isn't set properly
     */
    getContent(){
        return this.html;
    }

    /**
     * Checking if given string is an email
     * @param {string} email
     * @returns {boolean} true if it proper email, false if it not match regex or is undefined
     */
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

    /**
     * Removing all scripts from given text
     * @param {string} txt - text to remove scripts
     * @returns {string} - text stripped from scripts
     */
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

    /**
    * Callback possible elements for sendEmail
    * @callback sendEmailCallback
    * @param {Object} result - result which senEmail returns
    * If function goes wrong
    * @param {boolean} [result.error] - if function failed this is set to true
    * @param {string} [result.message] - if function failed this contains the message about error
    * If function ends properly
    * @param {string} [result.to] - if function end properly this contains email recipient
    * @param {string} [result.from] - if function end properly this contains email sender
    * @param {string} [result.subject] - if function end properly this contains email subject
    * @param {string} [result.text] - if function end properly this contains email text (non-html)
    * @param {string} [result.html] - if function end properly this contains email text (with html tags)
    */
}