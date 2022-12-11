# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Developing

Once you've installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## TODO

bugs:
- [ ] continously save current state to local storage for host to pick up after a reload
- [ ] fix player colors algorithm, as it tends to give the smae color to everyone when reconnecting
refactorings:
- [ ] clean up old / no longer used messages and QuizSave usages
features:
- [ ] close/finish running quizzes from the overview page
- [ ] show answers and scores on player screen
- [ ] allow different values for scores (at least integers from 0-3)
- [ ] confirm score finish, instead of automatically move to next round
- [ ] define (more) player colors
infra:
- [ ] setup GitHub repo
- [ ] setup Denoland deployment