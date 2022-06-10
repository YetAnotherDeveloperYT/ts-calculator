# Simple Typescript Calculator

Just a simple calculator providing basic operations, made with Typescript and 💖

[![Netlify Status](https://api.netlify.com/api/v1/badges/f37e66e4-a553-4c14-804d-5a336be33699/deploy-status)](https://app.netlify.com/sites/ts-calculator-yad/deploys)

## Live Example

See a Live Working Demo [here](https://ts-calculator-yad.netlify.app/).

## Run Locally

You can run this site locally through cloning the git repo.

```bash
git clone https://github.com/YetAnotherDeveloperYT/ts-calculator.git
```

I used [Vite](https://vitejs.dev/) as the build tool to get HMR & Typescript support in development. Vite is included as devDependency. So install the dependencies.

```bash
npm install  # if you use npm
pnpm install # if you use pnpm (recommended)
yarn install # if you use yarn (recommended over npm)
```

### Running in development mode

If you want to work on this app run it in development mode to get Hot-module-replacement support.

```bash
npm run dev
pnpm dev
yarn dev
```

### Building the app

Build the app into static files through build command.

```bash
npm run build
pnpm build
yarn build
```

then you can see generated files in `dist` directory. Serve the files through `vite` preview feature.

```bash
npm run preview
pnpm preview
yarn preview
```

_Alternatively_, You can build and serve through a single command.

```bash
npm run serve
pnpm serve
yarn serve
```

## Checklist

- [x] Create Basic UI
- [x] Evaluate Results Function
- [x] Checks for using brackets
- [x] Checks for using operators
- [x] Checks for using decimal point
- [ ] Preview Results
- [ ] Calculation History
- [ ] Improve UI
- [ ] Convert to PWA
- [ ] Add New Functions like power, log, trigonometric functions.

## Contributing

Pull requests are welcome. You Can See the [checklist](#checklist) to see the planned features to work on.

## License

[MIT](https://choosealicense.com/licenses/mit/)
