# RESULTATS

## Lab Metadata

- lab: `container-exposure-lab`
- repo: `https://github.com/pezzos/container-exposure-lab`
- owner: `pezzos`
- local_path: `/Users/alexandrepezzotta/repos/PezzosLabs/container-exposure-lab`
- started_at_utc: `2026-05-20T04:46:50Z`
- production_deploy: `not-performed`
- public_resources_open: `none-yet`

## Preflight

- main_repo: `/Users/alexandrepezzotta/repos/PezzosLabs/projectpezzoscom`
- main_repo_state: dirty and ahead of `origin/main`; unrelated changes preserved.
- github_authenticated_user: `pezzos`
- github_owner_required: `pezzos`
- github_repo_preexisting: `not-found-before-create`
- github_repo_created: `https://github.com/pezzos/container-exposure-lab`
- docker_daemon: available, server `29.2.1`, OS `Ubuntu 24.04.4 LTS`
- cloudflared: available, version `2026.5.0`
- tailscale_cli: available, version `1.98.2`
- tailscale_daemon: `not-running`
- cloudflare_named_tunnel_auth: `blocked-preflight`; `cloudflared tunnel list` reported no origin certificate.
- wrangler: `not-required-for-this-lab`; Cloudflare Tunnel uses `cloudflared`.

## Claude Gate: Safety Plan

- review_status: `approved`
- reviewer: `claude-plan-review`
- review_timestamp: `2026-05-20T04:46:50Z`
- reviewed_plan_summary: Minimal Node app, no dependency app code, Docker container on internal port `8080`, host port `127.0.0.1:18080`, no host volumes, read-only/non-root container, local validation before public exposure, Quick Tunnel before any named tunnel or DNS, no Tailscale daemon or tailnet changes without operator input.
- blocking_findings: none
- major_findings:
  - Add GitHub rollback command: `gh repo delete pezzos/container-exposure-lab --yes`.
  - Verify `gh api user --jq .login` returns exactly `pezzos` before repo creation.
- decisions:
  - Added the rollback command to this file and README.
  - Re-ran `gh api user --jq .login`; it returned `pezzos`.
  - `RESULTATS.md` is created before any public URL is opened.
  - Credential marker patterns are listed explicitly in `scripts/credential-scan.sh`.

## Claude Gate: GitHub Repo Creation

- review_status: `approved`
- reviewer: `claude-plan-review`
- review_timestamp: `2026-05-20T04:46:50Z`
- reviewed_plan_summary: Create only `pezzos/container-exposure-lab` as a public repo with `gh repo create pezzos/container-exposure-lab --public --clone --description "Disposable lab for comparing temporary container exposure paths"` from `/Users/alexandrepezzotta/repos/PezzosLabs`, then add lab-only files and scan before commit.
- blocking_findings: none
- major_findings: none
- minor_findings:
  - Add `.gitignore` with `node_modules/`.
  - Add credential marker patterns for PEM headers and AWS access key IDs.
  - Treat the public rollback command as intentional lab documentation.
- decisions:
  - Added `.gitignore`.
  - Added the extra credential marker patterns.
  - Documented the rollback command intentionally.

## Claude Gate: Host Port Change

- review_status: `approved_with_required_changes`
- reviewer: `claude-plan-review`
- review_timestamp: `2026-05-20T04:46:50Z`
- reviewed_plan_summary: Change the lab host port from `127.0.0.1:18080` to `127.0.0.1:18082` because `18080` is occupied by an unrelated existing resource. Keep container port `8080` and all Docker hardening unchanged. Re-run local validation before any Quick Tunnel gate.
- blocking_findings:
  - `scripts/check-local.sh` must also change its default URL to `http://127.0.0.1:18082` to avoid false positive checks against the unrelated service on `18080`.
- major_findings: none
- decisions:
  - Updated README, compose.yaml, `scripts/check-local.sh`, and this results file to use `127.0.0.1:18082`.
  - Recorded the port conflict and cleanup below.

## Local Port Conflict

- attempted_port: `127.0.0.1:18080`
- failure: `docker compose up -d --build` failed because port `18080` was already allocated.
- occupying_container_observed: `cryptoclaw-trade-gateway-1` with `127.0.0.1:18080->8080/tcp`
- lsof_observation: local `ssh` process listening on `127.0.0.1:18080`
- action_taken: unrelated resource left untouched.
- lab_cleanup_after_failed_start: `docker compose down` removed the created `container-exposure-lab-app` container and lab network.
- ports_surveyed_after_conflict: `18082`, `18083`, `18084`
- selected_port: `127.0.0.1:18082`
- selection_reason: first surveyed free loopback port.

## GitHub Resource

- created_resource: `pezzos/container-exposure-lab`
- visibility: `public`
- created_with: `gh repo create pezzos/container-exposure-lab --public --clone --description "Disposable lab for comparing temporary container exposure paths"`
- rollback_if_deletion_is_approved: `gh repo delete pezzos/container-exposure-lab --yes`

## Local Validation

- docker_build: `passed`
- docker_compose_up: `passed` on `127.0.0.1:18082`
- local_healthz: `passed`; `curl -sf http://127.0.0.1:18082/healthz` returned HTTP 200 with `{"ok":true,"service":"container-exposure-lab"}`
- local_page: `passed`; `curl -fsS http://127.0.0.1:18082/` returned the neutral lab HTML page.
- docker_ps_expected_container: `passed`; `container-exposure-lab-app` was `healthy` with `127.0.0.1:18082->8080/tcp`.
- docker_hardening_observed: `ReadonlyRootfs=true`, `CapDrop=["ALL"]`, `SecurityOpt=["no-new-privileges:true"]`, `Binds=null`, `Mounts=[]`, `User=node`.

## Cloudflare Quick Tunnel

- claude_gate: `not-run-yet`
- command: `cloudflared tunnel --no-autoupdate --loglevel info --url http://127.0.0.1:18082`
- url: `not-opened`
- local_public_url_test: `not-run-yet`
- external_test: `not-run-yet`
- teardown_command: `terminate recorded cloudflared process`
- final_state: `not-opened`
- dns_created: `none`

## Cloudflare Named Tunnel And DNS

- status: `not-attempted`
- reason: Must wait for successful Quick Tunnel and separate Claude/DNS gate. Current preflight also lacks a local Cloudflare origin certificate for named tunnel operations.
- allowed_hostname: `container-exposure-lab.labs.projectpezzos.com`

## Tailscale Funnel

- status: `not-attempted`
- current_blocker: `tailscale: needs-operator-input: local tailscaled daemon is not running`
- action_taken: none

## Article Impact

- status: `not-ready`
- recommendation: Do not update article conclusions until at least Quick Tunnel is tested and teardown is recorded.

## Open Resources

- public_urls: none
- cloudflare_tunnels: none opened by this lab yet
- dns_records: none created by this lab
- tailscale_funnel: none
