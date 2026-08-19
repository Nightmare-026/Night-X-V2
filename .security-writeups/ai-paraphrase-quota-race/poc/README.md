# Local quota-race demonstration

This proof of concept is a deterministic, offline model of the paraphrase route's
`get -> check -> provider -> increment` ordering. It does not contact Firebase,
OpenRouter, Hugging Face, or any deployed service.

Run from this directory with:

```sh
node race.js
```

The barrier releases ten requests after all have read a stored count of 29. The
model records ten provider invocations even though only one quota slot remained.
