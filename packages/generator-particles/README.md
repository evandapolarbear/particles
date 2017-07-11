# generator-particle
> Generate particle modules


This generator is meant to be run as an `npm script` from the root directory of `procore/particle`.


## Usage

From the root directory:
```bash
yarn particle
# projectName: your-particle-name (lower-case-dash-delimited)
# description: brief description of your particle
```

Then bootstrap and start your new particle:

```bash
# Link dependent packages with Lerna
yarn bootstrap
# Navigate to your particle
cd packages/your-particle-name
# Start the sandbox
yarn start
```
