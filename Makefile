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
	npm run pretest
	bash scripts/update.sh --patch

tag-minor:
	npm run pretest
	bash scripts/update.sh --minor

tag-major:
	npm run pretest
	bash scripts/update.sh --major

publish:
	git push --tags origin main