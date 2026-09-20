deps:
	sudo apt-get install libflite1 libavif16 libmanette-0.2-0 libwoff1
	npm install -g @vscode/vsce

setup: syntax
	rm -rf node_modules/
	rm -rf out/
	rm -f package-lock.json
	npm install
	npm run compile

syntax:
	rm -rf syntaxes
	mkdir -p syntaxes
	wget -O syntaxes/rascript.tmLanguage.json 'https://github.com/joshraphael/rascript-syntax/releases/download/v0.4.2/rascript.tmLanguage.json'

check: style
	npm run pretest
	npm audit fix

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

browser: deps
	npm run compile
	npm run browser

install: setup
	vsce package -o rascript.vsix
	codium --install-extension rascript.vsix