install:
	rm -rf ~/.vscode/extensions/vscode-rascript
	mkdir ~/.vscode/extensions/vscode-rascript
	cp -r * ~/.vscode/extensions/vscode-rascript

setup:
	rm -rf node_modules/
	rm -rf out/
	npm install
	pnpm compile

tag-patch:
	bash scripts/update.sh --patch

tag-minor:
	bash scripts/update.sh --minor

tag-major:
	bash scripts/update.sh --major