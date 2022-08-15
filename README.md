## Running this fix

1. Initialize the submodules
`git submodule update --init --recurse effector`

2. Build the submodule
`cd effector && yarn install && yarn build && cd .. && npm install`

3. Run `npm run build`
