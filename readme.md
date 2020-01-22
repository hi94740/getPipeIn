# getPipeIn

This package is here to help you build a CLI tool with node.js, starting with piping data in from other programs. No more hassle with stdin. We've taken care of that.  

## Usage

All you need to do is just one line of code: 

* promise style: 
  
  ```js
  require("getPipeIn")().then(data => {})
  ```

* async/await style:
  
  ```js
  var data = await require("getPipeIn")()
  ```

### Example

The `example.js` looks like this: 

```js
require("getPipeIn")()
  .then(data => {
    if (data) data = data.split("\n")
    console.log({data:data})
  })
```

and here's our shell command: 

```shell
ls / | node example.js
```

the result printed in terminal will be like:

```shell
{
  data: [
    'Applications', 'Library',
    'System',       'Users',
    'Volumes',      'bin',
    'cores',        'dev',
    'etc',          'home',
    'opt',          'private',
    'sbin',         'tmp',
    'usr',          'var',
    ''
  ]
}
```

#### What if...

nothing is piped in? Well, the data returned will simply be `undefined`. 

So if we use the `example.js` above like this: 

```shell
node example.js
```

we will get this result: 

```shell
{ data: undefined }
```

#### But, there's a catch...

Getting data from shell pipe works by subscribing to node's `process.stdin`, waiting for it to spit out data. If anything is piped in, the stdin will be connected to the piped data and everything works just fine. But if nothing is piped in, the package won't get a clue about it and will keep on waiting for data. 

This won't be a problem in most cases, because you're likely to use this package in a terminal application. In this case it's fine to call this package regardless of whether anything is piped at all. The package will detect whether the stdin is connected to a terminal context or not via `process.stdin.isTTY`. If it's true, it means the stdin is connected to the terminal itself, rather than the piped data, indicating that nothing is piped to the stdin. The package will return immediately with data being `undefined` as described above. 

However, in some niche cases, you may run your program in a non terminal context, and you still need to pipe data in somehow, but you're not sure about whether it's piped or not. In this case, detecting `process.stdin.isTTY` won't work because it will always be `false`. The workaround implemented in this package is that when you call this package from your code, the package starts waiting for node to **start reading** data from stdin. If the wait timed out, the package will see it as there's no data piped into the node process and return `undefined`. 

The default timeout is 100ms. It should be fine for most cases. But if you're running it on a much slower or faster system, the timeout maybe too fast for node to read anything or too slow for you to bear. So you may want to adjust the timeout yourself. You can do this by passing the number of milliseconds to the package like this: 

```js
require("getPipeIn")(10)
```

This works perfectly on my system. If you can't stand the delay caused by the default 100ms timeout and you've got some decent hardware for the cause, try out 10ms. 

## Note

Piping node with other programs will cause the node to connect its stdin or stdout to the piped programs, so you can no longer access terminal by them. If you're building a CLI application, this can be a problem. To solve this problem, check out [reopen-tty](https://github.com/indutny/reopen-tty) or [Terminal-Kit](https://github.com/cronvel/terminal-kit/blob/01310c34ad28a8a49409d5e6ad151631d171fc2e/doc/global-api.md#ref.realTerminal). 




