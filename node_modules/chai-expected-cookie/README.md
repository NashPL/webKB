# chai-expected-cookie
Chai plugin for testing HTTP response set-cookie header and it's also support supertest.

## Installation
```bash
npm install chai-expected-cookie
```

## Usage
### Quick example
```js
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-http'));
chai.use(require('chai-expected-cookie'));

response = ...

expect(response).to.containCookie({
    name: 'key_1',
});

expect(response).to.not.containCookie({
    name: 'key_2',
});

expect(response).to.containCookie({
    name: 'key_3',
    value: 'vk_3'
});

expect(response).to.containCookie({
    name: 'key_4',
    attrs: {
        path: '/path'
    }
});

expect(response).to.containCookie({
    name: 'key_5',
    hasAttrs: [
        'httponly'
    ]
});

expected(response).to.containCookie({
    name: 'key_6',
    value: 'vk_6',
    attrs: {
        path: '/path'
    },
    hasAttrs: [
        'httponly'
    ]
});
```

### Complete example
```js
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-http'));
chai.use(require('chai-expected-cookie'));

const express = require('express');
const app = express();

chai.request(app)
    .get('/items')
    .end(function(err, response) {         
        expect(response).to.containCookie({
            name: 'key_1',
        });

        expect(response).to.not.containCookie({
            name: 'key_2',
        });

        expect(response).to.containCookie({
            name: 'key_3',
            value: 'vk_3'
        });

        expect(response).to.containCookie({
            name: 'key_4',
            attrs: {
                path: '/path'
            }
        });

        expect(response).to.containCookie({
            name: 'key_5',
            hasAttrs: [
                'httponly'
            ]
        });

        expected(response).to.containCookie({
            name: 'key_6',
            value: 'vk_6',
            attrs: {
                path: '/path'
            },
            hasAttrs: [
                'httponly'
            ]
        });
    });
```
## API
### containCookie(expectedCookie)
assert cookies with defined criteria is set.

*Arguments*

- `expectedCookie` - object represent expected cookie criteria
    - `name` - cookie name
    - `value` - *Optional* cookie value 
    - `attrs` - *Optional* object cookie of attributes
    - `hasAttrs` - *Optional* array of cookie attribute names

## License

MIT