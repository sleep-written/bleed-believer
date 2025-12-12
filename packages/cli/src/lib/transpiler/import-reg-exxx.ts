import { RegExxx } from '@lib/reg-exxx/index.js';

export class ImportRegExxx extends RegExxx {
    constructor() {
        const regExpName = /[a-z0-9_]+/;
        const namespaceExport = new RegExxx([
            /(\*\s+as\s+)?/,
            regExpName
        ]);

        const namedImports = new RegExxx([
            RegExxx.composite(
                [ namespaceExport, /\s*,\s+/ ],
                c => `(?:${c})?`
            ),
            /\{\s*/,
            new RegExxx([
                RegExxx.composite(
                    [ regExpName ],
                    c => `(?:${c})?`
                ),
                RegExxx.composite(
                    [ /,\s*/, regExpName ],
                    c => `(?:${c})*`
                )
            ]),
            /\s*\}/,
        ]);

        super(
            [
                RegExxx.parenthesis(
                    [ /(?:^|;)\s*/, /\s+/ ],
                    c => `(?<=${c})`
                ),
                /import/,
                /\s+/,
                RegExxx.composite(
                    [
                        RegExxx.parenthesis([
                            namespaceExport,
                            namedImports
                        ]),
                        /\s+/,
                        /from/,
                        /\s+/
                    ],
                    c => `(?:${c})?`
                ),

                new RegExxx(
                    [
                        '(?<quote>["\'])',
                        '(?<location>(?:\\\\.|(?!\\k<quote>).)+\\.(?:m|c)?t(?:sx?))',
                        '\\k<quote>'
                    ]
                ),

                RegExxx.parenthesis(
                    [ /\s*;\s*/, /(\s+|$)/ ],
                    c => `(?=${c})`
                )
            ],
            'gi'
        );
    }
}