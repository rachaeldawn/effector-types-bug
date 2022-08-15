## Reproducing missing types

1. Run `npm run build:broken` to see the output the breakage
2. Run `npm run build:working` to see the output of the working version

The two `tsconfig*.json` files are the exact same, except that 1 uses `"module": "node"` (the working one) and 1 uses `"module": "NodeNext"` (broken one)

## Fix

Add a `"types": "{file-name}.mjs.d.ts"` for each export

See [this link](https://github.com/rachaeldawn/effector/commit/b0f08fff31e51a236665fdfb3fe3e695d9e80689#diff-49d9d478048fb6158d6698efb82dcac5e5ed1db3d5197f7c75b405716229a944) under `tools/builder/packages.config.ts`.
