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

## 3. Cloudflare DNS

In the Cloudflare dashboard for `kipphard.com`:

- Add an A record: `kipphard.com` → `YOUR_SERVER_IP`, proxied (orange cloud)
- Add an A record: `www.kipphard.com` → `YOUR_SERVER_IP`, proxied (orange cloud)
- SSL/TLS mode: **Full** (not Full Strict — the origin serves plain HTTP on port 80)

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

## Rollback

Re-run an earlier successful workflow via **Actions → deploy → Run workflow** on the
desired commit, or rsync a previous `dist/` snapshot manually:

```sh
rsync -avz --delete -e "ssh -i ~/.ssh/id_ed25519_kipphard_deploy" \
  /path/to/old-dist/ root@YOUR_SERVER_IP:/var/www/kipphard.com/
```
