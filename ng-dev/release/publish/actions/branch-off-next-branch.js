"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchOffNextBranchBaseAction = void 0;
const semver = require("semver");
const console_1 = require("../../../utils/console");
const semver_1 = require("../../../utils/semver");
const next_prerelease_version_1 = require("../../versioning/next-prerelease-version");
const actions_1 = require("../actions");
const commit_message_1 = require("../commit-message");
const constants_1 = require("../constants");
/**
 * Base action that can be used to move the next release-train into the feature-freeze or
 * release-candidate phase. This means that a new version branch is created from the next
 * branch, and a new pre-release (either RC or another `next`) is cut indicating the new phase.
 */
class BranchOffNextBranchBaseAction extends actions_1.ReleaseAction {
    async getDescription() {
        const { branchName } = this.active.next;
        const newVersion = await this._computeNewVersion();
        return `Move the "${branchName}" branch into ${this.newPhaseName} phase (v${newVersion}).`;
    }
    async perform() {
        const compareVersionForReleaseNotes = await (0, next_prerelease_version_1.getReleaseNotesCompareVersionForNext)(this.active, this.config);
        const newVersion = await this._computeNewVersion();
        const newBranch = `${newVersion.major}.${newVersion.minor}.x`;
        // Branch-off the next branch into a new version branch.
        await this._createNewVersionBranchFromNext(newBranch);
        // Stage the new version for the newly created branch, and push changes to a
        // fork in order to create a staging pull request. Note that we re-use the newly
        // created branch instead of re-fetching from the upstream.
        const { pullRequest, releaseNotes } = await this.stageVersionForBranchAndCreatePullRequest(newVersion, compareVersionForReleaseNotes, newBranch);
        // Wait for the staging PR to be merged. Then build and publish the feature-freeze next
        // pre-release. Finally, cherry-pick the release notes into the next branch in combination
        // with bumping the version to the next minor too.
        await this.waitForPullRequestToBeMerged(pullRequest);
        await this.buildAndPublish(releaseNotes, newBranch, 'next');
        await this._createNextBranchUpdatePullRequest(releaseNotes, newVersion);
    }
    /** Computes the new version for the release-train being branched-off. */
    async _computeNewVersion() {
        if (this.newPhaseName === 'feature-freeze') {
            return (0, next_prerelease_version_1.computeNewPrereleaseVersionForNext)(this.active, this.config);
        }
        else {
            return (0, semver_1.semverInc)(this.active.next.version, 'prerelease', 'rc');
        }
    }
    /** Creates a new version branch from the next branch. */
    async _createNewVersionBranchFromNext(newBranch) {
        const { branchName: nextBranch } = this.active.next;
        await this.verifyPassingGithubStatus(nextBranch);
        await this.checkoutUpstreamBranch(nextBranch);
        await this.createLocalBranchFromHead(newBranch);
        await this.pushHeadToRemoteBranch(newBranch);
        (0, console_1.info)((0, console_1.green)(`  ✓   Version branch "${newBranch}" created.`));
    }
    /**
     * Creates a pull request for the next branch that bumps the version to the next
     * minor, and cherry-picks the changelog for the newly branched-off release-candidate
     * or feature-freeze version.
     */
    async _createNextBranchUpdatePullRequest(releaseNotes, newVersion) {
        const { branchName: nextBranch, version } = this.active.next;
        // We increase the version for the next branch to the next minor. The team can decide
        // later if they want next to be a major through the `Configure Next as Major` release action.
        const newNextVersion = semver.parse(`${version.major}.${version.minor + 1}.0-next.0`);
        const bumpCommitMessage = (0, commit_message_1.getCommitMessageForExceptionalNextVersionBump)(newNextVersion);
        await this.checkoutUpstreamBranch(nextBranch);
        await this.updateProjectVersion(newNextVersion);
        // Create an individual commit for the next version bump. The changelog should go into
        // a separate commit that makes it clear where the changelog is cherry-picked from.
        await this.createCommit(bumpCommitMessage, [constants_1.packageJsonPath]);
        await this.prependReleaseNotesToChangelog(releaseNotes);
        const commitMessage = (0, commit_message_1.getReleaseNoteCherryPickCommitMessage)(releaseNotes.version);
        await this.createCommit(commitMessage, [constants_1.changelogPath]);
        let nextPullRequestMessage = `The previous "next" release-train has moved into the ` +
            `${this.newPhaseName} phase. This PR updates the next branch to the subsequent ` +
            `release-train.\n\nAlso this PR cherry-picks the changelog for ` +
            `v${newVersion} into the ${nextBranch} branch so that the changelog is up to date.`;
        const nextUpdatePullRequest = await this.pushChangesToForkAndCreatePullRequest(nextBranch, `next-release-train-${newNextVersion}`, `Update next branch to reflect new release-train "v${newNextVersion}".`, nextPullRequestMessage);
        (0, console_1.info)((0, console_1.green)(`  ✓   Pull request for updating the "${nextBranch}" branch has been created.`));
        (0, console_1.info)((0, console_1.yellow)(`      Please ask team members to review: ${nextUpdatePullRequest.url}.`));
    }
}
exports.BranchOffNextBranchBaseAction = BranchOffNextBranchBaseAction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJhbmNoLW9mZi1uZXh0LWJyYW5jaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25nLWRldi9yZWxlYXNlL3B1Ymxpc2gvYWN0aW9ucy9icmFuY2gtb2ZmLW5leHQtYnJhbmNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILGlDQUFpQztBQUVqQyxvREFBMkQ7QUFDM0Qsa0RBQWdEO0FBRWhELHNGQUdrRDtBQUNsRCx3Q0FBeUM7QUFDekMsc0RBRzJCO0FBQzNCLDRDQUE0RDtBQUU1RDs7OztHQUlHO0FBQ0gsTUFBc0IsNkJBQThCLFNBQVEsdUJBQWE7SUFVOUQsS0FBSyxDQUFDLGNBQWM7UUFDM0IsTUFBTSxFQUFDLFVBQVUsRUFBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ3RDLE1BQU0sVUFBVSxHQUFHLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDbkQsT0FBTyxhQUFhLFVBQVUsaUJBQWlCLElBQUksQ0FBQyxZQUFZLFlBQVksVUFBVSxJQUFJLENBQUM7SUFDN0YsQ0FBQztJQUVRLEtBQUssQ0FBQyxPQUFPO1FBQ3BCLE1BQU0sNkJBQTZCLEdBQUcsTUFBTSxJQUFBLDhEQUFvQyxFQUM5RSxJQUFJLENBQUMsTUFBTSxFQUNYLElBQUksQ0FBQyxNQUFNLENBQ1osQ0FBQztRQUNGLE1BQU0sVUFBVSxHQUFHLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDbkQsTUFBTSxTQUFTLEdBQUcsR0FBRyxVQUFVLENBQUMsS0FBSyxJQUFJLFVBQVUsQ0FBQyxLQUFLLElBQUksQ0FBQztRQUU5RCx3REFBd0Q7UUFDeEQsTUFBTSxJQUFJLENBQUMsK0JBQStCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFdEQsNEVBQTRFO1FBQzVFLGdGQUFnRjtRQUNoRiwyREFBMkQ7UUFDM0QsTUFBTSxFQUFDLFdBQVcsRUFBRSxZQUFZLEVBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyx5Q0FBeUMsQ0FDdEYsVUFBVSxFQUNWLDZCQUE2QixFQUM3QixTQUFTLENBQ1YsQ0FBQztRQUVGLHVGQUF1RjtRQUN2RiwwRkFBMEY7UUFDMUYsa0RBQWtEO1FBQ2xELE1BQU0sSUFBSSxDQUFDLDRCQUE0QixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzVELE1BQU0sSUFBSSxDQUFDLGtDQUFrQyxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQseUVBQXlFO0lBQ2pFLEtBQUssQ0FBQyxrQkFBa0I7UUFDOUIsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLGdCQUFnQixFQUFFO1lBQzFDLE9BQU8sSUFBQSw0REFBa0MsRUFBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNyRTthQUFNO1lBQ0wsT0FBTyxJQUFBLGtCQUFTLEVBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNoRTtJQUNILENBQUM7SUFFRCx5REFBeUQ7SUFDakQsS0FBSyxDQUFDLCtCQUErQixDQUFDLFNBQWlCO1FBQzdELE1BQU0sRUFBQyxVQUFVLEVBQUUsVUFBVSxFQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDbEQsTUFBTSxJQUFJLENBQUMseUJBQXlCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDakQsTUFBTSxJQUFJLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDOUMsTUFBTSxJQUFJLENBQUMseUJBQXlCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEQsTUFBTSxJQUFJLENBQUMsc0JBQXNCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDN0MsSUFBQSxjQUFJLEVBQUMsSUFBQSxlQUFLLEVBQUMseUJBQXlCLFNBQVMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNLLEtBQUssQ0FBQyxrQ0FBa0MsQ0FDOUMsWUFBMEIsRUFDMUIsVUFBeUI7UUFFekIsTUFBTSxFQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDM0QscUZBQXFGO1FBQ3JGLDhGQUE4RjtRQUM5RixNQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsS0FBSyxHQUFHLENBQUMsV0FBVyxDQUFFLENBQUM7UUFDdkYsTUFBTSxpQkFBaUIsR0FBRyxJQUFBLDhEQUE2QyxFQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRXhGLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlDLE1BQU0sSUFBSSxDQUFDLG9CQUFvQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRWhELHNGQUFzRjtRQUN0RixtRkFBbUY7UUFDbkYsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLENBQUMsMkJBQWUsQ0FBQyxDQUFDLENBQUM7UUFFOUQsTUFBTSxJQUFJLENBQUMsOEJBQThCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFeEQsTUFBTSxhQUFhLEdBQUcsSUFBQSxzREFBcUMsRUFBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFbEYsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxDQUFDLHlCQUFhLENBQUMsQ0FBQyxDQUFDO1FBRXhELElBQUksc0JBQXNCLEdBQ3hCLHVEQUF1RDtZQUN2RCxHQUFHLElBQUksQ0FBQyxZQUFZLDREQUE0RDtZQUNoRixnRUFBZ0U7WUFDaEUsSUFBSSxVQUFVLGFBQWEsVUFBVSw4Q0FBOEMsQ0FBQztRQUV0RixNQUFNLHFCQUFxQixHQUFHLE1BQU0sSUFBSSxDQUFDLHFDQUFxQyxDQUM1RSxVQUFVLEVBQ1Ysc0JBQXNCLGNBQWMsRUFBRSxFQUN0QyxxREFBcUQsY0FBYyxJQUFJLEVBQ3ZFLHNCQUFzQixDQUN2QixDQUFDO1FBRUYsSUFBQSxjQUFJLEVBQUMsSUFBQSxlQUFLLEVBQUMsd0NBQXdDLFVBQVUsNEJBQTRCLENBQUMsQ0FBQyxDQUFDO1FBQzVGLElBQUEsY0FBSSxFQUFDLElBQUEsZ0JBQU0sRUFBQyw0Q0FBNEMscUJBQXFCLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7Q0FDRjtBQTNHRCxzRUEyR0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgc2VtdmVyIGZyb20gJ3NlbXZlcic7XG5cbmltcG9ydCB7Z3JlZW4sIGluZm8sIHllbGxvd30gZnJvbSAnLi4vLi4vLi4vdXRpbHMvY29uc29sZSc7XG5pbXBvcnQge3NlbXZlckluY30gZnJvbSAnLi4vLi4vLi4vdXRpbHMvc2VtdmVyJztcbmltcG9ydCB7UmVsZWFzZU5vdGVzfSBmcm9tICcuLi8uLi9ub3Rlcy9yZWxlYXNlLW5vdGVzJztcbmltcG9ydCB7XG4gIGNvbXB1dGVOZXdQcmVyZWxlYXNlVmVyc2lvbkZvck5leHQsXG4gIGdldFJlbGVhc2VOb3Rlc0NvbXBhcmVWZXJzaW9uRm9yTmV4dCxcbn0gZnJvbSAnLi4vLi4vdmVyc2lvbmluZy9uZXh0LXByZXJlbGVhc2UtdmVyc2lvbic7XG5pbXBvcnQge1JlbGVhc2VBY3Rpb259IGZyb20gJy4uL2FjdGlvbnMnO1xuaW1wb3J0IHtcbiAgZ2V0Q29tbWl0TWVzc2FnZUZvckV4Y2VwdGlvbmFsTmV4dFZlcnNpb25CdW1wLFxuICBnZXRSZWxlYXNlTm90ZUNoZXJyeVBpY2tDb21taXRNZXNzYWdlLFxufSBmcm9tICcuLi9jb21taXQtbWVzc2FnZSc7XG5pbXBvcnQge2NoYW5nZWxvZ1BhdGgsIHBhY2thZ2VKc29uUGF0aH0gZnJvbSAnLi4vY29uc3RhbnRzJztcblxuLyoqXG4gKiBCYXNlIGFjdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIG1vdmUgdGhlIG5leHQgcmVsZWFzZS10cmFpbiBpbnRvIHRoZSBmZWF0dXJlLWZyZWV6ZSBvclxuICogcmVsZWFzZS1jYW5kaWRhdGUgcGhhc2UuIFRoaXMgbWVhbnMgdGhhdCBhIG5ldyB2ZXJzaW9uIGJyYW5jaCBpcyBjcmVhdGVkIGZyb20gdGhlIG5leHRcbiAqIGJyYW5jaCwgYW5kIGEgbmV3IHByZS1yZWxlYXNlIChlaXRoZXIgUkMgb3IgYW5vdGhlciBgbmV4dGApIGlzIGN1dCBpbmRpY2F0aW5nIHRoZSBuZXcgcGhhc2UuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCcmFuY2hPZmZOZXh0QnJhbmNoQmFzZUFjdGlvbiBleHRlbmRzIFJlbGVhc2VBY3Rpb24ge1xuICAvKipcbiAgICogUGhhc2Ugd2hpY2ggdGhlIHJlbGVhc2UtdHJhaW4gY3VycmVudGx5IGluIHRoZSBgbmV4dGAgcGhhc2Ugd2lsbCBtb3ZlIGludG8uXG4gICAqXG4gICAqIE5vdGUgdGhhdCB3ZSBvbmx5IGFsbG93IGZvciBhIG5leHQgdmVyc2lvbiB0byBicmFuY2ggaW50byBmZWF0dXJlLWZyZWV6ZSBvclxuICAgKiBkaXJlY3RseSBpbnRvIHRoZSByZWxlYXNlLWNhbmRpZGF0ZSBwaGFzZS4gQSBzdGFibGUgdmVyc2lvbiBjYW5ub3QgYmUgcmVsZWFzZWRcbiAgICogd2l0aG91dCByZWxlYXNlLWNhbmRpZGF0ZS5cbiAgICovXG4gIGFic3RyYWN0IG5ld1BoYXNlTmFtZTogJ2ZlYXR1cmUtZnJlZXplJyB8ICdyZWxlYXNlLWNhbmRpZGF0ZSc7XG5cbiAgb3ZlcnJpZGUgYXN5bmMgZ2V0RGVzY3JpcHRpb24oKSB7XG4gICAgY29uc3Qge2JyYW5jaE5hbWV9ID0gdGhpcy5hY3RpdmUubmV4dDtcbiAgICBjb25zdCBuZXdWZXJzaW9uID0gYXdhaXQgdGhpcy5fY29tcHV0ZU5ld1ZlcnNpb24oKTtcbiAgICByZXR1cm4gYE1vdmUgdGhlIFwiJHticmFuY2hOYW1lfVwiIGJyYW5jaCBpbnRvICR7dGhpcy5uZXdQaGFzZU5hbWV9IHBoYXNlICh2JHtuZXdWZXJzaW9ufSkuYDtcbiAgfVxuXG4gIG92ZXJyaWRlIGFzeW5jIHBlcmZvcm0oKSB7XG4gICAgY29uc3QgY29tcGFyZVZlcnNpb25Gb3JSZWxlYXNlTm90ZXMgPSBhd2FpdCBnZXRSZWxlYXNlTm90ZXNDb21wYXJlVmVyc2lvbkZvck5leHQoXG4gICAgICB0aGlzLmFjdGl2ZSxcbiAgICAgIHRoaXMuY29uZmlnLFxuICAgICk7XG4gICAgY29uc3QgbmV3VmVyc2lvbiA9IGF3YWl0IHRoaXMuX2NvbXB1dGVOZXdWZXJzaW9uKCk7XG4gICAgY29uc3QgbmV3QnJhbmNoID0gYCR7bmV3VmVyc2lvbi5tYWpvcn0uJHtuZXdWZXJzaW9uLm1pbm9yfS54YDtcblxuICAgIC8vIEJyYW5jaC1vZmYgdGhlIG5leHQgYnJhbmNoIGludG8gYSBuZXcgdmVyc2lvbiBicmFuY2guXG4gICAgYXdhaXQgdGhpcy5fY3JlYXRlTmV3VmVyc2lvbkJyYW5jaEZyb21OZXh0KG5ld0JyYW5jaCk7XG5cbiAgICAvLyBTdGFnZSB0aGUgbmV3IHZlcnNpb24gZm9yIHRoZSBuZXdseSBjcmVhdGVkIGJyYW5jaCwgYW5kIHB1c2ggY2hhbmdlcyB0byBhXG4gICAgLy8gZm9yayBpbiBvcmRlciB0byBjcmVhdGUgYSBzdGFnaW5nIHB1bGwgcmVxdWVzdC4gTm90ZSB0aGF0IHdlIHJlLXVzZSB0aGUgbmV3bHlcbiAgICAvLyBjcmVhdGVkIGJyYW5jaCBpbnN0ZWFkIG9mIHJlLWZldGNoaW5nIGZyb20gdGhlIHVwc3RyZWFtLlxuICAgIGNvbnN0IHtwdWxsUmVxdWVzdCwgcmVsZWFzZU5vdGVzfSA9IGF3YWl0IHRoaXMuc3RhZ2VWZXJzaW9uRm9yQnJhbmNoQW5kQ3JlYXRlUHVsbFJlcXVlc3QoXG4gICAgICBuZXdWZXJzaW9uLFxuICAgICAgY29tcGFyZVZlcnNpb25Gb3JSZWxlYXNlTm90ZXMsXG4gICAgICBuZXdCcmFuY2gsXG4gICAgKTtcblxuICAgIC8vIFdhaXQgZm9yIHRoZSBzdGFnaW5nIFBSIHRvIGJlIG1lcmdlZC4gVGhlbiBidWlsZCBhbmQgcHVibGlzaCB0aGUgZmVhdHVyZS1mcmVlemUgbmV4dFxuICAgIC8vIHByZS1yZWxlYXNlLiBGaW5hbGx5LCBjaGVycnktcGljayB0aGUgcmVsZWFzZSBub3RlcyBpbnRvIHRoZSBuZXh0IGJyYW5jaCBpbiBjb21iaW5hdGlvblxuICAgIC8vIHdpdGggYnVtcGluZyB0aGUgdmVyc2lvbiB0byB0aGUgbmV4dCBtaW5vciB0b28uXG4gICAgYXdhaXQgdGhpcy53YWl0Rm9yUHVsbFJlcXVlc3RUb0JlTWVyZ2VkKHB1bGxSZXF1ZXN0KTtcbiAgICBhd2FpdCB0aGlzLmJ1aWxkQW5kUHVibGlzaChyZWxlYXNlTm90ZXMsIG5ld0JyYW5jaCwgJ25leHQnKTtcbiAgICBhd2FpdCB0aGlzLl9jcmVhdGVOZXh0QnJhbmNoVXBkYXRlUHVsbFJlcXVlc3QocmVsZWFzZU5vdGVzLCBuZXdWZXJzaW9uKTtcbiAgfVxuXG4gIC8qKiBDb21wdXRlcyB0aGUgbmV3IHZlcnNpb24gZm9yIHRoZSByZWxlYXNlLXRyYWluIGJlaW5nIGJyYW5jaGVkLW9mZi4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfY29tcHV0ZU5ld1ZlcnNpb24oKSB7XG4gICAgaWYgKHRoaXMubmV3UGhhc2VOYW1lID09PSAnZmVhdHVyZS1mcmVlemUnKSB7XG4gICAgICByZXR1cm4gY29tcHV0ZU5ld1ByZXJlbGVhc2VWZXJzaW9uRm9yTmV4dCh0aGlzLmFjdGl2ZSwgdGhpcy5jb25maWcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc2VtdmVySW5jKHRoaXMuYWN0aXZlLm5leHQudmVyc2lvbiwgJ3ByZXJlbGVhc2UnLCAncmMnKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ3JlYXRlcyBhIG5ldyB2ZXJzaW9uIGJyYW5jaCBmcm9tIHRoZSBuZXh0IGJyYW5jaC4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfY3JlYXRlTmV3VmVyc2lvbkJyYW5jaEZyb21OZXh0KG5ld0JyYW5jaDogc3RyaW5nKSB7XG4gICAgY29uc3Qge2JyYW5jaE5hbWU6IG5leHRCcmFuY2h9ID0gdGhpcy5hY3RpdmUubmV4dDtcbiAgICBhd2FpdCB0aGlzLnZlcmlmeVBhc3NpbmdHaXRodWJTdGF0dXMobmV4dEJyYW5jaCk7XG4gICAgYXdhaXQgdGhpcy5jaGVja291dFVwc3RyZWFtQnJhbmNoKG5leHRCcmFuY2gpO1xuICAgIGF3YWl0IHRoaXMuY3JlYXRlTG9jYWxCcmFuY2hGcm9tSGVhZChuZXdCcmFuY2gpO1xuICAgIGF3YWl0IHRoaXMucHVzaEhlYWRUb1JlbW90ZUJyYW5jaChuZXdCcmFuY2gpO1xuICAgIGluZm8oZ3JlZW4oYCAg4pyTICAgVmVyc2lvbiBicmFuY2ggXCIke25ld0JyYW5jaH1cIiBjcmVhdGVkLmApKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgcHVsbCByZXF1ZXN0IGZvciB0aGUgbmV4dCBicmFuY2ggdGhhdCBidW1wcyB0aGUgdmVyc2lvbiB0byB0aGUgbmV4dFxuICAgKiBtaW5vciwgYW5kIGNoZXJyeS1waWNrcyB0aGUgY2hhbmdlbG9nIGZvciB0aGUgbmV3bHkgYnJhbmNoZWQtb2ZmIHJlbGVhc2UtY2FuZGlkYXRlXG4gICAqIG9yIGZlYXR1cmUtZnJlZXplIHZlcnNpb24uXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIF9jcmVhdGVOZXh0QnJhbmNoVXBkYXRlUHVsbFJlcXVlc3QoXG4gICAgcmVsZWFzZU5vdGVzOiBSZWxlYXNlTm90ZXMsXG4gICAgbmV3VmVyc2lvbjogc2VtdmVyLlNlbVZlcixcbiAgKSB7XG4gICAgY29uc3Qge2JyYW5jaE5hbWU6IG5leHRCcmFuY2gsIHZlcnNpb259ID0gdGhpcy5hY3RpdmUubmV4dDtcbiAgICAvLyBXZSBpbmNyZWFzZSB0aGUgdmVyc2lvbiBmb3IgdGhlIG5leHQgYnJhbmNoIHRvIHRoZSBuZXh0IG1pbm9yLiBUaGUgdGVhbSBjYW4gZGVjaWRlXG4gICAgLy8gbGF0ZXIgaWYgdGhleSB3YW50IG5leHQgdG8gYmUgYSBtYWpvciB0aHJvdWdoIHRoZSBgQ29uZmlndXJlIE5leHQgYXMgTWFqb3JgIHJlbGVhc2UgYWN0aW9uLlxuICAgIGNvbnN0IG5ld05leHRWZXJzaW9uID0gc2VtdmVyLnBhcnNlKGAke3ZlcnNpb24ubWFqb3J9LiR7dmVyc2lvbi5taW5vciArIDF9LjAtbmV4dC4wYCkhO1xuICAgIGNvbnN0IGJ1bXBDb21taXRNZXNzYWdlID0gZ2V0Q29tbWl0TWVzc2FnZUZvckV4Y2VwdGlvbmFsTmV4dFZlcnNpb25CdW1wKG5ld05leHRWZXJzaW9uKTtcblxuICAgIGF3YWl0IHRoaXMuY2hlY2tvdXRVcHN0cmVhbUJyYW5jaChuZXh0QnJhbmNoKTtcbiAgICBhd2FpdCB0aGlzLnVwZGF0ZVByb2plY3RWZXJzaW9uKG5ld05leHRWZXJzaW9uKTtcblxuICAgIC8vIENyZWF0ZSBhbiBpbmRpdmlkdWFsIGNvbW1pdCBmb3IgdGhlIG5leHQgdmVyc2lvbiBidW1wLiBUaGUgY2hhbmdlbG9nIHNob3VsZCBnbyBpbnRvXG4gICAgLy8gYSBzZXBhcmF0ZSBjb21taXQgdGhhdCBtYWtlcyBpdCBjbGVhciB3aGVyZSB0aGUgY2hhbmdlbG9nIGlzIGNoZXJyeS1waWNrZWQgZnJvbS5cbiAgICBhd2FpdCB0aGlzLmNyZWF0ZUNvbW1pdChidW1wQ29tbWl0TWVzc2FnZSwgW3BhY2thZ2VKc29uUGF0aF0pO1xuXG4gICAgYXdhaXQgdGhpcy5wcmVwZW5kUmVsZWFzZU5vdGVzVG9DaGFuZ2Vsb2cocmVsZWFzZU5vdGVzKTtcblxuICAgIGNvbnN0IGNvbW1pdE1lc3NhZ2UgPSBnZXRSZWxlYXNlTm90ZUNoZXJyeVBpY2tDb21taXRNZXNzYWdlKHJlbGVhc2VOb3Rlcy52ZXJzaW9uKTtcblxuICAgIGF3YWl0IHRoaXMuY3JlYXRlQ29tbWl0KGNvbW1pdE1lc3NhZ2UsIFtjaGFuZ2Vsb2dQYXRoXSk7XG5cbiAgICBsZXQgbmV4dFB1bGxSZXF1ZXN0TWVzc2FnZSA9XG4gICAgICBgVGhlIHByZXZpb3VzIFwibmV4dFwiIHJlbGVhc2UtdHJhaW4gaGFzIG1vdmVkIGludG8gdGhlIGAgK1xuICAgICAgYCR7dGhpcy5uZXdQaGFzZU5hbWV9IHBoYXNlLiBUaGlzIFBSIHVwZGF0ZXMgdGhlIG5leHQgYnJhbmNoIHRvIHRoZSBzdWJzZXF1ZW50IGAgK1xuICAgICAgYHJlbGVhc2UtdHJhaW4uXFxuXFxuQWxzbyB0aGlzIFBSIGNoZXJyeS1waWNrcyB0aGUgY2hhbmdlbG9nIGZvciBgICtcbiAgICAgIGB2JHtuZXdWZXJzaW9ufSBpbnRvIHRoZSAke25leHRCcmFuY2h9IGJyYW5jaCBzbyB0aGF0IHRoZSBjaGFuZ2Vsb2cgaXMgdXAgdG8gZGF0ZS5gO1xuXG4gICAgY29uc3QgbmV4dFVwZGF0ZVB1bGxSZXF1ZXN0ID0gYXdhaXQgdGhpcy5wdXNoQ2hhbmdlc1RvRm9ya0FuZENyZWF0ZVB1bGxSZXF1ZXN0KFxuICAgICAgbmV4dEJyYW5jaCxcbiAgICAgIGBuZXh0LXJlbGVhc2UtdHJhaW4tJHtuZXdOZXh0VmVyc2lvbn1gLFxuICAgICAgYFVwZGF0ZSBuZXh0IGJyYW5jaCB0byByZWZsZWN0IG5ldyByZWxlYXNlLXRyYWluIFwidiR7bmV3TmV4dFZlcnNpb259XCIuYCxcbiAgICAgIG5leHRQdWxsUmVxdWVzdE1lc3NhZ2UsXG4gICAgKTtcblxuICAgIGluZm8oZ3JlZW4oYCAg4pyTICAgUHVsbCByZXF1ZXN0IGZvciB1cGRhdGluZyB0aGUgXCIke25leHRCcmFuY2h9XCIgYnJhbmNoIGhhcyBiZWVuIGNyZWF0ZWQuYCkpO1xuICAgIGluZm8oeWVsbG93KGAgICAgICBQbGVhc2UgYXNrIHRlYW0gbWVtYmVycyB0byByZXZpZXc6ICR7bmV4dFVwZGF0ZVB1bGxSZXF1ZXN0LnVybH0uYCkpO1xuICB9XG59XG4iXX0=