# appshell quickstart

A first micro-frontend on [appshell](https://appshell.org): one page, which you run from your
machine inside a real, hosted application. You edit it, save, and see it change in place, in the
application your users would see, without publishing anything.

The hosted registry is in an invite-only beta. You'll need an invite and Node 24.

**On a network that inspects HTTPS,** as many companies' do, Node won't trust the certificate
authority your network re-signs traffic with until it's told to use your system's certificates.
Run this in the shell you'll use for the steps below, since both the CLI and `npm start` need it:

```sh
export NODE_USE_SYSTEM_CA=1
```

**If the verification email doesn't arrive** when you sign up, check your spam or quarantine, and
allow `noreply@appshell.org`.

## Try it

**1. Clone this, install, and point the CLI at the hosted registry.** Pick a scope, the name
everything you publish lives under, such as your handle or your team's. Use it wherever this says
`<scope>`.

```sh
git clone https://github.com/appshellhq/appshell-quickstart.git
cd appshell-quickstart
npm install
npx appshell config init --registry https://registry.appshell.org \
  --auth-issuer https://auth.appshell.org/realms/appshell \
  --default-scope <scope> --application <scope>/starter
```

**2. Sign in, and claim your scope.** Login opens a browser, where you sign in or accept your
invite.

```sh
npx appshell login
npx appshell scopes create <scope>
```

**3. Copy the starter application, `appshell/starter`, into your scope,** allowing overlays on
the copy, so your machine can serve code into it:

```sh
npx appshell app clone --from appshell/starter --to <scope>/starter --allow-overlays
```

**4. Run the page:**

```sh
npm start
```

The dev server prints a link to confirm. Open it and apply the overlay: your copy opens with
**Hello** in its navigation, served from your machine. Edit `src/Hello.tsx` and save, and the page
updates in place.

## What just happened

- **Your copy, `<scope>/starter`,** is an application in the registry, served at
  `https://apps.appshell.org/a/<scope>/starter`. It's appshell's workspace, a layout with a header
  and navigation, with nothing in it yet.
- **`npm start` opened an overlay on it.** For your browser only, the copy also runs this page,
  loaded from your dev server. The badge in the corner says so. Anyone else who opens the copy
  sees it as it is: the workspace, with nothing in it.
- **The navigation comes from this page's metadata.** `appshell.config.yaml` says where the page
  is mounted, `/hello`, and how it's listed: its label and icon. The workspace reads that, so the
  page itself knows nothing about the layout around it.
- **The page wears the application's theme.** The registry puts the application's design tokens
  on the page as `--appshell-*` CSS custom properties, and `src/hello.css` uses them.

## What's here

| File | What it's for |
| --- | --- |
| `src/Hello.tsx` | The page |
| `src/hello.css` | Its styles, on the application's theme |
| `appshell.config.yaml` | What it contributes to the application: its route, and its entry in the navigation |
| `webpack.config.js` | `appshellRemote()`, what every appshell micro-frontend needs, with Babel, React Fast Refresh and CSS |
| `package.json` | Its name, `hello`, is the micro-frontend's name in your scope: `<scope>/hello` |

webpack is held at 5.106: newer releases don't build with `@module-federation/enhanced` 2.9.

## Change the theme

The page takes its look from your copy's theme. There are two bases, `neutral` and `midnight`, and
five accents, `steel`, `violet`, `emerald`, `ember` and `ice`: `npx appshell theme list` shows
them.

**To try one in your browser only,** with `npm start` running, from another terminal here:

```sh
npx appshell dev start --theme midnight-violet
```

Then reload the page. `--theme neutral-ice` switches back.

**To give your copy a theme for everyone who opens it,** save this as `theme.yaml`:

```yaml
apiVersion: registry.appshell.org/v1
kind: Application
name: <scope>/starter
spec:
  shell:
    theme:
      base: midnight
      accent: violet
      colorScheme: dark
```

and apply it:

```sh
npx appshell app apply -f theme.yaml
```

Your copy keeps its title and what it runs. `npx appshell app revisions` lists its revisions, and
`npx appshell app rollback --to <revision>` goes back to one.

## When you're done

`Ctrl-C` stops the dev server. The overlay stays open until it expires or you close it:

```sh
npx appshell dev status
npx appshell dev stop <id>
```

## Going further

- **Add a page:** expose another component in `webpack.config.js` and give it a route in
  `appshell.config.yaml`.
- **See your copy and its revisions** in [the console](https://console.appshell.org), under
  Applications.
