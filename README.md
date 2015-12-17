# agent

> Bots navigating urls and doing tasks.

`agent` is a CLI that runs on [CasperJS](http://casperjs.org/) which runs on [PhantomJS](http://phantomjs.org/).

It feeds on JSON files that describe what tasks it needs to achieve on specified starting URL.

```bash
Usage:
  agent [OPTIONS] [ARGS]

Options:
  -f, --file STRING      The JSON file were tasks are.

  -k, --no-color         Omit color from output
      --debug            Show debug information
  -v, --version          Display the current version
  -h, --help             Display help and usage details
```

## Installation

### Locally

If you want to use it locally in your project, to automatically test your builds for example.
It can be added manually in your `package.json` as :

```javascript
"devDependencies": {
    "agents": "git://git.autodesk.com/moinety/agents"
}
```

### Globally

Or you can install it globally :

```bash
> git clone git@git.autodesk.com:moinety/agents.git
> cd agents
> npm link
```

Because it's not yet available on `npm`.

## Usage

### Locally

```node
var agent = require('agent');
agent.start('./tasks.json');
```

### Globally

```bash
> agent -f ./tasks.json
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
    "url": "http://www.google.ca"
}
```

- `size` is for the viewport's size.
- `url` is the starting point of your agent.

### `tasks`

Then you describe your tasks in a `tasks` entry that is an array of all the tasks to achieve sequentially :

```javascript
"tasks": [
    {},
    {}
]
```

It exists three kinds of tasks that an `agent` can achieve :

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

An `agent` can wait for 5 different things.

- `url`

```javascript
{
    "type": "wait",
    "params": {
        "url": "http://www.yahoo.ca"
    }
}
```

The agent will wait at this step until this url is reached.

- `selector`

```javascript
{
    "type": "wait",
    "params": {
        "selector": "#content"
    }
}
```

The agent will wait at this step until the `selector` is available on the page.

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

The agent will wait for the specified amount of milliseconds.

#### `dom`

An `agent` can perform two different actions on a dom element :

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

The `agent` will click on the specified selector.

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

The `agent` will enter text in the specified field.
