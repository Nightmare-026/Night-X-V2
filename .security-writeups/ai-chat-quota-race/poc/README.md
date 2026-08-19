# Offline quota-race proof of concept

This probe models the exact ordering in `POST /api/ai/chat`: each request reads
the count, all requests pass `count < 30`, each reaches the provider, and only
then does accounting increment. It is deliberately offline and cannot create
provider traffic or Firebase writes.

Run from this directory with Node.js 18+:

```sh
node quota-race.js
```

Representative output:

```text
[+] admitted requests: 8
[+] provider calls before limit enforcement: 8
[+] final simulated count: 37
[!] quota overrun reproduced: every request observed count=29
```
