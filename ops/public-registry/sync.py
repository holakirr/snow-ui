#!/usr/bin/env python3
"""Install the public JSON artifact for the current SnowUI release ref."""
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import tarfile
import tempfile
from urllib.parse import quote
from urllib.request import urlopen

REPO = "https://github.com/holakirr/snow-ui"
ROOT = Path("/var/lib/snow-ui-registry")
LIMIT = 32 * 1024 * 1024
ITEM = re.compile(r"[a-z0-9]+(?:-[a-z0-9]+)*\.json")
TAG = re.compile(r"@holakirr/snow-ui(?:-icons|-charts)?@[0-9]+\.[0-9]+\.[0-9]+")


def refs():
    output = subprocess.check_output(
        ["git", "ls-remote", REPO, "refs/heads/release", "refs/tags/@holakirr/snow-ui*"],
        text=True, timeout=20,
    )
    return {ref: sha for sha, ref in map(str.split, output.splitlines())}


def extract(archive, directory, sha):
    digest = hashlib.sha256()
    items = {}
    size = 0
    with tarfile.open(archive, "r:") as tar:
        for member in sorted(tar, key=lambda item: item.name):
            if not member.isfile() or not ITEM.fullmatch(member.name) or member.name in items:
                raise ValueError("Unexpected registry archive entry")
            size += member.size
            if size > LIMIT:
                raise ValueError("Registry archive is too large")
            data = tar.extractfile(member).read()
            items[member.name] = json.loads(data)
            digest.update(f"{hashlib.sha256(data).hexdigest()}  {member.name}\n".encode())
            (directory / member.name).write_bytes(data)
    catalog = items.pop("registry.json")["items"]
    if not items or len(catalog) != len(items) or {item["name"] + ".json" for item in catalog} != items.keys():
        raise ValueError("Registry catalog and archive disagree")
    for item in catalog:
        file = items[item["name"] + ".json"]
        if file["meta"]["commit"] != sha or item["meta"] != file["meta"] or file["name"] != item["name"]:
            raise ValueError("Registry item does not match the release")
    return digest.hexdigest()


def sync(root=ROOT):
    with (root / ".snowui-release-lock").open("a") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        remote = refs()
        sha = remote["refs/heads/release"]
        if not re.fullmatch(r"[a-f0-9]{40}", sha):
            raise ValueError("Invalid release ref")
        current = root / "current"
        if current.is_symlink():
            installed = json.loads((current / "r/button.json").read_text())
            if installed["meta"]["commit"] == sha:
                return
        tags = sorted(
            ref.removeprefix("refs/tags/") for ref, target in remote.items()
            if ref.startswith("refs/tags/") and TAG.fullmatch(ref.removeprefix("refs/tags/"))
            and target == sha
        )
        if not tags:
            raise ValueError("No published package tag for the current release")
        url = f"{REPO}/releases/download/{quote(tags[0], safe='/')}/public-registry-{sha}.tar"
        with tempfile.TemporaryDirectory(dir=root) as tmp:
            stage = Path(tmp)
            archive = stage / "artifact.tar"
            with urlopen(url, timeout=20) as response:
                data = response.read(LIMIT + 1)
            if len(data) > LIMIT:
                raise ValueError("Registry download is too large")
            archive.write_bytes(data)
            package = stage / "package"
            directory = package / "r"
            directory.mkdir(parents=True)
            artifact = extract(archive, directory, sha)
            target = root / "releases" / artifact
            if refs().get("refs/heads/release") != sha:
                raise RuntimeError("Release ref changed while preparing registry")
            if not target.exists():
                package.rename(target)
            elif {file.name: file.read_bytes() for file in (target / "r").iterdir()} != {
                file.name: file.read_bytes() for file in directory.iterdir()
            }:
                raise ValueError("Existing immutable registry artifact differs")
            link = stage / "current"
            link.symlink_to(target)
            os.replace(link, current)
            print(f"Public registry: {sha} ({artifact})")


if __name__ == "__main__":
    sync()
