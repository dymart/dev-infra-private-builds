"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveNextIntoReleaseCandidateAction = void 0;
const branch_off_next_branch_1 = require("./branch-off-next-branch");
/**
 * Release action that moves the next release-train into the release-candidate phase. This means
 * that a new version branch is created from the next branch, and the first release candidate
 * version is cut indicating the new phase.
 */
class MoveNextIntoReleaseCandidateAction extends branch_off_next_branch_1.BranchOffNextBranchBaseAction {
    constructor() {
        super(...arguments);
        this.newPhaseName = 'release-candidate';
    }
    static async isActive(active) {
        // Directly switching a next release-train into the `release-candidate`
        // phase is only allowed for minor releases. Major version always need to
        // go through the `feature-freeze` phase.
        return active.releaseCandidate === null && !active.next.isMajor;
    }
}
exports.MoveNextIntoReleaseCandidateAction = MoveNextIntoReleaseCandidateAction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW92ZS1uZXh0LWludG8tcmVsZWFzZS1jYW5kaWRhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9uZy1kZXYvcmVsZWFzZS9wdWJsaXNoL2FjdGlvbnMvbW92ZS1uZXh0LWludG8tcmVsZWFzZS1jYW5kaWRhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBSUgscUVBQXVFO0FBRXZFOzs7O0dBSUc7QUFDSCxNQUFhLGtDQUFtQyxTQUFRLHNEQUE2QjtJQUFyRjs7UUFDVyxpQkFBWSxHQUFHLG1CQUE0QixDQUFDO0lBUXZELENBQUM7SUFOQyxNQUFNLENBQVUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUEyQjtRQUN4RCx1RUFBdUU7UUFDdkUseUVBQXlFO1FBQ3pFLHlDQUF5QztRQUN6QyxPQUFPLE1BQU0sQ0FBQyxnQkFBZ0IsS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUNsRSxDQUFDO0NBQ0Y7QUFURCxnRkFTQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0FjdGl2ZVJlbGVhc2VUcmFpbnN9IGZyb20gJy4uLy4uL3ZlcnNpb25pbmcnO1xuXG5pbXBvcnQge0JyYW5jaE9mZk5leHRCcmFuY2hCYXNlQWN0aW9ufSBmcm9tICcuL2JyYW5jaC1vZmYtbmV4dC1icmFuY2gnO1xuXG4vKipcbiAqIFJlbGVhc2UgYWN0aW9uIHRoYXQgbW92ZXMgdGhlIG5leHQgcmVsZWFzZS10cmFpbiBpbnRvIHRoZSByZWxlYXNlLWNhbmRpZGF0ZSBwaGFzZS4gVGhpcyBtZWFuc1xuICogdGhhdCBhIG5ldyB2ZXJzaW9uIGJyYW5jaCBpcyBjcmVhdGVkIGZyb20gdGhlIG5leHQgYnJhbmNoLCBhbmQgdGhlIGZpcnN0IHJlbGVhc2UgY2FuZGlkYXRlXG4gKiB2ZXJzaW9uIGlzIGN1dCBpbmRpY2F0aW5nIHRoZSBuZXcgcGhhc2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBNb3ZlTmV4dEludG9SZWxlYXNlQ2FuZGlkYXRlQWN0aW9uIGV4dGVuZHMgQnJhbmNoT2ZmTmV4dEJyYW5jaEJhc2VBY3Rpb24ge1xuICBvdmVycmlkZSBuZXdQaGFzZU5hbWUgPSAncmVsZWFzZS1jYW5kaWRhdGUnIGFzIGNvbnN0O1xuXG4gIHN0YXRpYyBvdmVycmlkZSBhc3luYyBpc0FjdGl2ZShhY3RpdmU6IEFjdGl2ZVJlbGVhc2VUcmFpbnMpIHtcbiAgICAvLyBEaXJlY3RseSBzd2l0Y2hpbmcgYSBuZXh0IHJlbGVhc2UtdHJhaW4gaW50byB0aGUgYHJlbGVhc2UtY2FuZGlkYXRlYFxuICAgIC8vIHBoYXNlIGlzIG9ubHkgYWxsb3dlZCBmb3IgbWlub3IgcmVsZWFzZXMuIE1ham9yIHZlcnNpb24gYWx3YXlzIG5lZWQgdG9cbiAgICAvLyBnbyB0aHJvdWdoIHRoZSBgZmVhdHVyZS1mcmVlemVgIHBoYXNlLlxuICAgIHJldHVybiBhY3RpdmUucmVsZWFzZUNhbmRpZGF0ZSA9PT0gbnVsbCAmJiAhYWN0aXZlLm5leHQuaXNNYWpvcjtcbiAgfVxufVxuIl19