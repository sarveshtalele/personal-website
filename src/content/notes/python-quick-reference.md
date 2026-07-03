---
title: Python quick reference
description: Idioms and standard-library tricks worth remembering.
pubDate: 2025-04-18
tags: [Python]
---

## Comprehensions

```python
squares = [x**2 for x in range(10) if x % 2 == 0]
lookup = {k: v for k, v in pairs}
```

## Useful stdlib

```python
from collections import defaultdict, Counter
from functools import lru_cache, partial
from itertools import groupby, chain

@lru_cache(maxsize=None)
def fib(n): ...
```

## Context managers

```python
from contextlib import contextmanager

@contextmanager
def timer():
    start = time.perf_counter()
    yield
    print(time.perf_counter() - start)
```

## Type hints that pull their weight

```python
from typing import TypedDict

class Config(TypedDict):
    host: str
    port: int
```
