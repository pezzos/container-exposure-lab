# Operator Follow-Up

This lab created one Cloudflare DNS route that still needs manual cleanup.

## Remove The Remaining DNS Record

In the Cloudflare dashboard for `projectpezzos.com`, delete the DNS record:

- name: `container-exposure-lab.labs.projectpezzos.com`
- expected type: proxied CNAME or tunnel route
- expected target: `41e8e08a-d2be-4cab-92f5-968ccfecdac0.cfargotunnel.com`

Do not delete any other record.

After deletion, verify:

```sh
dig +short A container-exposure-lab.labs.projectpezzos.com
dig +short AAAA container-exposure-lab.labs.projectpezzos.com
curl -I --max-time 15 http://container-exposure-lab.labs.projectpezzos.com/healthz
```

Expected result: no Cloudflare edge IPs for the hostname, or at least no response from
the lab app.

## Complete The HTTPS Custom Hostname Test

The HTTP custom hostname test worked, but HTTPS failed with a TLS handshake error.
Cloudflare Universal SSL on a full setup covers the apex and first-level subdomains, not
deeper hostnames such as `container-exposure-lab.labs.projectpezzos.com`.

Choose one path before rerunning this branch:

1. Enable Total TLS or create an advanced certificate covering
   `container-exposure-lab.labs.projectpezzos.com` or `*.labs.projectpezzos.com`.
2. Authorize a first-level lab hostname such as
   `container-exposure-lab.projectpezzos.com`, then repeat the DNS snapshot and Claude
   gate for that changed hostname before creating any record.

Do not rerun the Named Tunnel/DNS branch until the cleanup above is complete.

