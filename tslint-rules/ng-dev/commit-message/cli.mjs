"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCommitMessageParser = void 0;
const cli_1 = require("./restore-commit-message/cli");
const cli_2 = require("./validate-file/cli");
const cli_3 = require("./validate-range/cli");
/** Build the parser for the commit-message commands. */
function buildCommitMessageParser(localYargs) {
    return localYargs
        .help()
        .strict()
        .command(cli_1.RestoreCommitMessageModule)
        .command(cli_2.ValidateFileModule)
        .command(cli_3.ValidateRangeModule);
}
exports.buildCommitMessageParser = buildCommitMessageParser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbmctZGV2L2NvbW1pdC1tZXNzYWdlL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFTQSxzREFBd0U7QUFDeEUsNkNBQXVEO0FBQ3ZELDhDQUF5RDtBQUV6RCx3REFBd0Q7QUFDeEQsU0FBZ0Isd0JBQXdCLENBQUMsVUFBc0I7SUFDN0QsT0FBTyxVQUFVO1NBQ2QsSUFBSSxFQUFFO1NBQ04sTUFBTSxFQUFFO1NBQ1IsT0FBTyxDQUFDLGdDQUEwQixDQUFDO1NBQ25DLE9BQU8sQ0FBQyx3QkFBa0IsQ0FBQztTQUMzQixPQUFPLENBQUMseUJBQW1CLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBUEQsNERBT0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAqIGFzIHlhcmdzIGZyb20gJ3lhcmdzJztcblxuaW1wb3J0IHtSZXN0b3JlQ29tbWl0TWVzc2FnZU1vZHVsZX0gZnJvbSAnLi9yZXN0b3JlLWNvbW1pdC1tZXNzYWdlL2NsaSc7XG5pbXBvcnQge1ZhbGlkYXRlRmlsZU1vZHVsZX0gZnJvbSAnLi92YWxpZGF0ZS1maWxlL2NsaSc7XG5pbXBvcnQge1ZhbGlkYXRlUmFuZ2VNb2R1bGV9IGZyb20gJy4vdmFsaWRhdGUtcmFuZ2UvY2xpJztcblxuLyoqIEJ1aWxkIHRoZSBwYXJzZXIgZm9yIHRoZSBjb21taXQtbWVzc2FnZSBjb21tYW5kcy4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZENvbW1pdE1lc3NhZ2VQYXJzZXIobG9jYWxZYXJnczogeWFyZ3MuQXJndikge1xuICByZXR1cm4gbG9jYWxZYXJnc1xuICAgIC5oZWxwKClcbiAgICAuc3RyaWN0KClcbiAgICAuY29tbWFuZChSZXN0b3JlQ29tbWl0TWVzc2FnZU1vZHVsZSlcbiAgICAuY29tbWFuZChWYWxpZGF0ZUZpbGVNb2R1bGUpXG4gICAgLmNvbW1hbmQoVmFsaWRhdGVSYW5nZU1vZHVsZSk7XG59XG4iXX0=