# container-exposure-lab

Disposable lab for exposing one minimal containerized HTTP app through temporary public
paths without deploying the main `projectpezzos.com` site.

## Question

Can a small local container be exposed briefly and safely enough for a Project Pezzos
review workflow, and what does each path prove in a short run?

This lab compares:

- Cloudflare Quick Tunnel with a temporary `trycloudflare.com` URL.
- Tailscale Funnel with a temporary public `ts.net` URL.
- Cloudflare Named Tunnel with DNS on a controlled Project Pezzos hostname.

## Current Result

Status: `tested-partial-closed`.

The lab proves that this specific disposable HTTP app can be reached through all three
tested paths from the lab machine using `curl` against public HTTPS URLs. It also proves
that the tunnels and local container can be closed cleanly after the run.

The result is still partial as public evidence: no phone, colleague device, or separate
network validation was performed, and no auth, reconnect, laptop sleep, or long-duration
behavior was tested.

All public tunnel, Funnel, DNS, and local container resources from the recorded run are
now closed or removed.

## What Was Tested

| Path | URL type | Validation level | Result |
| --- | --- | --- | --- |
| Local Docker app | `127.0.0.1:18082` | local `curl`, Docker healthcheck, container inspection | passed |
| Cloudflare Quick Tunnel | temporary `trycloudflare.com` HTTPS URL | local `curl` through the public URL | passed, then closed |
| Tailscale Funnel | temporary public `ts.net` HTTPS URL | local `curl` through the public URL | passed, then closed |
| Cloudflare Named Tunnel, deep hostname | `container-exposure-lab.labs.projectpezzos.com` | local `curl` through public HTTP and HTTPS URLs | HTTP passed; HTTPS failed at TLS handshake |
| Cloudflare Named Tunnel, first-level hostname | `container-exposure-lab.projectpezzos.com` | local `curl` through public HTTP and HTTPS URLs | HTTPS passed, then tunnel closed |

The app only exposes `/` and `/healthz`. The container uses no bind mount or host
volume, binds the host port on `127.0.0.1`, runs as a non-root user, uses a read-only
root filesystem, drops Linux capabilities, and has `no-new-privileges`.

## What Was Not Tested

- Access from a phone.
- Access from another network.
- Access by a colleague or another account.
- Cloudflare Access or another auth layer.
- Behavior after laptop sleep, network change, or a long-running session.
- A durable recommendation between Cloudflare Tunnel, Tailscale Funnel, Traefik, or AWS.
- HTTPS on `container-exposure-lab.labs.projectpezzos.com`; that deeper hostname failed
  with the current Cloudflare edge certificate coverage.

## What You Can Conclude

- A Quick Tunnel can expose this minimal container over HTTPS for a short disposable
  review and can be closed afterward.
- Tailscale Funnel can expose the same container over HTTPS when Tailscale is already
  running and authenticated, and can be closed afterward.
- Cloudflare Named Tunnel with DNS worked over HTTPS on
  `container-exposure-lab.projectpezzos.com`, a first-level hostname.
- The deeper hostname `container-exposure-lab.labs.projectpezzos.com` is not a safe
  default for HTTPS unless certificate coverage is handled first.
- `cloudflared tunnel delete -f` removed the tunnel resource in this run but did not
  remove the proxied DNS route automatically. The DNS record was removed later by
  operator cleanup.

## What You Must Not Conclude

- Do not treat public reachability as fully proven from arbitrary networks. The public
  URLs were tested from the lab machine with `curl`.
- Do not treat this as evidence for production hosting.
- Do not assume these paths are secure for private data or write-capable services.
- Do not assume Tailscale Funnel behavior after sleep, reconnect, or long sessions.
- Do not assume Cloudflare Named Tunnel DNS cleanup is automatic.

## Full Trace

The full audit trail is in [`RESULTATS.md`](./RESULTATS.md). It includes the test matrix,
Claude gate records, commands, timestamps, URLs, validation output, failures, teardown,
open questions, and article-impact caveats.

Manual cleanup instructions are in [`OPERATEUR.md`](./OPERATEUR.md).

## Reproduce Locally

These commands only run the local container. They do not open a public tunnel or create
DNS records.

```sh
docker build .
docker compose up -d --build
./scripts/check-local.sh
docker compose down
```

## Final Public Resource State

- Quick Tunnel: closed.
- Tailscale Funnel: closed.
- Cloudflare named tunnel: deleted.
- Local tunnel credential files created by the lab: removed.
- Docker container: stopped and removed.
- DNS: `container-exposure-lab.projectpezzos.com` no longer resolves after operator
  cleanup.

The GitHub repo rollback command, if Alexandre explicitly approves deletion later:

```sh
gh repo delete pezzos/container-exposure-lab --yes
```
