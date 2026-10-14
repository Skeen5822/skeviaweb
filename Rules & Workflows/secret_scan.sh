#!/usr/bin/env bash
set -euo pipefail

repository_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
audit_directory="$(mktemp -d "${RUNNER_TEMP:-${TMPDIR:-/tmp}}/skevia-secret-scan.XXXXXX")"
trap 'rm -rf -- "${audit_directory}"' EXIT

curl --fail --silent --show-error --location \
  https://github.com/gitleaks/gitleaks/releases/download/v8.30.1/gitleaks_8.30.1_linux_x64.tar.gz \
  --output "${audit_directory}/gitleaks.tar.gz"
printf '%s  %s\n' \
  551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb \
  "${audit_directory}/gitleaks.tar.gz" | sha256sum --check --strict
tar -xzf "${audit_directory}/gitleaks.tar.gz" -C "${audit_directory}" gitleaks

cd -- "${repository_root}"
"${audit_directory}/gitleaks" git --redact --log-opts=--all --no-banner .
"${audit_directory}/gitleaks" dir --redact --no-banner .
