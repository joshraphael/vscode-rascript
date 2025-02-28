interface FunctionDefinition {
    key: string;
    url: string;
    args: string[];
    commentDoc: string[];
}

export const builtinFunctionDefinitions: readonly FunctionDefinition[] = [
    {
        key: "byte",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "address"
        ],
        commentDoc: [
            "// the 8-bit value at the specified address"
        ]
    },
    {
        key: "word",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "address"
        ],
        commentDoc: [
            "// the 16-bit value at the specified address"
        ]
    },
    {
        key: "tbyte",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "address"
        ],
        commentDoc: [
            "// the 24-bit value at the specified address"
        ]
    },
    {
        key: "dword",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "address"
        ],
        commentDoc: [
            "// the 32-bit value at the specified address"
        ]
    },
    {
        key: "bit0",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "address"
        ],
        commentDoc: [
            "// the least significant bit of the specified address"
        ]
    },
    {
        key: "bit1",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "address"
        ],
        commentDoc: [
            "// the second least significant bit of the specified address"
        ]
    },
    {
        key: "bit2",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "address"
        ],
        commentDoc: [
            "// the third least significant bit of the specified address"
        ]
    },
    {
        key: "bit3",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "address"
        ],
        commentDoc: [
            "// the fourth least significant bit of the specified address"
        ]
    },
    {
        key: "bit4",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "address"
        ],
        commentDoc: [
            "// the fifth least significant bit of the specified address"
        ]
    },
    {
        key: "bit5",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "address"
        ],
        commentDoc: [
            "// the sixth least significant bit of the specified address"
        ]
    },
    {
        key: "bit6",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "address"
        ],
        commentDoc: [
            "// the seventh least significant bit of the specified address"
        ]
    },
    {
        key: "bit7",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "address"
        ],
        commentDoc: [
            "// the most significant bit of the specified address"
        ]
    },
    {
        key: "bit",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "index",
            "address"
        ],
        commentDoc: [
            "// the `index`th bit of the specified address (`index` must be between 0 and 31)"
        ]
    },
    {
        key: "low4",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "address"
        ],
        commentDoc: [
            "// the four least significant bits of the specified address"
        ]
    },
    {
        key: "high4",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "address"
        ],
        commentDoc: [
            "// the four most significant bits of the specified address"
        ]
    },
    {
        key: "bitcount",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "address"
        ],
        commentDoc: [
            "// the number of non-zero bits at the specified address"
        ]
    },
    {
        key: "word_be",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "address"
        ],
        commentDoc: [
            "// the 16-bit big-endian value at the specified address"
        ]
    },
    {
        key: "tbyte_be",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "address"
        ],
        commentDoc: [
            "// the 24-bit big-endian value at the specified address"
        ]
    },
    {
        key: "dword_be",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "address"
        ],
        commentDoc: [
            "// the 32-bit big-endian value at the specified address"
        ]
    },
    {
        key: "float",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "address"
        ],
        commentDoc: [
            "// the 32-bit IEEE-754 floating point value at the specified address"
        ]
    },
    {
        key: "mbf32",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "address"
        ],
        commentDoc: [
            "// the 32-bit Microsoft Binary Format floating point value at the specified address"
        ]
    },
    {
        key: "mbf32_le",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "address"
        ],
        commentDoc: [
            "// the 32-bit Microsoft Binary Format floating point value (in little-endian form) at the specified address"
        ]
    },
    {
        key: "double32",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "address"
        ],
        commentDoc: [
            "// the 32 most significant bits of a 64-bit double at the specified address"
        ]
    },
    {
        key: "double32_be",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "address"
        ],
        commentDoc: [
            "// the 32 most significant bits of a 64-bit double (in big-endian form). Note: specified address should be offset for the most significant bits."
        ]
    },
    {
        key: "prev",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "accessor"
        ],
        commentDoc: [
            "// the value of the specified address from the previous frame"
        ]
    },
    {
        key: "prior",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "accessor"
        ],
        commentDoc: [
            "// the last differing value of the specified address"
        ]
    },
    {
        key: "bcd",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory",
        args: [
            "accessor"
        ],
        commentDoc: [
            "// converts a BCD-encoded value to decimal for leaderboard and rich presence values."
        ]
    },
    {
        key: "ascii_string_equals",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory#string-matching",
        args: [
            "address",
            "string",
            "length",
            "transform"
        ],
        commentDoc: [
            "// match memory to strings assuming they're encoded using ASCII (7-bit latin characters)",
            "//",
            "// Matches `length` characters starting at `address`.",
            "// If `length` is unspecified, the length of the string is used. ",
            "//",
            "// `transform` allows the caller to wrap the generated logic in `prev` or `prior` (i.e. `transform = a => prev(a)`).",
            "// The expression passed to the `transform` function may be multiple bytes (i.e. `dword(address)`) as the comparison is broken into chunks.",
            "//",
            "// ### Examples",
            "//",
            "// | Example | Returns | Notes |",
            "// | ------- | ------- | ----- |",
            "// | `ascii_string_equals(0x1234, \"Hi\")` | word(0x1234) == 0x6948 | Implicit length of string (2) used |",
            "// | `ascii_string_equals(0x1234, \"World\", 6)` | dword(0x1234) == 0x6c726f57 && word(0x1238) == 0x0064 | Explicit length includes null terminator |",
            "// | `ascii_string_equals(0x1234, \"World\", 6, transform= a=>prev(a))` | prev(dword(0x1234)) == 0x6c726f57 && prev(word(0x1238)) == 0x0064 | `transform` wraps each chunk |",
            "// | `ascii_string_equals(0x1234, \"World\", 3)` | tbyte(0x1234) == 0x726f57 | Explicit length only checks part of the string |",
            "// | `unicode_string_equals(0x1234, \"Hi\")` | dword(0x1234) == 0x00690048 | Unicode characters are 16-bits each |"
        ]
    },
    {
        key: "unicode_string_equals",
        url: "https://github.com/Jamiras/RATools/wiki/Accessing-Memory#string-matching",
        args: [
            "address",
            "string",
            "length",
            "transform"
        ],
        commentDoc: [
            "// match memory to strings assuming they're encoded using Unicode (16-bit international alphabets)",
            "//",
            "// Matches `length` characters starting at `address`.",
            "// If `length` is unspecified, the length of the string is used. ",
            "//",
            "// `transform` allows the caller to wrap the generated logic in `prev` or `prior` (i.e. `transform = a => prev(a)`).",
            "// The expression passed to the `transform` function may be multiple bytes (i.e. `dword(address)`) as the comparison is broken into chunks.",
            "//",
            "// ### Examples",
            "//",
            "// | Example | Returns | Notes |",
            "// | ------- | ------- | ----- |",
            "// | `ascii_string_equals(0x1234, \"Hi\")` | word(0x1234) == 0x6948 | Implicit length of string (2) used |",
            "// | `ascii_string_equals(0x1234, \"World\", 6)` | dword(0x1234) == 0x6c726f57 && word(0x1238) == 0x0064 | Explicit length includes null terminator |",
            "// | `ascii_string_equals(0x1234, \"World\", 6, transform= a=>prev(a))` | prev(dword(0x1234)) == 0x6c726f57 && prev(word(0x1238)) == 0x0064 | `transform` wraps each chunk |",
            "// | `ascii_string_equals(0x1234, \"World\", 3)` | tbyte(0x1234) == 0x726f57 | Explicit length only checks part of the string |",
            "// | `unicode_string_equals(0x1234, \"Hi\")` | dword(0x1234) == 0x00690048 | Unicode characters are 16-bits each |"
        ]
    }
];