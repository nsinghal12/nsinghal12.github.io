# blog

This folder contains the NodeJS engine that generates the post
files that are then loaded by the website.

## Engine

The blog engine reads the `blog.config.json` file and uses the `posts`
and `dist` path as configuration. It then recursively reads all posts
from the folder, extracts the front matter and writes to `dist` folder.
The metadata is then written to `blog.json` file that is consumed by
the website engine.

## Usage

```sh
$ node engine.js <path-to-config-file>
```

By default it looks for `blog.config.json` in the same folder. For my
own personal website:

```sh
$ node engine.json
```

## Copyright

Copyright (C) 2023, Niti Singhal.
