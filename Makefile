setup: syntax
	rm -rf node_modules/
	rm -rf out/
	rm -f package-lock.json
	npm install
	pnpm compile

syntax:
	rm -rf syntaxes
	mkdir -p syntaxes
	wget -O syntaxes/rascript.tmLanguage.json 'https://github.com/joshraphael/rascript-syntax/releases/download/v0.3.0/rascript.tmLanguage.json'

check: style
	npm run pretest

style:
	npm run format
	npm run lint

tag-patch: check
	bash scripts/update.sh --patch

tag-minor: check
	bash scripts/update.sh --minor

tag-major: check
	bash scripts/update.sh --major

publish:
	git push --tags origin main

browser:
	npm run compile
	npm run browser