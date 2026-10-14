.PHONY: serve build secret_scan

PYTHON ?= python3
PORT ?= 8080

serve: build
	$(PYTHON) -m http.server $(PORT) --bind 127.0.0.1 --directory Website/build

build:
	$(PYTHON) "Rules & Workflows/build_site.py"

secret_scan:
	bash "Rules & Workflows/secret_scan.sh"
