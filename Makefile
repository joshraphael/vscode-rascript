install:
	rm -rf ~/.vscode/extensions/vscode-rascript
	mkdir ~/.vscode/extensions/vscode-rascript
	cp -r * ~/.vscode/extensions/vscode-rascript

setup:
	rm -rf node_modules/
	rm -rf out/
	npm install
	pnpm compile