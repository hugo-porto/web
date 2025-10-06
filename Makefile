.DEFAULT_GOAL: lint
.NOTPARALLEL:
.SILENT:

lint:
	npx markdownlint --fix "**/*.md" -i node_modules
@PHONY: lint

dev: lint clean
	hugo server --buildDrafts --buildFuture --disableFastRender --noHTTPCache  --navigateToChanged --templateMetricsHints --templateMetrics --watch --port 1313
@PHONY: dev

dev-theme: lint clean
	HUGO_MODULE_REPLACEMENTS="github.com/hugo-porto/theme->../../theme" hugo server --buildDrafts --buildFuture --disableFastRender --noHTTPCache  --navigateToChanged --templateMetricsHints --templateMetrics --watch --port 1313
@PHONY: dev-theme

clean:
	rm -rf public
	rm -rf resources
	rm -rf .resources
@PHONY: clean

build: clean
	hugo --gc --minify --cleanDestinationDir
.PHONY: build

update:
	hugo mod get -u ./...
	hugo mod tidy
	npx npm-check-updates -u
	npm install --no-fund --no-audit
@PHONY: update

fmt:
	npx taplo format
@PHONY: fmt