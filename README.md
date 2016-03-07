# damon

> Bots navigating urls and doing tasks.

![logo](./media/demo.gif)

`damon` is a CLI that runs on [CasperJS](http://casperjs.org/) which runs on [PhantomJS](http://phantomjs.org/).

He feeds on JSON files that describe what tasks he needs to achieve on specified starting URL.

```bash
Usage:
  damon [OPTIONS] [COMMAND]

Commands:
  run <files...>  Run the list of JSON tasks files. Accept glob.

Options:
   -h, --help     output usage information
   -V, --version  output the version number
```

## Installation

### Locally

If you want to use it locally in your project, to automatically test your builds for example.
It can be added manually in your `package.json` as :

```javascript
"devDependencies": {
    "damon": "git://git.autodesk.com/CICD/damon"
}
```

### Globally

Or you can install it globally :

```bash
> git clone git@git.autodesk.com:CICD/damon.git
> cd damon
> npm link
```

Because it's not yet available on `npm`.

## Usage

### Locally

```node
var damon = require('damon');
damon.start('./tasks.json');
```

### Globally

```bash
> damon run tasks.json
or
> damon run tasks1.json tasks2.json
or 
> damon run *.json
```

## Task File

### `config`

Your task file must have a `config` entry with a `size` and a `url`.

```javascript
"config": {
    "size": {
        "width": 1024,
        "height": 768
    },
    "url": "http://www.google.ca",
    "timeout": 1000,
    "logLevel": "fatal"
}
```

- `size` is for the viewport's size.
- `url` is the starting point of `damon`.
- `timeout` overwrite the general timeout used accross the test suite.
- `logLevel` control at which level `damon` will log. Can be `none`, `fatal`, `error`, `warn`, `info`, `debug` or `trace`

### `tasks`

Then you describe your tasks in a `tasks` entry that is an array of all the tasks to achieve sequentially :

```javascript
"tasks": [
    {},
    {}
]
```

It exists several kinds of tasks that `damon` can achieve :

#### `capture`

A simple screen capture :

```javascript
{
    "type": "capture",
    "params": {
        "name": "start.png"
    }
}
```

#### `wait`

`damon` can wait for several different things.
For each one, except `time`, you can overwrite the `timeout`.

- `url`

```javascript
{
    "type": "wait",
    "params": {
        "url": "http://www.yahoo.ca",
        "regexp": false,
        "timeout": 1000
    }
}
```

`damon` will wait at this step until matching url is reached.

`url` will be interpreted as a `regexp` if set to `true`. Default value of `regexp` is `false`.

- `selector`

```javascript
{
    "type": "wait",
    "params": {
        "selector": "#content",
        "timeout": 1000
    }
}
```

`damon` will wait at this step until the `selector` is available on the page.

- `visible`
- `hidden`

Both are the same as `selector` but will wait for these specific states of the element.

- `time`

```javascript
{
    "type": "wait",
    "params": {
        "time": "1000"
    }
}
```

`damon` will wait for the specified amount of milliseconds.

- `resource`

```javascript
{
    "type": "wait",
    "params": {
        "resource": "resourceName",
        "regexp": false,
        "timeout": 1000,
        "method": "DELETE"
    }
}
```

`damon` will wait at this step until something matching the resource is received.

`resource` will be interpreted as a `regexp` if set to `true`. Default value of `regexp` is `false`.

A `method` can be specified to filter the resource. If nothing is specified, any `method` will be accepted.

#### `dom`

`damon` can perform two different actions on a dom element :

- `click`

```javascript
{
    "type": "dom",
    "params": {
        "selector": "button#btnSubmit",
        "do": "click"
    }
}
```

`damon` will click on the specified selector.

- `fill`

```javascript
{
    "type": "dom",
    "params": {
        "selector": "input#userName",
        "do": "fill",
        "text": "yoann.dev"
    }
}
```

`damon` will enter text in the specified field.

#### `get`

##### _store_

`damon` can perform different `get` to retrieve a value and store it for subsequent tasks :

- `attribute`

```javascript
{
    "type": "get",
    "params": {
        "selector": "div#Info",
        "attribute": "title",
        "key": "infoTitle",
        "modifier": "[a-z]+"
    }
}
```

`damon` will get the value of the `attribute`, apply the `modifier` RegExp and store it as `infoTitle`.

`@text` can also be used as an `attribute` to get the text content of the `selector`

- `variable`

```javascript
{
    "type": "get",
    "params": {
        "variable": "var.attr1['attr2']",
        "key": "varAttr2"
    }
}
```

`damon` will access to the specified variable with `window` as the root object and store its value as `varAttr2`

- `resource`

```javascript
{
    "type": "get",
    "params": {
        "resource": "resourceLink",
        "regexp": false,
        "variable": "payload.title",
        "key": "title",
        "method": "POST"
    }
}
```

`damon` will access to the specified variable of the matching `resource` and store it.

A `method` can be specified to filter the resource. If nothing is specified, any `method` will be accepted.

To access to a variable in the payload of a resource, write `payload.variableName` for `variable` field. Resource also contains the `headers`, `method`, `time` and `url`.

- `number of elements`

```javascript
{
    "type": "get",
    "params": {
        "selector": "ul#list li",
        "key": "liNumber"
    }
}
```

`damon` will store the number of elements that satisfy the `selector`

##### _access_

The value can then be accessed in any following tasks via its `key` value

```javascript
{
    "type": "wait",
    "params": {
        "url": "http://www.yahoo.ca/{{key}}"
    }
}
```

To access the stored value, call the `key` in between double brackets `{{key}}`

#### `request`

`damon` can perform an AJAX call from within its workflow.

```javascript
{
    "type": "request",
    "params": {
        "url": "https://www.google.com",
        "method": "GET",
        "payload": {
            "q": "funny cats"
        },
        "headers": {
            "header": "value"
        },
        "store": {
            "key": "key",
            "variable": "variable.attr1"
        }
    }
}
```

You can also `store` the response for later use with `{{key}}`. 

If you don't pass a `variable` it will store the complete response. 

Otherwise, it will try to parse the response as JSON and look for your variable.

#### `assert`

`damon` can perform different `assert` actions to test a value with an expected value:

- attribute

```javascript
{
    "type": "assert",
    "params": {
        "selector": "div#Info",
        "attribute": "title",
        "modifier": "[a-z]+",
        "expected": "expectedValue or {{key}}"
    }
}
```

`damon` will `get` the value of the `attribute` and test it against the `expected` value or the value associated with `{{key}}`

- variable

```javascript
{
    "type": "assert",
    "params": {
        "variable": "var.attr1['attr2']",
        "expected": "expectedValue or {{key}}"
    }
}
```

`damon` will `get` the value of the `variable` and test it against the `expected` value or the value associated with `{{key}}`

- key

```javascript
{
    "type": "assert",
    "params": {
        "key": "title",
        "expected": "Expected Title"
    }
}
```

`damon` will `get` the value of the `key` and test it against the `expected` value.

- status

```javascript
{
    "type": "assert",
    "params": {
        "url": "url",
        "https": false,
        "expected": 200
    }
}
```

`damon` will try to make a `GET` request on the `url` and test the request status against the `expected` status. Same-origin policy applies.

`https` flag can be set to `false` to replace `https` in the `url` by `http`.

## Contribute

We welcome Your interest in Autodesk’s Open Source Damon (the “Project”). 

Any Contributor to the Project must accept and sign an Agreement indicating agreement 
to the license terms below.

##### [Individual Contribution](http://goo.gl/forms/ctQNFrveEF)
##### [Corporate Contribution](http://goo.gl/forms/4DTn9ho2JT)

## License

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
