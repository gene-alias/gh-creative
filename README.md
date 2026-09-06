# GH Creative

Mobile-first creative studio website with scroll-driven reveals, pinned sections,
interactive service rows and a shared design system.

## Local development

```sh
npm ci
npm run dev -- --port 3005
```

The default development and build commands retain the existing Vinext/Cloudflare
setup. Pause motion and the operating system's reduced-motion setting restore
the static layout.

## Vercel previews

```sh
npm run build:vercel
vercel deploy --target preview --scope genes-projects-31163c3c
```

The Vercel build exports the current routes to static HTML and RSC files in
`dist/client`, alongside scripts, fonts and artwork. `vercel.json` configures
the build and clean page URLs. The export flag applies only to that build;
the local development server continues using its original configuration.

The contact form currently downloads a brief locally. It does not send enquiries.
If server-side enquiry delivery is added later, update the hosting setup to
provide a server endpoint.

The Git history is local until a remote repository is connected. Vercel CLI
deployments do not require a Git remote. Credentials and generated files are
excluded from both Git and deployment uploads.
