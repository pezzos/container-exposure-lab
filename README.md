# container-exposure-lab

Disposable lab for testing temporary exposure of a minimal containerized HTTP app.

## Scope

- Public lab repo: `pezzos/container-exposure-lab`
- Local app port: `127.0.0.1:18082`
- Container port: `8080`
- Cloudflare first path: Quick Tunnel with a temporary `trycloudflare.com` URL
- Custom hostname tested successfully over HTTPS:
  `container-exposure-lab.projectpezzos.com`

This repo must not contain credentials, personal data, host bind mounts, projectpezzos.com
production deploy logic, or access to the parent repository.

## Local Run

```sh
docker build .
docker compose up -d --build
./scripts/check-local.sh
docker compose down
```

## Safety Defaults

- No bind mounts or host volumes.
- The compose port is bound to `127.0.0.1` only.
- The container runs as the non-root `node` user.
- The container is read-only and drops Linux capabilities.
- The app does not read request bodies, environment dumps, local paths, or files.

## Public Exposure

Only expose after local checks pass and a Claude gate approves the exact command.

Quick Tunnel command under review for this lab:

```sh
cloudflared tunnel --no-autoupdate --loglevel info --url http://127.0.0.1:18082
```

Stop the tunnel with `Ctrl-C` or by terminating the recorded `cloudflared` process.

## Teardown

```sh
docker compose down
```

If the Named Tunnel/DNS branch leaves a DNS record behind, see
[`OPERATEUR.md`](./OPERATEUR.md) before rerunning the lab.

The GitHub repo rollback command, if Alexandre explicitly approves deletion later:

```sh
gh repo delete pezzos/container-exposure-lab --yes
```
