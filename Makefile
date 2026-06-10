deps:
	sudo apt-get install libflite1 libavif16 libmanette-0.2-0 libwoff1

setup: syntax
	rm -rf node_modules/
	rm -rf out/
	rm -f pnpm-lock.yaml
	pnpm install
	pnpm compile

syntax:
	rm -rf syntaxes
	mkdir -p syntaxes
	wget -O syntaxes/rascript.tmLanguage.json 'https://github.com/joshraphael/rascript-syntax/releases/download/v0.4.2/rascript.tmLanguage.json'

check: style
	pnpm run pretest

style:
	pnpm run format
	pnpm run lint

tag-patch: check
	bash scripts/update.sh --patch

tag-minor: check
	bash scripts/update.sh --minor

tag-major: check
	bash scripts/update.sh --major

publish:
	git push --tags origin main

browser: deps
	pnpm run compile
	pnpm run browser