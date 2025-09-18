# Change Log

All notable changes to the "vscode-rascript" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [[0.4.0](https://github.com/joshraphael/vscode-rascript/releases/tag/v0.4.0)] - 2025-09-18

[diff](https://github.com/joshraphael/vscode-rascript/compare/v0.3.1...v0.4.0)

### Added

- New built-in function definition `achievement_set()`

### Changed

- Syntax highlighting to use upstream [rascript-syntax](https://github.com/joshraphael/rascript-syntax) repo
- Unify document parser to align with language server
- `achievement()` built-in function definition to support new `set` parameter
- `leaderboard()` built-in function definition to support new `set` parameter

### Removed

### Fixed

- Bug involving incorrect comment bounds detected for hover, definition and completion data

### Security

## [[0.3.1](https://github.com/joshraphael/vscode-rascript/releases/tag/v0.3.1)] - 2025-08-07

[diff](https://github.com/joshraphael/vscode-rascript/compare/v0.3.0...v0.3.1)

### Added

### Changed

- Allow function names, parameters class names, and variables to start with an underscore

### Removed

### Fixed

- Extension package distribution pipeline

### Security

## [[0.3.0](https://github.com/joshraphael/vscode-rascript/releases/tag/v0.3.0)] - 2025-08-03

[diff](https://github.com/joshraphael/vscode-rascript/compare/v0.2.4...v0.3.0)

### Added

- Syntax highlighting for `class` and `this` keywords
- Auto complete for all class names and functions
- Hover documentation on classes, constructors and class functions
- Function definition jumping to class members

### Changed

- Fixed code jumping, hover text, and code completion to ignore any functions or classes defined in a comment
- Improved illegal name detection on functions and parameters

### Removed

### Fixed

- Duplicate function and variable names being show in auto completion

### Security

- Bump dependencies to fix multiple vulnerabilities [#3](https://github.com/joshraphael/vscode-rascript/security/dependabot/3), [#4](https://github.com/joshraphael/vscode-rascript/security/dependabot/4), [#5](https://github.com/joshraphael/vscode-rascript/security/dependabot/5), [#7](https://github.com/joshraphael/vscode-rascript/security/dependabot/7), [#10](https://github.com/joshraphael/vscode-rascript/security/dependabot/10)

## [[0.2.4](https://github.com/joshraphael/vscode-rascript/releases/tag/v0.2.4)] - 2025-06-16

[diff](https://github.com/joshraphael/vscode-rascript/compare/v0.2.3...v0.2.4)

### Added

### Changed

- Language client dependency required for production package to launch

### Removed

### Fixed

### Security

## [[0.2.3](https://github.com/joshraphael/vscode-rascript/releases/tag/v0.2.3)] - 2025-06-15

[diff](https://github.com/joshraphael/vscode-rascript/compare/v0.2.2...v0.2.3)

### Added

### Changed

### Removed

- File system check for language server before launch causing extension to not activate

### Fixed

### Security

## [[0.2.2](https://github.com/joshraphael/vscode-rascript/releases/tag/v0.2.2)] - 2025-06-15

[diff](https://github.com/joshraphael/vscode-rascript/compare/v0.2.1...v0.2.2)

### Added

### Changed

- Better fallback code for missing language server

### Removed

### Fixed

### Security

## [[0.2.1](https://github.com/joshraphael/vscode-rascript/releases/tag/v0.2.1)] - 2025-06-14

[diff](https://github.com/joshraphael/vscode-rascript/compare/v0.2.0...v0.2.1)

### Added

- Handle empty language server file path

### Changed

### Removed

### Fixed

### Security

## [[0.2.0](https://github.com/joshraphael/vscode-rascript/releases/tag/v0.2.0)] - 2025-06-14

[diff](https://github.com/joshraphael/vscode-rascript/compare/v0.1.3...v0.2.0)

### Added

- Enable Language Server Protocol

### Changed

### Removed

### Fixed

### Security

- Bump `@vscode/test-web` to version 0.0.70 ([security vulnerability](https://github.com/joshraphael/vscode-rascript/security/dependabot/2))

## [[0.1.3](https://github.com/joshraphael/vscode-rascript/releases/tag/v0.1.3)] - 2025-06-05

[diff](https://github.com/joshraphael/vscode-rascript/compare/v0.1.2...v0.1.3)

### Added

- Block comment support with markdown lists

### Changed

### Removed

### Fixed

### Security

## [[0.1.2](https://github.com/joshraphael/vscode-rascript/releases/tag/v0.1.2)] - 2025-05-27

[diff](https://github.com/joshraphael/vscode-rascript/compare/v0.1.1...v0.1.2)

### Added

- Header game id comment syntax tokenization
- Undocumented function definitions for: float_be, identity_transform, deduct, array_reduce, array_filter, max_of, __ornext
- Minimum version header
- Block comment hover box support

### Changed

### Removed

### Fixed

### Security

- Bump `@vscode/test-web` to version 0.0.69 ([security vulnerability](https://github.com/joshraphael/vscode-rascript/security/dependabot/1))

## [[0.1.1](https://github.com/joshraphael/vscode-rascript/releases/tag/v0.1.1)] - 2025-03-01

[diff](https://github.com/joshraphael/vscode-rascript/compare/v0.1.0...v0.1.1)

### Added

### Changed

- Hover box code refactor and optimization
- Function auto completion code refactor and optimization
- Comment documents list markdown formatting

### Removed

### Fixed

### Security

## [[0.1.0](https://github.com/joshraphael/vscode-rascript/releases/tag/v0.1.0)] - 2025-02-28

[diff](https://github.com/joshraphael/vscode-rascript/compare/v0.0.4...v0.1.0)

### Added

- Hover box for built-in functions: dictionary_contains_key, any_of, all_of, none_of, sum_of, tally_of, assert, achievement, rich_presence_display, rich_presence_value, rich_presence_lookup, rich_presence_ascii_string_lookup, rich_presence_macro, rich_presence_conditional_display, leaderboard

### Changed

- Hover box to support markdown tables

### Removed

### Fixed

### Security

## [[0.0.4](https://github.com/joshraphael/vscode-rascript/releases/tag/v0.0.4)] - 2025-02-25

[diff](https://github.com/joshraphael/vscode-rascript/compare/v0.0.3...v0.0.4)

### Added

- Auto completion for user defined functions
- Auto completion for user defined variables
- Hover box for built-in functions: substring, length, range, array_push, array_pop, array_map, array_contains
- Enable as web extension

### Changed

### Removed

### Fixed

### Security

## [[0.0.3](https://github.com/joshraphael/vscode-rascript/releases/tag/v0.0.3)] - 2025-02-24

[diff](https://github.com/joshraphael/vscode-rascript/compare/v0.0.2...v0.0.3)

### Added

- Function definition links
- Hover box for built-in functions: unless, measured, trigger_when, disable_when, always_true, always_false, format
- Hover box for user defined functions in script

### Changed

- Hover box content to include comments rendered in markdown
- Hover box content to include url
- CHANGELOG to include previous versions changes
- README improvements

### Removed

### Fixed

### Security

## [[0.0.2](https://github.com/joshraphael/vscode-rascript/releases/tag/v0.0.2)] - 2025-02-23

[diff](https://github.com/joshraphael/vscode-rascript/compare/v0.0.1...v0.0.2)

### Added

- Auto publish to VSCode marketplace and OVSX
- Version tagging script

### Changed

### Removed

### Fixed

### Security

## [[0.0.1](https://github.com/joshraphael/vscode-rascript/releases/tag/v0.0.1)] - 2025-02-22

[diff](https://github.com/joshraphael/vscode-rascript/compare/8f97b037538abae0e892b19c86ba3e4cd9f87c73...v0.0.1)

### Added

- Repository skeleton code setup
- MIT License
- Makefile install script
- Syntax highlighting for control keywords
- Syntax highlighting for booleans
- Syntax highlighting for strings
- Syntax highlighting for numbers
- Syntax highlighting for function definitions
- Syntax highlighting for function calls
- Syntax highlighting for comments
- Syntax highlighting for variable assignments
- Syntax highlighting for variables
- Hover box for built-in functions: byte, word, tbyte, dword, bit0, bit1, bit2, bit3, bit4, bit5, bit6, bit7, bit, low4, high4, bitcount, word_be, tbyte_be, dword_be, float, mbf32, mbf32_le, double32, double32_be, prev, prior, bcd, ascii_string_equals, unicode_string_equals, repeated, once, tally, never
- Auto completion for built-in functions: byte, word, tbyte, dword, bit0, bit1, bit2, bit3, bit4, bit5, bit6, bit7, bit, low4, high4, bitcount, word_be, tbyte_be, dword_be, float, mbf32, mbf32_le, double32, double32_be, prev, prior, bcd, repeated, once, tally, never, unless, measured, trigger_when, disable_when, always_true, always_false, format, substring, length, range, array_map, array_contains, array_push, array_pop, dictionary_contains_key, any_of, all_of, none_of, sum_of, tally_of, assert, achievement, rich_presence_display, rich_presence_value, rich_presence_lookup, rich_presence_ascii_string_lookup, rich_presence_macro, rich_presence_conditional_display, leaderboard

### Changed

### Removed

### Fixed

### Security