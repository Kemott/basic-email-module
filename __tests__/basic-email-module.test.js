const mailer = require('../basic-email-module');

describe('Constructor works properly',() => {
    test("Constructor don't throw errors", () => {
        expect(() => { new mailer("SG.X0Aj912NRjyQlwFZ4rqbPg.9MVECAXmrjZYsu7SXYf3cZU_ro512345678dvWnniX8") }).not.toThrow();
    });
    test('Constructor set variable properly', () => {
        expect(new mailer("SG.X0Aj912NRjyQlwFZ4rqbPg.9MVECAXmrjZYsu7SXYf3cZU_ro512345678dvWnniX8").sendgrid_api_key).toBe("SG.X0Aj912NRjyQlwFZ4rqbPg.9MVECAXmrjZYsu7SXYf3cZU_ro512345678dvWnniX8");      
    });
    test('Constructor throw Error when variable undefined',() => {
        expect(() => { new mailer(); }).toThrow();
    });
    test('Constructor throw Error when variable empty',() => {
        expect(() => { new mailer(""); }).toThrow();
    });
    test("Constructor throw Error when API key don't start with SG.",()=>{
        expect(() => { new mailer("TB.X0Aj912NRjyQlwFZ4rqbPg.9MVECAXmrjZYsu7SXYf3cZU_ro512345678dvWnniX8"); }).toThrow();
    });
});

let mail;
beforeEach(() => {
    mail = new mailer("SG.X0Aj912NRjyQlwFZ4rqbPg.9MVECAXmrjZYsu7SXYf3cZU_ro512345678dvWnniX8");
});

describe('checkEmail works properly', () => {
    test('checkEmail should return false for non-email text', () => {
        expect(mail.checkEmail("test.123")).toBe(false);
        expect(mail.checkEmail("test.123@k")).toBe(false);
        expect(mail.checkEmail("@")).toBe(false);
    });

    test('checkEmail should return true for email', () => {
        expect(mail.checkEmail("tomasz.burzynski.91@gmail.com")).toBe(true);
        expect(mail.checkEmail("tomasz.burzynski.91@o2.pl")).toBe(true);
        expect(mail.checkEmail("kontakt.futuristic@gmail.com")).toBe(true);
    });
});

describe('removeScripts works properly', () => {
    test('Simple script is removed', () => {
        let text = 'Script <script>console.log("It works!")</script> removing test';
        let endText = 'Script removing test';
        expect(mail.removeScripts(text)).toBe(endText);
    });
    test('Script with attribute is removed', () => {
        let text = 'Script <script src="http://futuristic.com.pl"></script> removing test';
        let endText = 'Script removing test';
        expect(mail.removeScripts(text)).toBe(endText);
    });
    test('Mulitline script is removed', () => {
        let text = 'Script <script>console.log("It works!"); \n' +
        'Nowa linia</script> removing test';
        let endText = 'Script removing test';
        expect(mail.removeScripts(text)).toBe(endText);
    });
    test('Multiple scripts are removed', () => {
        let text = 'Script <script>console.log("It works!"); \n' +
        'Nowa linia</script> removing <script src="test.js"></script>test';
        let endText = 'Script removing test';
        expect(mail.removeScripts(text)).toBe(endText);
    });
});

describe('setRecipient working properly', () => {
    test("If variable isn't email it should throw Error", () => {
        expect(() => mail.setRecipient("test")).toThrow();
    });
    test("If variable is proper email it should set 'to' properly", () => {
        mail.setRecipient("tomasz.burzynski.91@gmail.com");
        expect(mail.to).toBe("tomasz.burzynski.91@gmail.com");
        mail.setRecipient("kontakt.futuristic@gmail.com");
        expect(mail.to).toBe("kontakt.futuristic@gmail.com");
        mail.setRecipient("tomasz.burzynski.91@o2.pl");
        expect(mail.to).toBe("tomasz.burzynski.91@o2.pl");
    });
});

describe('setSender working properly', () => {
    test("If variable isn't email it should throw Error", () => {
        expect(() => mail.setSender("test")).toThrow();
    });
    test("If variable is proper email it should set 'from' properly", () => {
        mail.setSender("tomasz.burzynski.91@gmail.com");
        expect(mail.from).toBe("tomasz.burzynski.91@gmail.com");
        mail.setSender("kontakt.futuristic@gmail.com");
        expect(mail.from).toBe("kontakt.futuristic@gmail.com");
        mail.setSender("tomasz.burzynski.91@o2.pl");
        expect(mail.from).toBe("tomasz.burzynski.91@o2.pl");
    });
});

describe('setSubject working properly', () => {
    test("If variable isn't set should throw Error", () => {
        expect(() => mail.setSubject()).toThrow();
    });
    test("If variable is '' should set it", () => {
        mail.setSubject("");
        expect(mail.getSubject()).toBe("");
    });
    test("If variable is normal text should set it", () => {
        mail.setSubject("Password recovery");
        expect(mail.getSubject()).toBe("Password recovery");
    });
    test("Should remove any scripts from subject", () => {
        let text = 'Script <script>console.log("It works!"); \n' +
        'Nowa linia</script> removing <script src="test.js"></script>test';
        let endText = 'Script removing test';
        mail.setSubject(text);
        expect(mail.getSubject()).toBe(endText);
    });
});

describe('setContent working properly', () => {
    test("If variable isn't set should throw Error", () => {
        expect(() => mail.setContent()).toThrow();
    });
    test("If variable is '' should set it", () => {
        mail.setContent("");
        expect(mail.getContent()).toBe("");
    });
    test("If variable is normal text should set it", () => {
        mail.setContent("Password recovery");
        expect(mail.getContent()).toBe("Password recovery");
    });
    test("If variable is html should set it", () => {
        mail.setContent("<h1>Password recovery</h1>");
        expect(mail.getContent()).toBe("<h1>Password recovery</h1>");
    });
    test("Should remove any scripts from content", () => {
        let text = 'Script <script>console.log("It works!"); \n' +
        'Nowa linia</script> removing <script src="test.js"></script>test';
        let endText = 'Script removing test';
        mail.setContent(text);
        expect(mail.getContent()).toBe(endText);
    });
});
