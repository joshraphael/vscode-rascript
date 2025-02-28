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
    }
];