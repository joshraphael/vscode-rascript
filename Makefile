install:
	rm -rf ~/.vscode/extensions/vscode-rascript
	mkdir ~/.vscode/extensions/vscode-rascript
	cp -r * ~/.vscode/extensions/vscode-rascript

setup:
	rm -rf node_modules/
	rm -rf out/
	rm -f package-lock.json
	npm install
	pnpm compile

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