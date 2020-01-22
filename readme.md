# get-pipe-in

This package is here to help you build a CLI tool with node.js, starting with piping data in from other programs. No more hassle with stdin. We've taken care of that.  

## Install

```shell
npm i --save get-pipe-in
```

## Usage

All you need to do is just one line of code: 

* promise style: 
  
  ```js
  require("get-pipe-in")().then(data => {})
  ```

* async/await style:
  
  ```js
  var data = await require("get-pipe-in")()
  ```

### Example

The `example.js` looks like this: 

```js
require("get-pipe-in")()
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

Getting data from shell pipe works by subscribing to node's `process.stdin`, waiting for it to spit out data. If anything is piped in, the stdin will be connected to the piped data and everything works just fine. But if nothing is piped in, the function that has subscribed to the stdin won't get a clue about it and will keep on waiting for data. 

This won't be a problem in most cases when using this package. Because the package detects whether the stdin is piped from another program or not in multiple ways. If the result is negative, the package returns `undefined` immediately as described above. 

However, there's no guarantee that these detection methods will report accurately under any circumstances. So, as a fallback, a timeout mechanism is implemented in the package to prevent it from stupidly waiting forever for node to read the data that does not exist. Since if there's any data piped into node, it won't take long for node to start reading those data, once we've asked for it. 

When you call this package from your code, the package starts waiting for node to **start** reading piped data. (**NOTE**: This is **NOT** timeout for the whole reading process. If you need a timeout for that, please implement it yourself. ) If the wait timed out, the package will see it as there's no data piped into the node process and return `undefined`. 

The default timeout is 100ms. It should be fine for most cases. But if you're running it on a much slower or faster system, the timeout maybe too fast for node to read anything or too slow for you to bear. So you may want to adjust the timeout yourself. You can do this by passing the number of milliseconds to the package like this: 

```js
require("get-pipe-in")(10)
```

This works perfectly on my system. If you can't stand the delay caused by the default 100ms timeout and you've got some decent hardware for the cause, try out 10ms. 

## Tips for Building CLI Applications

Piping node with other programs will cause the node to connect its stdin or stdout to the piped programs, so you can no longer access terminal by them. If you're building a CLI application, this can be a problem. To solve this problem, check out [reopen-tty](https://github.com/indutny/reopen-tty) or [Terminal-Kit](https://github.com/cronvel/terminal-kit/blob/01310c34ad28a8a49409d5e6ad151631d171fc2e/doc/global-api.md#ref.realTerminal). 

## Thanks

It wouldn't be possible for me to build this package without the help from kind people in these threads: 

[How to pipe Node.js scripts together using the Unix | pipe (on the command line)?](https://stackoverflow.com/questions/16349706/how-to-pipe-node-js-scripts-together-using-the-unix-pipe-on-the-command-line)

[How to detect if a Node.js script is running through a shell pipe?](https://stackoverflow.com/questions/15466383/how-to-detect-if-a-node-js-script-is-running-through-a-shell-pipe)

[Determine if process is “connected” to another process via pipes](https://unix.stackexchange.com/questions/382849/determine-if-process-is-connected-to-another-process-via-pipes)


