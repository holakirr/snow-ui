# Public registry release

Release builds the JSON archive from the published commit after the npm smoke
checks. It attaches the archive to the first package tag in sorted order and
then advances the release branch. The registry server polls that branch and
uses a public GitHub release asset. GitHub Actions has no access to the server.

Install the reviewed worker and units on the existing registry server:

```sh
install -d -m 0755 /usr/local/libexec
install -m 0755 ops/public-registry/sync.py /usr/local/libexec/snowui-registry-sync.py
install -m 0644 ops/public-registry/snowui-registry-sync.{service,timer} /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now snowui-registry-sync.timer
systemctl start snowui-registry-sync.service
```

The worker requires Git and Python 3.9 or later. It retains the old artifacts and
switches the existing current symlink only after validating the entire archive
and rechecking the release ref. Caddy continues to serve the existing directory.
For a release already installed before this automation, retain its immutable
artifact for recovery. Only subsequent package releases have downloadable JSON
assets.

Production Check waits for both the site's registry metadata and the public
catalog and Button item to report the same release commit and version.

To investigate a stalled rollout, check the promote job and
`journalctl -u snowui-registry-sync.service`. To roll back the static registry,
stop the timer, wait for the active worker to finish, and atomically replace
current with the previous immutable artifact. Re-enable the timer after the
release ref and the desired deployment agree.
