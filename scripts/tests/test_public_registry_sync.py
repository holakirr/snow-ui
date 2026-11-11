import importlib.util
import io
import json
from pathlib import Path
import tarfile
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location(
    "registry_sync", Path(__file__).resolve().parents[2] / "ops/public-registry/sync.py"
)
sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)
SHA = "a" * 40
OLD = "b" * 40


def archive(sha=SHA, bad_name=None):
    file = {"name": "button", "meta": {"commit": sha, "version": "5.3.5"}}
    body = io.BytesIO()
    with tarfile.open(fileobj=body, mode="w") as tar:
        for name, contents in (
            ("registry.json", {"items": [file]}),
            (bad_name or "button.json", file),
        ):
            data = json.dumps(contents).encode()
            entry = tarfile.TarInfo(name)
            entry.size = len(data)
            tar.addfile(entry, io.BytesIO(data))
    return body.getvalue()


class RegistrySyncTests(unittest.TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.root = Path(tmp.name)
        self.previous = self.root / "releases/previous"
        (self.previous / "r").mkdir(parents=True)
        (self.previous / "r/button.json").write_text(json.dumps({"meta": {"commit": OLD}}))
        self.current = self.root / "current"
        self.current.symlink_to(self.previous)
        self.refs = {"refs/heads/release": SHA, "refs/tags/@holakirr/snow-ui@5.3.5": SHA}

    def test_installs_and_retry_does_not_download_again(self):
        with patch.object(sync, "refs", return_value=self.refs), patch.object(
            sync, "urlopen", return_value=io.BytesIO(archive())
        ) as download:
            sync.sync(self.root)
            sync.sync(self.root)
        download.assert_called_once_with(
            f"{sync.REPO}/releases/download/%40holakirr/snow-ui%405.3.5/public-registry-{SHA}.tar",
            timeout=20,
        )
        self.assertEqual(json.loads((self.current / "r/button.json").read_text())["meta"]["commit"], SHA)
        self.assertTrue(self.previous.exists())

    def test_invalid_archive_cannot_replace_current(self):
        for data in (archive(OLD), archive(bad_name="../outside.json")):
            with self.subTest(data=data[:20]), patch.object(sync, "refs", return_value=self.refs), patch.object(
                sync, "urlopen", return_value=io.BytesIO(data)
            ):
                with self.assertRaises(ValueError):
                    sync.sync(self.root)
                self.assertEqual(self.current.readlink(), self.previous)

    def test_changed_release_ref_cannot_replace_current(self):
        with patch.object(sync, "refs", side_effect=[self.refs, {"refs/heads/release": OLD}]), patch.object(
            sync, "urlopen", return_value=io.BytesIO(archive())
        ):
            with self.assertRaises(RuntimeError):
                sync.sync(self.root)
        self.assertEqual(self.current.readlink(), self.previous)


if __name__ == "__main__":
    unittest.main()
