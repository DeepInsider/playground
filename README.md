# Deep Insider: A Neural Network Playground

[This playground][playground page] is an interactive visualization of neural networks, written in
TypeScript using d3.js. We use GitHub issues for tracking new requests and bugs.
Your feedback is highly appreciated!

**If you'd like to contribute to original repository [tensorflow/playground (Deep playground)][original page], be sure to review the [contribution guidelines](CONTRIBUTING.md).**

## Development

Use Node.js 24 LTS (24.21.0) and npm 11. The Node version is recorded in `.nvmrc`.
To run the visualization locally, run:

- `npm ci --ignore-scripts` to install the locked dependencies
- `npm run build` to compile the app and place it in the `docs/` directory
- `npm run serve` to serve from `docs/` at `http://127.0.0.1:8080` and open your browser.

For a fast edit-refresh cycle when developing run `npm run serve-watch`.
This will start an http server and automatically re-compile the TypeScript,
HTML and CSS files whenever they change.
The watchers use Node's built-in file watching. See [dependency maintenance](maintenance.md) for update boundaries and validation.

## For owners

GitHub Pages publishes `docs/` from `master`. Build and verify the generated files,
then commit them with the source changes. Deploy by updating `master` and checking
the Pages build and the live site.

This is not an official Google product.

## License

Copyright 2018 Digital Advantage Co., Ltd. All Rights Reserved.  
Licensed under the Apache License, Version 2.0.

### The licenses of using open-source code

This project is forked from [tensorflow/playground (Deep playground)][original page].  
Copyright 2016 Google Inc. All Rights Reserved.  
Licensed under the Apache License, Version 2.0.

[playground page]: https://deepinsider.github.io/playground/
[original page]: https://github.com/tensorflow/playground
