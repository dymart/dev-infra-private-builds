(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/dev-infra-private/commit-message/validate-range", ["require", "exports", "shelljs", "@angular/dev-infra-private/commit-message/validate"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var shelljs_1 = require("shelljs");
    var validate_1 = require("@angular/dev-infra-private/commit-message/validate");
    // Whether the provided commit is a fixup commit.
    var isNonFixup = function (m) { return !validate_1.parseCommitMessage(m).isFixup; };
    // Extracts commit header (first line of commit message).
    var extractCommitHeader = function (m) { return validate_1.parseCommitMessage(m).header; };
    /** Validate all commits in a provided git commit range. */
    function validateCommitRange(range) {
        // A random value is used as a string to allow for a definite split point in the git log result.
        var randomValueSeparator = "" + Math.random();
        // Custom git log format that provides the commit header and body, separated as expected with
        // the custom separator as the trailing value.
        var gitLogFormat = "%s%n%n%b" + randomValueSeparator;
        // Retrieve the commits in the provided range.
        var result = shelljs_1.exec("git log --reverse --format=" + gitLogFormat + " " + range, { silent: true });
        if (result.code) {
            throw new Error("Failed to get all commits in the range: \n  " + result.stderr);
        }
        // Separate the commits from a single string into individual commits
        var commits = result.split(randomValueSeparator).map(function (l) { return l.trim(); }).filter(function (line) { return !!line; });
        console.info("Examining " + commits.length + " commit(s) in the provided range: " + range);
        // Check each commit in the commit range.  Commits are allowed to be fixup commits for other
        // commits in the provided commit range.
        var allCommitsInRangeValid = commits.every(function (m, i) {
            var options = {
                disallowSquash: true,
                nonFixupCommitHeaders: isNonFixup(m) ?
                    undefined :
                    commits.slice(0, i).filter(isNonFixup).map(extractCommitHeader)
            };
            return validate_1.validateCommitMessage(m, options);
        });
        if (allCommitsInRangeValid) {
            console.info('√  All commit messages in range valid.');
        }
        else {
            // Exit with a non-zero exit code if invalid commit messages have
            // been discovered.
            process.exit(1);
        }
    }
    exports.validateCommitRange = validateCommitRange;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUtcmFuZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9kZXYtaW5mcmEvY29tbWl0LW1lc3NhZ2UvdmFsaWRhdGUtcmFuZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCxtQ0FBNkI7SUFDN0IsK0VBQW1HO0lBRW5HLGlEQUFpRDtJQUNqRCxJQUFNLFVBQVUsR0FBRyxVQUFDLENBQVMsSUFBSyxPQUFBLENBQUMsNkJBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUE5QixDQUE4QixDQUFDO0lBRWpFLHlEQUF5RDtJQUN6RCxJQUFNLG1CQUFtQixHQUFHLFVBQUMsQ0FBUyxJQUFLLE9BQUEsNkJBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUE1QixDQUE0QixDQUFDO0lBRXhFLDJEQUEyRDtJQUMzRCxTQUFnQixtQkFBbUIsQ0FBQyxLQUFhO1FBQy9DLGdHQUFnRztRQUNoRyxJQUFNLG9CQUFvQixHQUFHLEtBQUcsSUFBSSxDQUFDLE1BQU0sRUFBSSxDQUFDO1FBQ2hELDZGQUE2RjtRQUM3Riw4Q0FBOEM7UUFDOUMsSUFBTSxZQUFZLEdBQUcsYUFBVyxvQkFBc0IsQ0FBQztRQUV2RCw4Q0FBOEM7UUFDOUMsSUFBTSxNQUFNLEdBQUcsY0FBSSxDQUFDLGdDQUE4QixZQUFZLFNBQUksS0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDM0YsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFO1lBQ2YsTUFBTSxJQUFJLEtBQUssQ0FBQyxpREFBK0MsTUFBTSxDQUFDLE1BQVEsQ0FBQyxDQUFDO1NBQ2pGO1FBRUQsb0VBQW9FO1FBQ3BFLElBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQVIsQ0FBUSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksRUFBTixDQUFNLENBQUMsQ0FBQztRQUU3RixPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWEsT0FBTyxDQUFDLE1BQU0sMENBQXFDLEtBQU8sQ0FBQyxDQUFDO1FBRXRGLDRGQUE0RjtRQUM1Rix3Q0FBd0M7UUFDeEMsSUFBTSxzQkFBc0IsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUM7WUFDaEQsSUFBTSxPQUFPLEdBQWlDO2dCQUM1QyxjQUFjLEVBQUUsSUFBSTtnQkFDcEIscUJBQXFCLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xDLFNBQVMsQ0FBQyxDQUFDO29CQUNYLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUM7YUFDcEUsQ0FBQztZQUNGLE9BQU8sZ0NBQXFCLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxzQkFBc0IsRUFBRTtZQUMxQixPQUFPLENBQUMsSUFBSSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7U0FDeEQ7YUFBTTtZQUNMLGlFQUFpRTtZQUNqRSxtQkFBbUI7WUFDbkIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNqQjtJQUNILENBQUM7SUFyQ0Qsa0RBcUNDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtleGVjfSBmcm9tICdzaGVsbGpzJztcbmltcG9ydCB7cGFyc2VDb21taXRNZXNzYWdlLCB2YWxpZGF0ZUNvbW1pdE1lc3NhZ2UsIFZhbGlkYXRlQ29tbWl0TWVzc2FnZU9wdGlvbnN9IGZyb20gJy4vdmFsaWRhdGUnO1xuXG4vLyBXaGV0aGVyIHRoZSBwcm92aWRlZCBjb21taXQgaXMgYSBmaXh1cCBjb21taXQuXG5jb25zdCBpc05vbkZpeHVwID0gKG06IHN0cmluZykgPT4gIXBhcnNlQ29tbWl0TWVzc2FnZShtKS5pc0ZpeHVwO1xuXG4vLyBFeHRyYWN0cyBjb21taXQgaGVhZGVyIChmaXJzdCBsaW5lIG9mIGNvbW1pdCBtZXNzYWdlKS5cbmNvbnN0IGV4dHJhY3RDb21taXRIZWFkZXIgPSAobTogc3RyaW5nKSA9PiBwYXJzZUNvbW1pdE1lc3NhZ2UobSkuaGVhZGVyO1xuXG4vKiogVmFsaWRhdGUgYWxsIGNvbW1pdHMgaW4gYSBwcm92aWRlZCBnaXQgY29tbWl0IHJhbmdlLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlQ29tbWl0UmFuZ2UocmFuZ2U6IHN0cmluZykge1xuICAvLyBBIHJhbmRvbSB2YWx1ZSBpcyB1c2VkIGFzIGEgc3RyaW5nIHRvIGFsbG93IGZvciBhIGRlZmluaXRlIHNwbGl0IHBvaW50IGluIHRoZSBnaXQgbG9nIHJlc3VsdC5cbiAgY29uc3QgcmFuZG9tVmFsdWVTZXBhcmF0b3IgPSBgJHtNYXRoLnJhbmRvbSgpfWA7XG4gIC8vIEN1c3RvbSBnaXQgbG9nIGZvcm1hdCB0aGF0IHByb3ZpZGVzIHRoZSBjb21taXQgaGVhZGVyIGFuZCBib2R5LCBzZXBhcmF0ZWQgYXMgZXhwZWN0ZWQgd2l0aFxuICAvLyB0aGUgY3VzdG9tIHNlcGFyYXRvciBhcyB0aGUgdHJhaWxpbmcgdmFsdWUuXG4gIGNvbnN0IGdpdExvZ0Zvcm1hdCA9IGAlcyVuJW4lYiR7cmFuZG9tVmFsdWVTZXBhcmF0b3J9YDtcblxuICAvLyBSZXRyaWV2ZSB0aGUgY29tbWl0cyBpbiB0aGUgcHJvdmlkZWQgcmFuZ2UuXG4gIGNvbnN0IHJlc3VsdCA9IGV4ZWMoYGdpdCBsb2cgLS1yZXZlcnNlIC0tZm9ybWF0PSR7Z2l0TG9nRm9ybWF0fSAke3JhbmdlfWAsIHtzaWxlbnQ6IHRydWV9KTtcbiAgaWYgKHJlc3VsdC5jb2RlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gZ2V0IGFsbCBjb21taXRzIGluIHRoZSByYW5nZTogXFxuICAke3Jlc3VsdC5zdGRlcnJ9YCk7XG4gIH1cblxuICAvLyBTZXBhcmF0ZSB0aGUgY29tbWl0cyBmcm9tIGEgc2luZ2xlIHN0cmluZyBpbnRvIGluZGl2aWR1YWwgY29tbWl0c1xuICBjb25zdCBjb21taXRzID0gcmVzdWx0LnNwbGl0KHJhbmRvbVZhbHVlU2VwYXJhdG9yKS5tYXAobCA9PiBsLnRyaW0oKSkuZmlsdGVyKGxpbmUgPT4gISFsaW5lKTtcblxuICBjb25zb2xlLmluZm8oYEV4YW1pbmluZyAke2NvbW1pdHMubGVuZ3RofSBjb21taXQocykgaW4gdGhlIHByb3ZpZGVkIHJhbmdlOiAke3JhbmdlfWApO1xuXG4gIC8vIENoZWNrIGVhY2ggY29tbWl0IGluIHRoZSBjb21taXQgcmFuZ2UuICBDb21taXRzIGFyZSBhbGxvd2VkIHRvIGJlIGZpeHVwIGNvbW1pdHMgZm9yIG90aGVyXG4gIC8vIGNvbW1pdHMgaW4gdGhlIHByb3ZpZGVkIGNvbW1pdCByYW5nZS5cbiAgY29uc3QgYWxsQ29tbWl0c0luUmFuZ2VWYWxpZCA9IGNvbW1pdHMuZXZlcnkoKG0sIGkpID0+IHtcbiAgICBjb25zdCBvcHRpb25zOiBWYWxpZGF0ZUNvbW1pdE1lc3NhZ2VPcHRpb25zID0ge1xuICAgICAgZGlzYWxsb3dTcXVhc2g6IHRydWUsXG4gICAgICBub25GaXh1cENvbW1pdEhlYWRlcnM6IGlzTm9uRml4dXAobSkgP1xuICAgICAgICAgIHVuZGVmaW5lZCA6XG4gICAgICAgICAgY29tbWl0cy5zbGljZSgwLCBpKS5maWx0ZXIoaXNOb25GaXh1cCkubWFwKGV4dHJhY3RDb21taXRIZWFkZXIpXG4gICAgfTtcbiAgICByZXR1cm4gdmFsaWRhdGVDb21taXRNZXNzYWdlKG0sIG9wdGlvbnMpO1xuICB9KTtcblxuICBpZiAoYWxsQ29tbWl0c0luUmFuZ2VWYWxpZCkge1xuICAgIGNvbnNvbGUuaW5mbygn4oiaICBBbGwgY29tbWl0IG1lc3NhZ2VzIGluIHJhbmdlIHZhbGlkLicpO1xuICB9IGVsc2Uge1xuICAgIC8vIEV4aXQgd2l0aCBhIG5vbi16ZXJvIGV4aXQgY29kZSBpZiBpbnZhbGlkIGNvbW1pdCBtZXNzYWdlcyBoYXZlXG4gICAgLy8gYmVlbiBkaXNjb3ZlcmVkLlxuICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgfVxufVxuIl19