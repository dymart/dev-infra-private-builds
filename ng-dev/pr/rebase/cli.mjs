"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRebaseCommand = exports.buildRebaseCommand = void 0;
const github_yargs_1 = require("../../utils/git/github-yargs");
const index_1 = require("./index");
/** Builds the rebase pull request command. */
function buildRebaseCommand(yargs) {
    return github_yargs_1.addGithubTokenOption(yargs).positional('prNumber', { type: 'number', demandOption: true });
}
exports.buildRebaseCommand = buildRebaseCommand;
/** Handles the rebase pull request command. */
async function handleRebaseCommand({ prNumber, githubToken, }) {
    process.exitCode = await index_1.rebasePr(prNumber, githubToken);
}
exports.handleRebaseCommand = handleRebaseCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbmctZGV2L3ByL3JlYmFzZS9jbGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBSUgsK0RBQWtFO0FBRWxFLG1DQUFpQztBQVFqQyw4Q0FBOEM7QUFDOUMsU0FBZ0Isa0JBQWtCLENBQUMsS0FBVztJQUM1QyxPQUFPLG1DQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0FBQ2xHLENBQUM7QUFGRCxnREFFQztBQUVELCtDQUErQztBQUN4QyxLQUFLLFVBQVUsbUJBQW1CLENBQUMsRUFDeEMsUUFBUSxFQUNSLFdBQVcsR0FDcUI7SUFDaEMsT0FBTyxDQUFDLFFBQVEsR0FBRyxNQUFNLGdCQUFRLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFMRCxrREFLQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0FyZ3VtZW50cywgQXJndn0gZnJvbSAneWFyZ3MnO1xuXG5pbXBvcnQge2FkZEdpdGh1YlRva2VuT3B0aW9ufSBmcm9tICcuLi8uLi91dGlscy9naXQvZ2l0aHViLXlhcmdzJztcblxuaW1wb3J0IHtyZWJhc2VQcn0gZnJvbSAnLi9pbmRleCc7XG5cbi8qKiBUaGUgb3B0aW9ucyBhdmFpbGFibGUgdG8gdGhlIHJlYmFzZSBjb21tYW5kIHZpYSBDTEkuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlYmFzZUNvbW1hbmRPcHRpb25zIHtcbiAgZ2l0aHViVG9rZW46IHN0cmluZztcbiAgcHJOdW1iZXI6IG51bWJlcjtcbn1cblxuLyoqIEJ1aWxkcyB0aGUgcmViYXNlIHB1bGwgcmVxdWVzdCBjb21tYW5kLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkUmViYXNlQ29tbWFuZCh5YXJnczogQXJndik6IEFyZ3Y8UmViYXNlQ29tbWFuZE9wdGlvbnM+IHtcbiAgcmV0dXJuIGFkZEdpdGh1YlRva2VuT3B0aW9uKHlhcmdzKS5wb3NpdGlvbmFsKCdwck51bWJlcicsIHt0eXBlOiAnbnVtYmVyJywgZGVtYW5kT3B0aW9uOiB0cnVlfSk7XG59XG5cbi8qKiBIYW5kbGVzIHRoZSByZWJhc2UgcHVsbCByZXF1ZXN0IGNvbW1hbmQuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlUmViYXNlQ29tbWFuZCh7XG4gIHByTnVtYmVyLFxuICBnaXRodWJUb2tlbixcbn06IEFyZ3VtZW50czxSZWJhc2VDb21tYW5kT3B0aW9ucz4pIHtcbiAgcHJvY2Vzcy5leGl0Q29kZSA9IGF3YWl0IHJlYmFzZVByKHByTnVtYmVyLCBnaXRodWJUb2tlbik7XG59XG4iXX0=