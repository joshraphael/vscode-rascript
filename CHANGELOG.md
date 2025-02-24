# Change Log

All notable changes to the "vscode-rascript" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Function definition links
- Hover box for built-in functions: unless, measured, trigger_when, disable_when, always_true, always_false, format
- Hover box for user defined functions in script

### Changed
- Hover box content to include comments rendered in markdown
- Hover box content to include url
- CHANGELOG to include previous versions changes

## [0.0.2] - 2025-02-22

### Added

- Auto publish to VSCode marketplace and OVSX
- Version tagging script

## [0.0.1] - 2025-02-22

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