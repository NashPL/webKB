/**
 * used in .reduce method to convert cookie attributes string to single cookie object
 * @example ['key=value', 'key_1=value'].reduce(constructCookieObjectCallback, {}) will result in {key: value, key_1: value} 
 * 
 * @param {any} cookieAttrs accumlator
 * @param {any} cookieAttrString
 * @returns 
 */
function constructCookieObjectCallback(cookieAttrs, cookieAttrString) {
    let cookieAttrsArray = cookieAttrString.split('=');

    if (cookieAttrsArray[1]) {
        cookieAttrs[cookieAttrsArray[0]] = cookieAttrsArray[1];
    } else {
        cookieAttrs[cookieAttrsArray[0]] = true;
    }

    return cookieAttrs;
}

/**
 * convert cookies from array of strings to be array of object
 * 
 * @param {any} cookiesArray 
 * @returns 
 */
function convertCookiesArrayToObject(cookiesArray) {
    let cookies = cookiesArray
        .reduce((cookies, cookieString) => {
            let cookieAttrs = cookieString
                .replace(/\s/g, '')
                .split(';')
                .reduce(constructCookieObjectCallback, {});

            cookies.push(cookieAttrs);

            return cookies;
        }, []);

    return cookies;
}

/**
 * chai expected cookie
 * 
 * @param {any} chai 
 * @param {any} utils 
 */
function chaiExpectedCookie(chai, utils) {
    let Assertion = chai.Assertion;

    /**
     * check if cookie with provided criteria exists or not
     * 
     * @param {object} expected { name: , value: , attrs: { path: }, hasAttrs: [ httponly ] }
     */
    function containCookie(expected) {
        // prepare expected value to be evaluated
        expected = Object.assign({ name: null, value: null, attrs: {}, hasAttrs: [] }, expected);

        // subject
        let res = utils.flag(this, 'object');

        new Assertion(res).to.have.property('header');

        new Assertion(res.header['set-cookie']).to.exist.and.not.be.null;

        let cookies = convertCookiesArrayToObject(res.header['set-cookie']);

        new Assertion(expected.name).to.exist.and.not.be.null;

        let cookie;
        cookie = cookies.find(cookie => {
            let criteria = cookie[expected.name] &&
                Object.keys(expected.attrs).reduce((hasAttrsWithValues, attr) => hasAttrsWithValues && cookie[attr] && cookie[attr] == expected.attrs[attr], true) &&
                expected.hasAttrs.reduce((hasAttrs, attrKey) => hasAttrs && cookie[attrKey], true);
            if (expected.value) {
                criteria = criteria && cookie[expected.name] == expected.value;
            }
            return criteria;
        });

        this.assert(
            cookie,
            `expected: ${expected.name} cookie with criteria ${JSON.stringify(expected)} to be set`,
            `expected: ${expected.name} cookie with criteria ${JSON.stringify(expected)} to not be set`
        );

    }
    
    Assertion.addMethod('containCookie', containCookie);
}

module.exports = chaiExpectedCookie;
