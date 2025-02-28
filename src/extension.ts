import * as vscode from 'vscode';
import { builtinFunctionDefinitions } from './functionDefinitions';

const G_FUNCTION_DEFINITION = /(\bfunction\b)\s*(\w+)\s*\(([^\(\)]*)\)/g; // keep in sync with syntax file rascript.tmLanguage.json #function-definitions regex
const G_COMMENTS = new RegExp('^\/\/.*$', 'g');
const G_VARIABLES = /(\w+)\s*=/g;

export function activate(context: vscode.ExtensionContext) {
    const definitions = vscode.languages.registerDefinitionProvider('rascript', {
        provideDefinition(document, position, token) {
            let text = document.getText();
            const range = document.getWordRangeAtPosition(position);
            const word = document.getText(range);
            let m: RegExpExecArray | null;
            let functionDefinitions = new Map<string, vscode.Position>();
            while (m = G_FUNCTION_DEFINITION.exec(text)) {
                let pos = document.positionAt(m.index);
                functionDefinitions.set(m[2], pos);
            }
            if (functionDefinitions.has(word)) {
                let pos = functionDefinitions.get(word);
                if(pos !== undefined) {
                    let r = new vscode.Range(pos, pos);
                    const locLink: vscode.LocationLink = {
                        targetRange: r,
                        targetUri: document.uri,
                    };
                    return [locLink];
                }
            }
            return null;
        }
    });

    const hover = vscode.languages.registerHoverProvider('rascript', {
        provideHover(document: vscode.TextDocument, position: vscode.Position) {

            let words = [
                // newHoverText("repeated", "// Parameters:\n//\n// `count` - number of repetitions\n//\n// `comparison` - condition that must be true\n//\n// Adds a Hit Target to the condition.\n// The specified `comparison` must be true for count frames for the trigger to fire.\n// The frames do not have to be consecutive.\n// Once the Hit Target is met, the condition is considered true until it is reset.", "https://github.com/Jamiras/RATools/wiki/Trigger-Functions#repeatedcount-comparison", "count", "comparison"),
                // newHoverText("once", "// Parameters:\n//\n// `comparison` - condition that must be true\n//\n// Shorthand for `repeated(1, comparison)`.\n// The specified `comparison` must have been true at one point, but is not required to currently be true to trigger the achievement.", "https://github.com/Jamiras/RATools/wiki/Trigger-Functions#oncecomparison", "comparison"),
                // newHoverText("tally", "// Parameters:\n//\n// `count` - number of repetitions\n//\n// `comparisons` - list of conditions that can add to the tally count\n//\n// Adds a Hit Target to the condition where multiple conditions may be true in the same frame.\n// `comparison` may be an array of conditions, or multiple conditions passed as individual parameters.\n// Each condition that is true on each frame will tally a Hit Count.\n// Multiple Hit Counts may be tallied in the same frame.\n// The overall tally must reach `count` for the trigger to fire.\n// Once the Hit Target is met, the condition is considered true until it is reset.\n//\n// Individual conditions in the `comparisons` list may be wrapped in a `deduct()` function call, which causes any hits counted by the condition to be deducted from the overall tally.\n//\n// If `count` is zero, the overall condition will become true as soon as any individual comparison is true.\n// This is mostly used when building leaderboard value clauses using the `measured` function as it provides an unbounded counting of the subclauses.", "https://github.com/Jamiras/RATools/wiki/Trigger-Functions#tallycount-comparisons", "count", "comparison"),
                // newHoverText("never", "// Parameters:\n//\n// `comparison` - condition that must be true\n//\n// This becomes a `ResetIf`. If the `comparison` is true, all Hit Counts in the trigger are reset to 0, and the trigger cannot fire.", "https://github.com/Jamiras/RATools/wiki/Trigger-Functions#nevercomparison", "comparison"),
                // newHoverText("unless", "// Parameters:\n//\n// `comparison` - condition that must be true\n//\n// This becomes a PauseIf.\n// The group containing the PauseIf is not processed while the condition is true, and the trigger cannot fire.\n//\n// `unless` has precedence over `never`.\n// A paused group will not evaluate it's reset statements.\n// If the `comparison` is a `repeated` condition, once the Hit Target has been met, the group will be \"Pause Lock\"ed until a `never` resets it's Hit Count from another group.", "https://github.com/Jamiras/RATools/wiki/Trigger-Functions#unlesscomparison", "comparison"),
                // newHoverText("measured", "// Parameters:\n//\n// `comparison` - condition that must be true\n//\n// `when` - (Optional) secondary condition that must be true\n//\n// `format` - (Optional) format of value `raw` or `percent`\n//\n// This adds a `Measured` flag to the comparison. If the `comparison` is repeated, the Measured value will be the current number of hits on the condition, and the measurement target will be the Hit Target for the condition. Otherwise, the Measured value will be the left side value and the measurement target will be the right side value (regardless of the comparison operation).\n//\n// When used in an achievement, Measurements are displayed in the overlay. Use the `when` parameter to specify a secondary condition that must be true for the Measured value to be reported (i.e. for achievements where the player must be using a specific character). If the `when` condition is false, the Measured value will be 0, regardless of the values in the associated memory. Both the `comparison` (and `when` condition if provided) must be true for the achievement to trigger.\n//\n// `format` may be set to `percent` to change the display in the overlay to report a percentage instead of the raw measured value (i.e. 75% instead of 3/4)\n//\n// When used in rich presence or leaderboards, the Measured value is captured and the measurement target is ignored.\n//\n// **Using with complex conditions**\n//\n// `comparison` may be a series of AND'd or OR'd conditions.\n// This will cause `repeated`, `once`, and `measured` to generate a series of OrNext and AndNext conditions, and `never` and `unless` will generate a series of ResetIf/PauseIf conditions.", "https://github.com/Jamiras/RATools/wiki/Trigger-Functions#measuredcomparison-whenalways_true-formatraw", "comparison", "when", "format"),
                // newHoverText("trigger_when", "// Parameters:\n//\n// `comparison` - condition that must be true\n//\n// This adds a `Trigger` flag to the comparison, which tells the runtime that the specified conditions are the last conditions that will be true for the achievement.\n// When all other logical conditions are true, the runtime may display an indicator on-screen to let the user know they're close to completing an achievement.\n// Should be used for tracking challenges, like defeating a boss without taking damage.", "https://github.com/Jamiras/RATools/wiki/Trigger-Functions#trigger_whencomparison", "comparison"),
                // newHoverText("disable_when", "// Parameters:\n//\n// `comparison` - condition that must be true\n//\n// `until` - (Optional) condition to reset the hit count\n//\n// This adds a `PauseIf` flag and a hit target to the comparison. If `comparison` is not a `repeated()` condition, the hit target will be 1, otherwise the hit target will come from the `repeated()` function call. When the hit target is met, the runtime will disable the achievement indefinitely. This is most often used to disable achievements while a cheat is active.\n//\n// If `until` is specified, it will generate a `ResetNextIf` condition attached to the `PauseIf`, which will clear the hit count when true, thereby re-enabling the achievement.", "https://github.com/Jamiras/RATools/wiki/Trigger-Functions#disable_whencomparison-untilalways_false", "comparison", "until"),
                // newHoverText("always_true", "// Defines the clause \"1==1\".\n// It is typically only used to move a PauseIf/ResetIf to an alt group:\n//\n`byte(0x1234) == 8 && (always_true() || (never(byte(0x2345) == 12) && unless(byte(0x3456) == 6)))`\n//\nThis allows the achievement (core group) to trigger while the `never` is paused by the `unless`.", "https://github.com/Jamiras/RATools/wiki/Built-in-Functions#always_true"),
                // newHoverText("always_false", "// Defines the clause \"0==1\".\n// It is typically used for constructing alt chains, as a variable must have an initial value:\n//\n// ```rascript\n// trigger = always_false()\n// for test in tests\n//     trigger = trigger || test\n// achievement(..., trigger = trigger)\n// ```\n//\n// If more than two alt groups exist, the `always_false` group will be removed from the final achievement code", "https://github.com/Jamiras/RATools/wiki/Built-in-Functions#always_false"),
                // newHoverText("format", "// Parameters:\n//\n// `format_string` - the format string template\n//\n// `parameters` - (Optional) the list of replacement values\n//\n// Builds a string by inserting parameters into placeholders in the format_string.\n//\n// For example:\n//\n// ```rascript\n// stage_names = {\n//     1: \"Downtown\"\n// }\n// stage_1_label = format(\"Stage {0} - {1}\", 1, stage_names[1])\n// ```\n//\n// Would set stage_1_label to \"Stage 1 - Downtown\"", "https://github.com/Jamiras/RATools/wiki/Built-in-Functions#formatformat_string-parameters", "format_string", "parameters"),
                // newHoverText("substring", "//Parameters:\n//\n// `string` - the string\n//\n// `offset` - the starting offset\n//\n// `length` - (Optional) the length of the substring\n//\n// Returns `length` characters of `string`, starting at `offset` (0-based).\n// A negative offset indicates the returned value should start that far from the end of the string.\n// A negative length indicates the returned value should stop that far from the end of the string.\n\n// ```rascript\n// bc  = substring(\"abcdef\", 1, 2)  // take two characters starting at index 1\n// def = substring(\"abcdef\", 3)     // take all remaining characters starting at index 3\n// e   = substring(\"abcdef\", -2, 1) // starting two from end, take one character\n// cd  = substring(\"abcdef\", 2, -2) // starting at index 2, take all but two characters\n// ```\n\n// If the `offset` or `length` parameters extend beyond the length of the string, only characters at indices within the string will be returned.\n// If all captured characters would be outside the string, an empty string is returned.", "https://github.com/Jamiras/RATools/wiki/Built-in-Functions#substringstring-offset-length0x7fffffff", "string", "offset", "length"),
                // newHoverText("length", "//Parameters:\n//\n// `object` - the dictionary or array\n//\n// Returns the number of elements in a dictionary or array, or the number of characters in a string.", "https://github.com/Jamiras/RATools/wiki/Built-in-Functions#lengthobject", "object"),
                // newHoverText("range", "// Parameters:\n//\n// `start` - start index\n//\n// `stop` - stop index\n//\n// `step` - (Optional) number of indicies to skip to next\n//\n// Returns an array containing integers starting at `start` and continuing until `stop`.\n//\n// If `step` is specified, the second item will be `start+step`, the third will be `start+step*2`, and so on until a value greater than `stop` would be generated.\n// That value will be ignored.", "https://github.com/Jamiras/RATools/wiki/Built-in-Functions#rangestart-stop-step1", "start", "stop", "step"),
                // newHoverText("array_push", "// Parameters:\n//\n// `array` - the array of values\n//\n// `value` - the new value\n//\n// Appends `value` to the end of `array`.", "https://github.com/Jamiras/RATools/wiki/Built-in-Functions#array_pusharray-value", "array", "value"),
                // newHoverText("array_pop", "// Parameters:\n//\n// `array` - the array of values\n//\n// Removes and returns the last value from `array`.\n// If `array` is empty, integer 0 is returned. \n// You can use `length()` to determine if `array` is empty before calling `array_pop`.", "https://github.com/Jamiras/RATools/wiki/Built-in-Functions#array_poparray", "array"),
                // newHoverText("array_map", "// Parameters:\n//\n// `inputs` - an array or dictionary of values\n//\n// `predicate` - the function to process each value through\n//\n// Returns an array generated by processing each item in `inputs` through `predicate`.\n//\n// `inputs` is an array or a dictionary.\n// If a dictionary is provided, the keys will be passed to the `predicate`.\n//\n// `predicate` is a function that accepts a single input and returns an expression or constant constructed from that input.\n// The expressions returned by `predicate` are stored in the new array that is returned by `array_map`.", "https://github.com/Jamiras/RATools/wiki/Built-in-Functions#array_mapinputs-predicate", "inputs", "predicate"),
                // newHoverText("array_contains", "// Parameters:\n//\n// `array` - an array of values\n//\n// `value` - the value to look for\n//\n// Returns `true` if `value` is found in `array`.", "https://github.com/Jamiras/RATools/wiki/Built-in-Functions#array_containsarray-value", "array", "value"),
                // newHoverText("dictionary_contains_key", "// Parameters:\n//\n// `dictionary` - the dictionary of key/values\n//\n// `key` - the key to check\n//\n// Returns `true` if `dictionary` contains an entry for the specified `key`.", "https://github.com/Jamiras/RATools/wiki/Built-in-Functions#dictionary_contains_keydictionary-key", "dictionary", "key"),
                // newHoverText("any_of", "// Parameters:\n//\n// `inputs` - an array or dictionary\n//\n// `predicate` - the function to process each value through\n//\n// Returns an expression that will evaluate true if any of the `inputs` matches the `predicate`.\n//\n// `inputs` is an array or a dictionary.\n// If a dictionary is provided, the keys will be passed to the `predicate`.\n// \n// `predicate` is a function that accepts a single input and returns an expression constructed from that input.\n// The expressions returned by `predicate` are joined with `||`s.", "https://github.com/Jamiras/RATools/wiki/Built-in-Functions#any_ofinputs-predicate", "inputs", "predicate"),
                // newHoverText("all_of", "// Parameters:\n//\n// `inputs` - an array or dictionary\n//\n// `predicate` - the function to process each value through\n//\n// Returns an expression that will evaluate true if any of the `inputs` matches the `predicate`.\n//\n// `inputs` is an array or a dictionary.\n// If a dictionary is provided, the keys will be passed to the `predicate`.\n// \n// `predicate` is a function that accepts a single input and returns an expression constructed from that input.\n// The expressions returned by `predicate` are joined with `&&`s.", "https://github.com/Jamiras/RATools/wiki/Built-in-Functions#all_ofinputs-predicate", "inputs", "predicate"),
                // newHoverText("none_of", "// Parameters:\n//\n// `inputs` - an array or dictionary\n//\n// `predicate` - the function to process each value through\n//\n// Returns an expression that will evaluate true if all of the inputs do not match the predicate.\n//\n// `inputs` is an array or a dictionary.\n// If a dictionary is provided, the keys will be passed to the `predicate`.\n//\n// `predicate` is a function that accepts a single input and returns an expression constructed from that input.\n// The expressions returned by `predicate` are negated (`!`) and then joined with `&&`s.", "https://github.com/Jamiras/RATools/wiki/Built-in-Functions#none_ofinputs-predicate", "inputs", "predicate"),
                // newHoverText("sum_of", "// Parameters:\n//\n// `inputs` - an array or dictionary\n//\n// `predicate` - the function to process each value through\n//\n// Returns an expression that will calculate the sum of the `inputs` modified by the `predicate`.\n//\n// `inputs` is an array or a dictionary.\n// If a dictionary is provided, the keys will be passed to the `predicate`.\n//\n// `predicate` is a function that accepts a single input and returns an expression constructed from that input.\n// The expressions returned by `predicate` are added together with `+`.", "https://github.com/Jamiras/RATools/wiki/Built-in-Functions#sum_ofinputs-predicate", "inputs", "predicate"),
                // newHoverText("tally_of", "// Parameters:\n//\n// `inputs` - an array or dictionary\n//\n// `count` - the tally count\n//\n// `predicate` - the function to process each value through\n//\n// Returns a [`tally`](https://github.com/Jamiras/RATools/wiki/Trigger-Functions#tallycount-comparisons) expression where each comparison is generated by running the `inputs` through the `predicate`.\n//\n// `inputs` is an array or a dictionary.\n// If a dictionary is provided, the keys will be passed to the `predicate`.\n// \n// `predicate` is a function that accepts a single input and returns an expression constructed from that input.\n// The expressions returned by `predicate` are used in the `tally` expression.", "https://github.com/Jamiras/RATools/wiki/Built-in-Functions#tally_ofinputs-count-predicate", "inputs", "count", "predicate"),
                // newHoverText("assert", "// Parameters:\n//\n// `condition` - the condition to assert as true\n//\n// `message` - (Optional) the error string returned if `condition` is `false`\n//\n// Generates a processing error if `condition` is false.\n// `message` defines what the error should say.\n// If not specified, the message will be the `condition` as a string.", "https://github.com/Jamiras/RATools/wiki/Built-in-Functions#assertcondition-message", "condition", "message"),
                // newHoverText("achievement", "// Parameters:\n//\n// `title` - the achievement title\n//\n// `description` - the achievement description\n//\n// `points` - the achievement point value\n//\n// `trigger` - conditions to award the achievement\n//\n// `id` - (Optional) id of achievement on retroachievements.org\n//\n// `published` - (Optional) unused\n//\n// `modified` - (Optional) unused\n//\n// `badge` - (Optional) badge id number on retroachievements.org\n//\n// `type` - (Optional) type of achievement\n//\n// Defines a new achievement with the specified `title` (string), `description` (string), `points` (integer), and `trigger`.\n//\n// `trigger` is an expression with one or more [comparisons](https://github.com/Jamiras/RATools/wiki/Operators#comparisons). These may be modified by [trigger functions](https://github.com/Jamiras/RATools/wiki/Trigger-Functions). \n//\n// if `id` is provided when calling the `achievement` function, the script will generate a local achievement definition that the toolkit will merge into the existing achievement instead of putting as a separate local achievement.\n// \n// `badge` can be used to specify the image associated to the achievement. The value is the ID of the badge (already on the server). RATools will not upload a badge for you.\n//\n// `published` and `modified` are unused parameters that are populated when generating a script from existing achievements.\n//\n// `type` specifies the classification of the achievement. Valid values are:\n//\n// | value | type |\n// | ---- | ---- |\n// | `\"\"` | Standard (unflagged) |\n// | `\"missable\"` | Missable |\n// | `\"progression\"` | Progression |\n// | `\"win_condition\"` | Win condition |\n//\n// #### Example\n//\n// ```rascript\n// function current_board() => byte(0x0088)\n// function current_player() => byte(0x008C)\n// function trigger_win_game() => current_board() == 0x8B && current_player() == 0\n// \n// achievement(\n//     title = \"Score!\", description = \"Win a game with at least 600 points\", points = 25,\n//     trigger = trigger_win_game() && byte(0x0573) >= 0xF6 // 0x0573 is hundreds place of score\n// )\n// ```\n//\n// First, a couple of helper functions are defined to make the code easier to read. \n// Because all functions are inlined and evaluated on use, this expands to:\n//\n// ```rascript\n// trigger = byte(0x0088) == 0x8B && byte(0x008C) == 0 && byte(0x0573) >= 0xF6\n// ```", "https://github.com/Jamiras/RATools/wiki/Achievement-Functions", "title", "description", "points", "trigger", "id", "published", "modified", "badge", "type"),
                // newHoverText("rich_presence_display", "// Parameters:\n//\n// `format_string` - the format string template\n//\n// `parameters` - (Optional) the list of replacement values\n//\n// Defines the rich presence display string.\n// Only one string may be defined per script.\n// If this function is called multiple times, the last one will win.\n//\n// `format_string` is a string with zero or more placeholders that will be evaluated by the emulator at runtime.\n// It uses the same syntax as the [`format`](https://github.com/Jamiras/RATools/wiki/Built-in-Functions#formatformat_string-parameters) function.\n//\n// For each placeholder a parameter must be defined using a `rich_presence_value` or `rich_presence_lookup` function.", "https://github.com/Jamiras/RATools/wiki/Rich-Presence-Functions#rich_presence_displayformat_string-parameters", "format_string", "parameters"),
                // newHoverText("rich_presence_value", "// Parameters:\n//\n// `name` - placeholder name\n//\n// `expression` - value to uses\n//\n// `format` - (Optional) format to display the value\n//\n// `name` is the name to associate to the placeholder.\n//\n// ---\n//\n// `expression` is a [memory accessor](https://github.com/Jamiras/RATools/wiki/Accessing-Memory), [arithmetic expression](https://github.com/Jamiras/RATools/wiki/Operators#arithmetic-operations), or a function that evaluates to a memory accessor or arithmetic expression.\n//\n// `format` is one of the following:\n//\n// * `VALUE` - number (default)\n//\n// * `SECS` - the value is a number of seconds that should be formatted as `MM:SS`\n//\n// * `FRAMES` - the value is a number of frames that should be converted to seconds and displayed as `MM:SS`\n//\n// * `POINTS` - the value should be displayed as a six digit score value followed by the word 'POINTS'\n//\n// * `MILLISECS` - the value is a number of hundredths of a second and will be displayed as `MM:SS.FF`\n//\n// * `MINUTES` - the value is a number of minutes that should be formatted as `HHhMM`\n//\n// * `SECS_AS_MINS` - the value is a number of seconds that should be formatted as `HHhMM`\n//\n// * `FLOAT1` ... `FLOAT6` - the value is formatted to N digits after the decimal (FLOAT1 = 1 digit after the decimal, FLOAT3 = 3 digits after the decimal, etc).\n//\n// * `FIXED1` ... `FIXED3` - the value is formatted with a decimal point N spaces from the end (FIXED1 = 1 digit after the decimal).\n//\n// * `TENS`, `HUNDREDS`, `THOUSANDS` - the value is padded with additional 0s after the end of the value.", "https://github.com/Jamiras/RATools/wiki/Rich-Presence-Functions#rich_presence_valuename-expression-format", "name", "expression", "format"),
                // newHoverText("rich_presence_lookup", "// `name` is the name to associate to the placeholder. \n//\n// `expression` is a memory accessor, arithmetic expression, or a function that evaluates to a memory accessor or arithmetic expression.\n//\n// `dictionary` is the [key to value map](https://github.com/Jamiras/RATools/wiki/Variables#dictionaries) used to convert the result of `expression` into a string.\n//\n// `fallback` is an optional parameter that tells the display string what to display if the value isn't found in the dictionary. If not specified, empty string \"\" will be displayed when a value is not found in the dictionary.\n//\n// #### Example\n//\n// ```rascript\n// function lives() => byte(0x05D4) + 1\n// function stage() => byte(0x003A)\n//\n// stages = { 1: \"Downtown\", 2: \"Sewers\" }\n//\n// rich_presence_display(\"{0}, {1} lives\",\n//     rich_presence_lookup(\"Stage\", stage(), stages),\n//     rich_presence_value(\"Lives\", lives())\n// )\n// ```", "https://github.com/Jamiras/RATools/wiki/Rich-Presence-Functions#rich_presence_lookupname-expression-dictionary-fallback", "name", "expression", "dictionary", "fallback"),
                // newHoverText("rich_presence_ascii_string_lookup", "// Creates a unique mapping from the keys of `dictionary` to match an ASCII string at `address` and constructs a rich presence lookup.\n//\n// `name` is the name to associate to the placeholder. \n//\n// `address` is the address of the ASCII string. If a memory accessor is passed, it's assumed to be a pointer to the ASCII string.\n//\n// `dictionary` is the key to value map used to map the ASCII string at `address` to a display string.\n//\n// `fallback` is an optional parameter that tells the display string what to display if the ASCII string isn't found in the dictionary. If not specified, empty string \"\" will be displayed when a value is not found in the dictionary.\n//\n// #### Example\n//\n// ```rascript\n// function lives() => byte(0x05D4) + 1\n// function stage_buffer_address() => 0x003A // 8-byte ASCII string\n//\n// stages = { \"LVL_DTWN\": \"Downtown\", \"LVL_SWRS\": \"Sewers\" }\n//\n// rich_presence_display(\"{0}, {1} lives\",\n//     rich_presence_ascii_string_lookup(\"Stage\", stage_buffer_address(), stages),\n//     rich_presence_value(\"Lives\", lives())\n// )\n// ```", "https://github.com/Jamiras/RATools/wiki/Rich-Presence-Functions#rich_presence_ascii_string_lookupname-address-dictionary-fallback", "name", "address", "dictionary", "fallback"),
                // newHoverText("rich_presence_macro", "//`macro` is the name of the built-in macro to use.\n//\n// * `Number` - number (default)\n//\n// * `Score` - number padded with leading 0s to 6 digits\n//\n// * `Seconds` - the value is a number of seconds that should be formatted as `MM:SS`\n//\n// * `Centiseconds` - the value is a number of hundredths of a second and will be displayed as `MM:SS.FF`\n//\n// * `Minutes` - the value is a number of minutes that should be formatted as `HHhMM`\n//\n// * `ASCIIChar` - the value is converted to a character using the ASCII lookup table\n//\n// * `UnicodeChar` - the value is converted to a character using the UCS2 (16-bit unicode) lookup table\n//\n// * `Float1` ... `Float6` - the value is formatted to N digits after the decimal (Float1 = 1 digit after the decimal, Float3 = 3 digits after the decimal, etc).\n//\n// * `Fixed1` ... `Fixed3` - the value is formatted with a decimal point N spaces from the end (Fixed1 = 1 digit after the decimal).\n//\n// `expression` is a [memory accessor](https://github.com/Jamiras/RATools/wiki/Accessing-Memory), [arithmetic expression](https://github.com/Jamiras/RATools/wiki/Operators#arithmetic-operations), or a function that evaluates to a memory accessor or arithmetic expression.", "https://github.com/Jamiras/RATools/wiki/Rich-Presence-Functions#rich_presence_macromacro-expression", "macro", "expression"),
                // newHoverText("rich_presence_conditional_display", "// Defines a conditional rich presence display string.\n// When executing the rich presence script, each `condition` is examined in order.\n// If a condition is matched, that display string will be used.\n// If no conditions are matched, the default display string will be used.\n// You must still provide a default display string by calling `rich_presence_display`.\n//\n// This function has the same structure as `rich_presence_display` with the additional `condition` parameter.\n// `condition` must evaluate to one or more [comparisons](https://github.com/Jamiras/RATools/wiki/Operators#comparisons).\n//\n// #### Example\n//\n// ```rascript\n// rich_presence_conditional_display(is_title_screen(), \"Title Screen\")\n// rich_presence_display(\"Playing Battle {0} in {1}\", \n//     rich_presence_value(\"Battle\", current_level()),\n//     rich_presence_lookup(\"Landscape\", current_landscape(), landscapes)\n// )\n// ```\n//\n// **NOTE**: To actually publish the script, you have to copy the script definition to the clipboard (there's a link on the viewer for the rich presence) and paste it into the appropriate field on the website.", "https://github.com/Jamiras/RATools/wiki/Rich-Presence-Functions#rich_presence_conditional_displaycondition-format_string-parameters", "condition", "format_String", "parameters"),
                // newHoverText("leaderboard", "// Defines a leaderboard. `title` and `description` must be strings.\n//\n// `start`, `cancel`, and `submit` are trigger expressions similar to the [`achievement`](https://github.com/Jamiras/RATools/wiki/Achievement-Functions)'s `trigger` parameter.\n//\n// `value` is a memory accessor, arithmetic expression, or a function that evaluates to a memory accessor or arithmetic expression.\n// Multiple values may be defined by encasing them in a `max_of(a, b, ...)` function.\n//\n// `format` is one of the following:\n//\n// * `VALUE` - number (default)\n//\n// * `SECS` - the value is a number of seconds that should be formatted as `MM:SS`\n//\n// * `FRAMES` - the value is divided by 60 and displayed as `MM:SS`\n//\n// * `POINTS` - the value should be displayed as a zero-padded six digit number\n//\n// * `MILLISECS` - the value is a number of hundredths of a second and will be displayed as `MM:SS.FF`\n//\n// * `MINUTES` - the value is a number of minutes that should be formatted as `HHhMM`\n//\n// * `SECS_AS_MINS` - the value is a number of seconds that should be formatted as `HHhMM`\n//\n// * `FLOAT1` ... `FLOAT6` - the value is formatted to N digits after the decimal (FLOAT1 = 1 digit after the decimal, FLOAT3 = 3 digits after the decimal, etc).\n//\n// * `FIXED1` ... `FIXED3` - the value is formatted with a decimal point N spaces from the end (FIXED1 = 1 digit after the decimal).\n//\n// * `TENS`, `HUNDREDS`, `THOUSANDS` - the value is padded with additional 0s after the end of the value.\n//\n//\n// if `lower_is_better` is `true`, lower scores will be ranked higher in the leaderboard.\n//\n// if `id` is provided when calling the `leaderboard` function, the script will generate a local leaderboard definition that the toolkit will merge into the existing leaderboard instead of putting as a separate local leaderboard.", "https://github.com/Jamiras/RATools/wiki/Leaderboard-Functions", "title", "description", "start", "cancel", "submit", "value", "format", "lower_is_better", "id"),
            ];
            for( let i = 0; i < builtinFunctionDefinitions.length; i++) {
                let fn = builtinFunctionDefinitions[i];
                let comment = fn.commentDoc.join("\n");
                words.push(newHoverText(fn.key, comment, fn.url, ...fn.args));
            }
            let text = document.getText();
            let m: RegExpExecArray | null;
            let functionDefinitions = new Map<string, vscode.Position>();
            while (m = G_FUNCTION_DEFINITION.exec(text)) {
                let pos = document.positionAt(m.index);
                functionDefinitions.set(m[2], pos);
                let comment = '';
                if( pos.line > 0 ) { // dont look for comments if were at the top of the file
                    let offset = 1;
                    // while not at the top of the file and the next line up is a comment
                    while(pos.line - offset >= 0) {
                        let line = document.lineAt(new vscode.Position(pos.line - offset, 0)).text;
                        let isComment = G_COMMENTS.test(line);
                        G_COMMENTS.lastIndex = 0; // POS js
                        if(isComment) {
                            comment = line + "\n" + comment;
                            offset = offset + 1;
                        } else {
                            break;
                        }
                    }
                }
                let args = m[3].split(",").map(s => s.trim());
                words.push(newHoverText(m[2], comment, "", ...args));
            }
            const range = document.getWordRangeAtPosition(position);
            const word = document.getText(range);

            for (let i = 0; i < words.length; i++) {
                if (words[i].key === word) {
                    return words[i].hover;
                }
            }
            return null;
        }
    });
    const autocomplete = vscode.languages.registerCompletionItemProvider(
        'rascript',
        {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
                let completionItems = [
                    newBuiltInFunction('byte'),
                    newBuiltInFunction('word'),
                    newBuiltInFunction('tbyte'),
                    newBuiltInFunction('dword'),
                    newBuiltInFunction('bit0'),
                    newBuiltInFunction('bit1'),
                    newBuiltInFunction('bit2'),
                    newBuiltInFunction('bit3'),
                    newBuiltInFunction('bit4'),
                    newBuiltInFunction('bit5'),
                    newBuiltInFunction('bit6'),
                    newBuiltInFunction('bit7'),
                    newBuiltInFunction('bit'),
                    newBuiltInFunction('low4'),
                    newBuiltInFunction('high4'),
                    newBuiltInFunction('bitcount'),
                    newBuiltInFunction('word_be'),
                    newBuiltInFunction('tbyte_be'),
                    newBuiltInFunction('dword_be'),
                    newBuiltInFunction('float'),
                    newBuiltInFunction('mbf32'),
                    newBuiltInFunction('mbf32_le'),
                    newBuiltInFunction('double32'),
                    newBuiltInFunction('double32_be'),
                    newBuiltInFunction('prev'),
                    newBuiltInFunction('prior'),
                    newBuiltInFunction('bcd'),
                    newBuiltInFunction("ascii_string_equals"),
                    newBuiltInFunction("unicode_string_equals"),
                    newBuiltInFunction('repeated'),
                    newBuiltInFunction('once'),
                    newBuiltInFunction('tally'),
                    newBuiltInFunction('never'),
                    newBuiltInFunction('unless'),
                    newBuiltInFunction('measured'),
                    newBuiltInFunction('trigger_when'),
                    newBuiltInFunction('disable_when'),
                    newBuiltInFunction('always_true'),
                    newBuiltInFunction('always_false'),
                    newBuiltInFunction('format'),
                    newBuiltInFunction('substring'),
                    newBuiltInFunction('length'),
                    newBuiltInFunction('range'),
                    newBuiltInFunction('array_map'),
                    newBuiltInFunction('array_contains'),
                    newBuiltInFunction('array_push'),
                    newBuiltInFunction('array_pop'),
                    newBuiltInFunction('dictionary_contains_key'),
                    newBuiltInFunction('any_of'),
                    newBuiltInFunction('all_of'),
                    newBuiltInFunction('none_of'),
                    newBuiltInFunction('sum_of'),
                    newBuiltInFunction('tally_of'),
                    newBuiltInFunction('assert'),
                    newBuiltInFunction('achievement'),
                    newBuiltInFunction('rich_presence_display'),
                    newBuiltInFunction('rich_presence_value'),
                    newBuiltInFunction('rich_presence_lookup'),
                    newBuiltInFunction('rich_presence_ascii_string_lookup'),
                    newBuiltInFunction('rich_presence_macro'),
                    newBuiltInFunction('rich_presence_conditional_display'),
                    newBuiltInFunction('leaderboard')
                ];
                let text = document.getText();
                let m: RegExpExecArray | null;
                while (m = G_FUNCTION_DEFINITION.exec(text)) {
                    completionItems.push(newBuiltInFunction(m[2]));
                }
                while (m = G_VARIABLES.exec(text)) {
                    completionItems.push(newVariable(m[1]));
                }

                return completionItems;
            }
        }
    );

    context.subscriptions.push(autocomplete, hover, definitions);
}

function newBuiltInFunction(name: string) {
    const snippetCompletion = new vscode.CompletionItem(name);
    snippetCompletion.insertText = new vscode.SnippetString(name + '()');
    snippetCompletion.kind = vscode.CompletionItemKind.Function;
    const moveCursorCommand: vscode.Command = {
        title: "Move cursor left between parentheses",
        command: "cursorLeft"
    };
            
    snippetCompletion.command = moveCursorCommand;
    return snippetCompletion;
}

function newVariable(name: string) {
    const snippetCompletion = new vscode.CompletionItem(name, vscode.CompletionItemKind.Variable);

    return snippetCompletion;
}

interface HoverData {
    key: string;
    hover: vscode.Hover;
}

function newHoverText(key: string, text: string, docUrl: string, ...args: string[]): HoverData {
    let argStr = args.join(", ");
    let commentLines = text.split(/\r?\n/);
    let lines = [
        `\`\`\`rascript\nfunction ${key}(${argStr})\n\`\`\``
    ];
    if( text !== '') {
        lines.push('---');
        let curr = '';
        let codeBlock = false;
        for (let i = 0; i < commentLines.length; i++) {
            let line = commentLines[i].replace(/^\/\//g, "");
            if (line.startsWith(' ')) {
                line = line.substring(1);
            }
            if (line.startsWith('```')) {
                codeBlock = !codeBlock;
                if(codeBlock) {
                    curr = line;
                } else {
                    curr = curr + "\n" + line;
                    lines.push(curr);
                    curr = '';
                }
                continue;
            }
            if (line.startsWith('|')) {
                line = line + "\n";
            }
            if(codeBlock) {
                curr = curr + "\n" + line;
            } else {
                if( line === '' ) {
                    lines.push(curr);
                    curr = '';
                } else {
                    curr = curr + " " + line;
                }
            }
        }
        if( curr !== '' ) {
            lines.push(curr);
        }
        if( codeBlock ) {
            lines.push('```');
        }
    }
    if( docUrl !== '') {
        lines.push('---');
        lines.push(`[Wiki link for \`${key}()\`](${docUrl})`);
    }

    return {
        key: key,
        hover: new vscode.Hover(lines)
    };
}