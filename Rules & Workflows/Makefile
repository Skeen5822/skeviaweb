.PHONY: serve secret_scan

PYTHON ?= python3
PORT ?= 8080

serve:
	$(PYTHON) -m http.server $(PORT) --bind 127.0.0.1

secret_scan:
	bash "Rules & Workflows/secret_scan.sh"
