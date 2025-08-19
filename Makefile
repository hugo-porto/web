.DEFAULT_GOAL: lint
.NOTPARALLEL:
.SILENT:

lint:
	markdownlint '**/*.md'
@PHONY: lint

dev: lint
	hugo server --buildDrafts --buildFuture --disableFastRender --noHTTPCache  --navigateToChanged --templateMetricsHints --templateMetrics --watch --port 1313
@PHONY: dev

dev-theme: lint
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

upgrade:
	hugo mod get -u ./...
	hugo mod tidy
@PHONY: upgrade