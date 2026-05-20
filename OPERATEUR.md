# Operator Follow-Up

This lab created one Cloudflare DNS route that still needs manual cleanup.

## Remove The Remaining DNS Record

In the Cloudflare dashboard for `projectpezzos.com`, delete the DNS record:

- name: `container-exposure-lab.projectpezzos.com`
- expected type: proxied CNAME or tunnel route
- expected target: `35d43b87-932b-4a32-8798-432c666a6e45.cfargotunnel.com`

Do not delete any other record.

After deletion, verify:

```sh
dig +short A container-exposure-lab.projectpezzos.com
dig +short AAAA container-exposure-lab.projectpezzos.com
curl -I --max-time 15 http://container-exposure-lab.projectpezzos.com/healthz
```

Expected result: no Cloudflare edge IPs for the hostname, or at least no response from
the lab app.

## HTTPS Custom Hostname Result

The deep hostname `container-exposure-lab.labs.projectpezzos.com` served HTTP through the
Named Tunnel but failed HTTPS with a TLS handshake error. Alexandre then approved the
first-level hostname `container-exposure-lab.projectpezzos.com`.

The first-level hostname test is complete:

- `https://container-exposure-lab.projectpezzos.com/healthz` returned HTTP `200`.
- TLS verification result was `0`.
- The tunnel, connector process, local credential file, Tailscale Funnel, and Docker
  container are closed.

Do not rerun the Named Tunnel/DNS branch until the cleanup above is complete.
