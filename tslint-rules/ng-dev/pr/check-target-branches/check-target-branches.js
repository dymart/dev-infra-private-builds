"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.printTargetBranchesForPr = void 0;
const config_1 = require("../../utils/config");
const console_1 = require("../../utils/console");
const git_client_1 = require("../../utils/git/git-client");
const config_2 = require("../config");
const target_label_1 = require("../common/targeting/target-label");
async function getTargetBranchesForPr(prNumber, config) {
    /** Repo owner and name for the github repository. */
    const { owner, name: repo } = config.github;
    /** The singleton instance of the GitClient. */
    const git = git_client_1.GitClient.get();
    /** The current state of the pull request from Github. */
    const prData = (await git.github.pulls.get({ owner, repo, pull_number: prNumber })).data;
    /** The list of labels on the PR as strings. */
    // Note: The `name` property of labels is always set but the Github OpenAPI spec is incorrect
    // here.
    // TODO(devversion): Remove the non-null cast once
    // https://github.com/github/rest-api-description/issues/169 is fixed.
    const labels = prData.labels.map((l) => l.name);
    /** The branch targetted via the Github UI. */
    const githubTargetBranch = prData.base.ref;
    // Note: We do not pass a list of commits here because we did not fetch this information
    // and the commits are only used for validation (which we can skip here).
    return (0, target_label_1.getTargetBranchesForPullRequest)(git.github, config, labels, githubTargetBranch, []);
}
async function printTargetBranchesForPr(prNumber) {
    const config = (0, config_1.getConfig)();
    (0, config_1.assertValidGithubConfig)(config);
    (0, config_2.assertValidPullRequestConfig)(config);
    if (config.pullRequest.noTargetLabeling) {
        (0, console_1.info)(`PR #${prNumber} will merge into: ${config.github.mainBranchName}`);
        return;
    }
    const targets = await getTargetBranchesForPr(prNumber, config);
    console_1.info.group(`PR #${prNumber} will merge into:`);
    targets.forEach((target) => (0, console_1.info)(`- ${target}`));
    console_1.info.groupEnd();
}
exports.printTargetBranchesForPr = printTargetBranchesForPr;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2stdGFyZ2V0LWJyYW5jaGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbmctZGV2L3ByL2NoZWNrLXRhcmdldC1icmFuY2hlcy9jaGVjay10YXJnZXQtYnJhbmNoZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsK0NBQW9GO0FBQ3BGLGlEQUF5QztBQUN6QywyREFBcUQ7QUFDckQsc0NBQTBFO0FBQzFFLG1FQUFpRjtBQUVqRixLQUFLLFVBQVUsc0JBQXNCLENBQ25DLFFBQWdCLEVBQ2hCLE1BQThEO0lBRTlELHFEQUFxRDtJQUNyRCxNQUFNLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQzFDLCtDQUErQztJQUMvQyxNQUFNLEdBQUcsR0FBRyxzQkFBUyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBRTVCLHlEQUF5RDtJQUN6RCxNQUFNLE1BQU0sR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUN2RiwrQ0FBK0M7SUFDL0MsNkZBQTZGO0lBQzdGLFFBQVE7SUFDUixrREFBa0Q7SUFDbEQsc0VBQXNFO0lBQ3RFLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSyxDQUFDLENBQUM7SUFDakQsOENBQThDO0lBQzlDLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7SUFFM0Msd0ZBQXdGO0lBQ3hGLHlFQUF5RTtJQUN6RSxPQUFPLElBQUEsOENBQStCLEVBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzdGLENBQUM7QUFFTSxLQUFLLFVBQVUsd0JBQXdCLENBQUMsUUFBZ0I7SUFDN0QsTUFBTSxNQUFNLEdBQUcsSUFBQSxrQkFBUyxHQUFFLENBQUM7SUFDM0IsSUFBQSxnQ0FBdUIsRUFBQyxNQUFNLENBQUMsQ0FBQztJQUNoQyxJQUFBLHFDQUE0QixFQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXJDLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN2QyxJQUFBLGNBQUksRUFBQyxPQUFPLFFBQVEscUJBQXFCLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztRQUN6RSxPQUFPO0tBQ1I7SUFFRCxNQUFNLE9BQU8sR0FBRyxNQUFNLHNCQUFzQixDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMvRCxjQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sUUFBUSxtQkFBbUIsQ0FBQyxDQUFDO0lBQy9DLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLElBQUEsY0FBSSxFQUFDLEtBQUssTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2pELGNBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNsQixDQUFDO0FBZEQsNERBY0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHthc3NlcnRWYWxpZEdpdGh1YkNvbmZpZywgZ2V0Q29uZmlnLCBHaXRodWJDb25maWd9IGZyb20gJy4uLy4uL3V0aWxzL2NvbmZpZyc7XG5pbXBvcnQge2luZm99IGZyb20gJy4uLy4uL3V0aWxzL2NvbnNvbGUnO1xuaW1wb3J0IHtHaXRDbGllbnR9IGZyb20gJy4uLy4uL3V0aWxzL2dpdC9naXQtY2xpZW50JztcbmltcG9ydCB7YXNzZXJ0VmFsaWRQdWxsUmVxdWVzdENvbmZpZywgUHVsbFJlcXVlc3RDb25maWd9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQge2dldFRhcmdldEJyYW5jaGVzRm9yUHVsbFJlcXVlc3R9IGZyb20gJy4uL2NvbW1vbi90YXJnZXRpbmcvdGFyZ2V0LWxhYmVsJztcblxuYXN5bmMgZnVuY3Rpb24gZ2V0VGFyZ2V0QnJhbmNoZXNGb3JQcihcbiAgcHJOdW1iZXI6IG51bWJlcixcbiAgY29uZmlnOiB7Z2l0aHViOiBHaXRodWJDb25maWc7IHB1bGxSZXF1ZXN0OiBQdWxsUmVxdWVzdENvbmZpZ30sXG4pIHtcbiAgLyoqIFJlcG8gb3duZXIgYW5kIG5hbWUgZm9yIHRoZSBnaXRodWIgcmVwb3NpdG9yeS4gKi9cbiAgY29uc3Qge293bmVyLCBuYW1lOiByZXBvfSA9IGNvbmZpZy5naXRodWI7XG4gIC8qKiBUaGUgc2luZ2xldG9uIGluc3RhbmNlIG9mIHRoZSBHaXRDbGllbnQuICovXG4gIGNvbnN0IGdpdCA9IEdpdENsaWVudC5nZXQoKTtcblxuICAvKiogVGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHB1bGwgcmVxdWVzdCBmcm9tIEdpdGh1Yi4gKi9cbiAgY29uc3QgcHJEYXRhID0gKGF3YWl0IGdpdC5naXRodWIucHVsbHMuZ2V0KHtvd25lciwgcmVwbywgcHVsbF9udW1iZXI6IHByTnVtYmVyfSkpLmRhdGE7XG4gIC8qKiBUaGUgbGlzdCBvZiBsYWJlbHMgb24gdGhlIFBSIGFzIHN0cmluZ3MuICovXG4gIC8vIE5vdGU6IFRoZSBgbmFtZWAgcHJvcGVydHkgb2YgbGFiZWxzIGlzIGFsd2F5cyBzZXQgYnV0IHRoZSBHaXRodWIgT3BlbkFQSSBzcGVjIGlzIGluY29ycmVjdFxuICAvLyBoZXJlLlxuICAvLyBUT0RPKGRldnZlcnNpb24pOiBSZW1vdmUgdGhlIG5vbi1udWxsIGNhc3Qgb25jZVxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZ2l0aHViL3Jlc3QtYXBpLWRlc2NyaXB0aW9uL2lzc3Vlcy8xNjkgaXMgZml4ZWQuXG4gIGNvbnN0IGxhYmVscyA9IHByRGF0YS5sYWJlbHMubWFwKChsKSA9PiBsLm5hbWUhKTtcbiAgLyoqIFRoZSBicmFuY2ggdGFyZ2V0dGVkIHZpYSB0aGUgR2l0aHViIFVJLiAqL1xuICBjb25zdCBnaXRodWJUYXJnZXRCcmFuY2ggPSBwckRhdGEuYmFzZS5yZWY7XG5cbiAgLy8gTm90ZTogV2UgZG8gbm90IHBhc3MgYSBsaXN0IG9mIGNvbW1pdHMgaGVyZSBiZWNhdXNlIHdlIGRpZCBub3QgZmV0Y2ggdGhpcyBpbmZvcm1hdGlvblxuICAvLyBhbmQgdGhlIGNvbW1pdHMgYXJlIG9ubHkgdXNlZCBmb3IgdmFsaWRhdGlvbiAod2hpY2ggd2UgY2FuIHNraXAgaGVyZSkuXG4gIHJldHVybiBnZXRUYXJnZXRCcmFuY2hlc0ZvclB1bGxSZXF1ZXN0KGdpdC5naXRodWIsIGNvbmZpZywgbGFiZWxzLCBnaXRodWJUYXJnZXRCcmFuY2gsIFtdKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHByaW50VGFyZ2V0QnJhbmNoZXNGb3JQcihwck51bWJlcjogbnVtYmVyKSB7XG4gIGNvbnN0IGNvbmZpZyA9IGdldENvbmZpZygpO1xuICBhc3NlcnRWYWxpZEdpdGh1YkNvbmZpZyhjb25maWcpO1xuICBhc3NlcnRWYWxpZFB1bGxSZXF1ZXN0Q29uZmlnKGNvbmZpZyk7XG5cbiAgaWYgKGNvbmZpZy5wdWxsUmVxdWVzdC5ub1RhcmdldExhYmVsaW5nKSB7XG4gICAgaW5mbyhgUFIgIyR7cHJOdW1iZXJ9IHdpbGwgbWVyZ2UgaW50bzogJHtjb25maWcuZ2l0aHViLm1haW5CcmFuY2hOYW1lfWApO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHRhcmdldHMgPSBhd2FpdCBnZXRUYXJnZXRCcmFuY2hlc0ZvclByKHByTnVtYmVyLCBjb25maWcpO1xuICBpbmZvLmdyb3VwKGBQUiAjJHtwck51bWJlcn0gd2lsbCBtZXJnZSBpbnRvOmApO1xuICB0YXJnZXRzLmZvckVhY2goKHRhcmdldCkgPT4gaW5mbyhgLSAke3RhcmdldH1gKSk7XG4gIGluZm8uZ3JvdXBFbmQoKTtcbn1cbiJdfQ==