# First-time deploy setup

## 1. Deploy key

A dedicated ed25519 key has already been generated at `~/.ssh/id_ed25519_kipphard_deploy`.
The corresponding public key must be authorised on the server (see step 2).

## 2. Server setup

```sh
ssh hetzner-vb
mkdir -p /var/www/kipphard.com
chown -R www-data:www-data /var/www/kipphard.com
# Append the deploy pubkey so CI can rsync as root
cat >> /root/.ssh/authorized_keys <<'EOF'
<contents of ~/.ssh/id_ed25519_kipphard_deploy.pub>
EOF
```

The nginx vhost is synced automatically on each deploy. For the very first run,
symlink it manually if the deploy job has not run yet:

```sh
ln -s /etc/nginx/sites-available/kipphard.com /etc/nginx/sites-enabled/kipphard.com
nginx -t && systemctl reload nginx
```

## 3. Cloudflare DNS + origin certificate

In the Cloudflare dashboard for `kipphard.com`:

- Add an A record: `kipphard.com` → `YOUR_SERVER_IP`, proxied (orange cloud)
- Add an A record: `www.kipphard.com` → `YOUR_SERVER_IP`, proxied (orange cloud)
- SSL/TLS → Origin Server → **Create Certificate** for `kipphard.com, *.kipphard.com` (default 15-year validity). Install on the box:

```sh
ssh hetzner-vb
mkdir -p /etc/ssl/kipphard.com
# Paste the certificate body into:
${EDITOR:-vim} /etc/ssl/kipphard.com/origin.crt   # chmod 644
# Paste the private key into:
${EDITOR:-vim} /etc/ssl/kipphard.com/origin.key   # chmod 600
```

- SSL/TLS mode: **Full (Strict)** — the Origin Certificate is trusted by CF's edge, so Strict works. Plain "Full" also works but is weaker.

## 4. GitHub secret

In the GitHub repo: Settings → Secrets and variables → Actions → New repository secret.

- Name: `DEPLOY_SSH_KEY`
- Value: the full contents of `~/.ssh/id_ed25519_kipphard_deploy`, including the
  `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----` lines.

## 5. Verify

After the first push to `main` triggers the Actions workflow:

```sh
curl -I https://kipphard.com
# Expect: HTTP/2 200 (CF terminates TLS; nginx sees HTTP/1.1 on port 80)
```

Check the Actions tab for step-level logs if anything fails.

## Contact form (Worker + Resend)

### Cloudflare Turnstile

Cloudflare dashboard → Turnstile → Add site → domain `kipphard.com` → Widget mode **Managed**.

- **Site key** (public): add as GitHub secret `TURNSTILE_SITE_KEY` (used at build time so the bundle has it). Optionally copy into `.env.local` for local dev.
- **Secret key**: Worker secret, never committed to git (see Worker deploy below).

### Resend

1. Sign up at resend.com → Add domain `kipphard.com`.
2. Add the DNS records Resend shows (DKIM TXT, SPF append, optional DMARC) in Cloudflare DNS.
3. Create an API key → used as Worker secret below.

### Worker deploy (one-time)

```sh
cd worker
pnpm install
pnpm exec wrangler login              # browser auth to Cloudflare
pnpm exec wrangler secret put TURNSTILE_SECRET_KEY
pnpm exec wrangler secret put RESEND_API_KEY
pnpm exec wrangler deploy
```

### GitHub secrets to add

| Secret | Value |
|---|---|
| `TURNSTILE_SITE_KEY` | The public site key from Turnstile (ships in the JS bundle) |

The Worker secrets (`TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`) are set via `wrangler secret put` and are never stored in this repo or in GitHub Actions.

## Rollback

Re-run an earlier successful workflow via **Actions → deploy → Run workflow** on the
desired commit, or rsync a previous `dist/` snapshot manually:

```sh
rsync -avz --delete -e "ssh -i ~/.ssh/id_ed25519_kipphard_deploy" \
  /path/to/old-dist/ root@YOUR_SERVER_IP:/var/www/kipphard.com/
```
