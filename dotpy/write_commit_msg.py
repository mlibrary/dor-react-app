#!/usr/bin/env python3
"""Write the debounce/abort fix commit message. Usage: python3 dotpy/write_commit_msg.py"""

msg = """\
fix: debounce and cancel stale parse requests in handleSearchChange

onValueChange fires on every keystroke, previously sending one POST /parse
per character typed. Two problems:

1. Request burst: a fast typist generates many simultaneous requests.
2. Stale response: a slow earlier response (e.g. for "h") could resolve
   after a faster later response (for "hamlet") and overwrite
   parsedQueryDslRef with stale DSL.

Fix:
- Debounce the parse call 300 ms after the last keystroke so fast typing
  produces at most one request per pause.
- Hold an AbortController ref; on each keystroke, abort any in-flight
  request before scheduling the next debounced call so a superseded
  request can never overwrite the DSL refs.
- Clear parsedQueryDslRef immediately on each keystroke so ReactiveSearch
  uses the fallback manual DSL during the debounce window rather than
  serving a stale DSL from a previous query.

searchParserService.js:
- parseSearchQuery now accepts an optional { signal } option and passes it
  to fetch; AbortError is re-thrown (not swallowed as a fallback result)
  so callers can distinguish cancellation from a genuine service failure.

searchParserService.test.js:
- 3 new tests: signal is forwarded to fetch; AbortError is re-thrown;
  console.error is not called for AbortError.
  Total: 29 tests (was 26).
"""

with open("dotpy/commit_msg.txt", "w") as f:
    f.write(msg)
print("commit_msg.txt written.")

