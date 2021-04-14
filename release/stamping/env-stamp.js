/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/dev-infra-private/release/stamping/env-stamp", ["require", "exports", "path", "@angular/dev-infra-private/utils/config", "@angular/dev-infra-private/utils/shelljs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buildEnvStamp = void 0;
    var path_1 = require("path");
    var config_1 = require("@angular/dev-infra-private/utils/config");
    var shelljs_1 = require("@angular/dev-infra-private/utils/shelljs");
    /**
     * Log the environment variables expected by bazel for stamping.
     *
     * See the section on stamping in docs / BAZEL.md
     *
     * This script must be a NodeJS script in order to be cross-platform.
     * See https://github.com/bazelbuild/bazel/issues/5958
     * Note: git operations, especially git status, take a long time inside mounted docker volumes
     * in Windows or OSX hosts (https://github.com/docker/for-win/issues/188).
     */
    function buildEnvStamp(mode) {
        console.info("BUILD_SCM_BRANCH " + getCurrentBranch());
        console.info("BUILD_SCM_COMMIT_SHA " + getCurrentSha());
        console.info("BUILD_SCM_HASH " + getCurrentSha());
        console.info("BUILD_SCM_LOCAL_CHANGES " + hasLocalChanges());
        console.info("BUILD_SCM_USER " + getCurrentGitUser());
        console.info("BUILD_SCM_VERSION " + getSCMVersion(mode));
        process.exit(0);
    }
    exports.buildEnvStamp = buildEnvStamp;
    /** Run the exec command and return the stdout as a trimmed string. */
    function exec(cmd) {
        return shelljs_1.exec(cmd).trim();
    }
    /** Whether the repo has local changes. */
    function hasLocalChanges() {
        return !!exec("git status --untracked-files=no --porcelain");
    }
    /**
     * Get the version for generated packages.
     *
     * In snapshot mode, the version is based on the most recent semver tag.
     * In release mode, the version is based on the base package.json version.
     */
    function getSCMVersion(mode) {
        if (mode === 'release') {
            var packageJsonPath = path_1.join(config_1.getRepoBaseDir(), 'package.json');
            var version = require(packageJsonPath).version;
            return version;
        }
        if (mode === 'snapshot') {
            var version = exec("git describe --match [0-9]*.[0-9]*.[0-9]* --abbrev=7 --tags HEAD");
            return "" + version.replace(/-([0-9]+)-g/, '+$1.sha-') + (hasLocalChanges() ? '.with-local-changes' : '');
        }
        return '0.0.0';
    }
    /** Get the current SHA of HEAD. */
    function getCurrentSha() {
        return exec("git rev-parse HEAD");
    }
    /** Get the currently checked out branch. */
    function getCurrentBranch() {
        return exec("git symbolic-ref --short HEAD");
    }
    /** Get the current git user based on the git config. */
    function getCurrentGitUser() {
        var userName = exec("git config user.name");
        var userEmail = exec("git config user.email");
        return userName + " <" + userEmail + ">";
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52LXN0YW1wLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vZGV2LWluZnJhL3JlbGVhc2Uvc3RhbXBpbmcvZW52LXN0YW1wLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7OztJQUVILDZCQUEwQjtJQUUxQixrRUFBa0Q7SUFDbEQsb0VBQWtEO0lBSWxEOzs7Ozs7Ozs7T0FTRztJQUNILFNBQWdCLGFBQWEsQ0FBQyxJQUFrQjtRQUM5QyxPQUFPLENBQUMsSUFBSSxDQUFDLHNCQUFvQixnQkFBZ0IsRUFBSSxDQUFDLENBQUM7UUFDdkQsT0FBTyxDQUFDLElBQUksQ0FBQywwQkFBd0IsYUFBYSxFQUFJLENBQUMsQ0FBQztRQUN4RCxPQUFPLENBQUMsSUFBSSxDQUFDLG9CQUFrQixhQUFhLEVBQUksQ0FBQyxDQUFDO1FBQ2xELE9BQU8sQ0FBQyxJQUFJLENBQUMsNkJBQTJCLGVBQWUsRUFBSSxDQUFDLENBQUM7UUFDN0QsT0FBTyxDQUFDLElBQUksQ0FBQyxvQkFBa0IsaUJBQWlCLEVBQUksQ0FBQyxDQUFDO1FBQ3RELE9BQU8sQ0FBQyxJQUFJLENBQUMsdUJBQXFCLGFBQWEsQ0FBQyxJQUFJLENBQUcsQ0FBQyxDQUFDO1FBQ3pELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEIsQ0FBQztJQVJELHNDQVFDO0lBRUQsc0VBQXNFO0lBQ3RFLFNBQVMsSUFBSSxDQUFDLEdBQVc7UUFDdkIsT0FBTyxjQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELDBDQUEwQztJQUMxQyxTQUFTLGVBQWU7UUFDdEIsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLDZDQUE2QyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsU0FBUyxhQUFhLENBQUMsSUFBa0I7UUFDdkMsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO1lBQ3RCLElBQU0sZUFBZSxHQUFHLFdBQUksQ0FBQyx1QkFBYyxFQUFFLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDeEQsSUFBQSxPQUFPLEdBQUksT0FBTyxDQUFDLGVBQWUsQ0FBQyxRQUE1QixDQUE2QjtZQUMzQyxPQUFPLE9BQU8sQ0FBQztTQUNoQjtRQUNELElBQUksSUFBSSxLQUFLLFVBQVUsRUFBRTtZQUN2QixJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsa0VBQWtFLENBQUMsQ0FBQztZQUN6RixPQUFPLEtBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLEdBQ2hELENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUcsQ0FBQztTQUN4RDtRQUNELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxtQ0FBbUM7SUFDbkMsU0FBUyxhQUFhO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELDRDQUE0QztJQUM1QyxTQUFTLGdCQUFnQjtRQUN2QixPQUFPLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCx3REFBd0Q7SUFDeEQsU0FBUyxpQkFBaUI7UUFDeEIsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDOUMsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFFaEQsT0FBVSxRQUFRLFVBQUssU0FBUyxNQUFHLENBQUM7SUFDdEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2pvaW59IGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQge2dldFJlcG9CYXNlRGlyfSBmcm9tICcuLi8uLi91dGlscy9jb25maWcnO1xuaW1wb3J0IHtleGVjIGFzIF9leGVjfSBmcm9tICcuLi8uLi91dGlscy9zaGVsbGpzJztcblxuZXhwb3J0IHR5cGUgRW52U3RhbXBNb2RlID0gJ3NuYXBzaG90J3wncmVsZWFzZSc7XG5cbi8qKlxuICogTG9nIHRoZSBlbnZpcm9ubWVudCB2YXJpYWJsZXMgZXhwZWN0ZWQgYnkgYmF6ZWwgZm9yIHN0YW1waW5nLlxuICpcbiAqIFNlZSB0aGUgc2VjdGlvbiBvbiBzdGFtcGluZyBpbiBkb2NzIC8gQkFaRUwubWRcbiAqXG4gKiBUaGlzIHNjcmlwdCBtdXN0IGJlIGEgTm9kZUpTIHNjcmlwdCBpbiBvcmRlciB0byBiZSBjcm9zcy1wbGF0Zm9ybS5cbiAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9iYXplbC9pc3N1ZXMvNTk1OFxuICogTm90ZTogZ2l0IG9wZXJhdGlvbnMsIGVzcGVjaWFsbHkgZ2l0IHN0YXR1cywgdGFrZSBhIGxvbmcgdGltZSBpbnNpZGUgbW91bnRlZCBkb2NrZXIgdm9sdW1lc1xuICogaW4gV2luZG93cyBvciBPU1ggaG9zdHMgKGh0dHBzOi8vZ2l0aHViLmNvbS9kb2NrZXIvZm9yLXdpbi9pc3N1ZXMvMTg4KS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRW52U3RhbXAobW9kZTogRW52U3RhbXBNb2RlKSB7XG4gIGNvbnNvbGUuaW5mbyhgQlVJTERfU0NNX0JSQU5DSCAke2dldEN1cnJlbnRCcmFuY2goKX1gKTtcbiAgY29uc29sZS5pbmZvKGBCVUlMRF9TQ01fQ09NTUlUX1NIQSAke2dldEN1cnJlbnRTaGEoKX1gKTtcbiAgY29uc29sZS5pbmZvKGBCVUlMRF9TQ01fSEFTSCAke2dldEN1cnJlbnRTaGEoKX1gKTtcbiAgY29uc29sZS5pbmZvKGBCVUlMRF9TQ01fTE9DQUxfQ0hBTkdFUyAke2hhc0xvY2FsQ2hhbmdlcygpfWApO1xuICBjb25zb2xlLmluZm8oYEJVSUxEX1NDTV9VU0VSICR7Z2V0Q3VycmVudEdpdFVzZXIoKX1gKTtcbiAgY29uc29sZS5pbmZvKGBCVUlMRF9TQ01fVkVSU0lPTiAke2dldFNDTVZlcnNpb24obW9kZSl9YCk7XG4gIHByb2Nlc3MuZXhpdCgwKTtcbn1cblxuLyoqIFJ1biB0aGUgZXhlYyBjb21tYW5kIGFuZCByZXR1cm4gdGhlIHN0ZG91dCBhcyBhIHRyaW1tZWQgc3RyaW5nLiAqL1xuZnVuY3Rpb24gZXhlYyhjbWQ6IHN0cmluZykge1xuICByZXR1cm4gX2V4ZWMoY21kKS50cmltKCk7XG59XG5cbi8qKiBXaGV0aGVyIHRoZSByZXBvIGhhcyBsb2NhbCBjaGFuZ2VzLiAqL1xuZnVuY3Rpb24gaGFzTG9jYWxDaGFuZ2VzKCkge1xuICByZXR1cm4gISFleGVjKGBnaXQgc3RhdHVzIC0tdW50cmFja2VkLWZpbGVzPW5vIC0tcG9yY2VsYWluYCk7XG59XG5cbi8qKlxuICogR2V0IHRoZSB2ZXJzaW9uIGZvciBnZW5lcmF0ZWQgcGFja2FnZXMuXG4gKlxuICogSW4gc25hcHNob3QgbW9kZSwgdGhlIHZlcnNpb24gaXMgYmFzZWQgb24gdGhlIG1vc3QgcmVjZW50IHNlbXZlciB0YWcuXG4gKiBJbiByZWxlYXNlIG1vZGUsIHRoZSB2ZXJzaW9uIGlzIGJhc2VkIG9uIHRoZSBiYXNlIHBhY2thZ2UuanNvbiB2ZXJzaW9uLlxuICovXG5mdW5jdGlvbiBnZXRTQ01WZXJzaW9uKG1vZGU6IEVudlN0YW1wTW9kZSkge1xuICBpZiAobW9kZSA9PT0gJ3JlbGVhc2UnKSB7XG4gICAgY29uc3QgcGFja2FnZUpzb25QYXRoID0gam9pbihnZXRSZXBvQmFzZURpcigpLCAncGFja2FnZS5qc29uJyk7XG4gICAgY29uc3Qge3ZlcnNpb259ID0gcmVxdWlyZShwYWNrYWdlSnNvblBhdGgpO1xuICAgIHJldHVybiB2ZXJzaW9uO1xuICB9XG4gIGlmIChtb2RlID09PSAnc25hcHNob3QnKSB7XG4gICAgY29uc3QgdmVyc2lvbiA9IGV4ZWMoYGdpdCBkZXNjcmliZSAtLW1hdGNoIFswLTldKi5bMC05XSouWzAtOV0qIC0tYWJicmV2PTcgLS10YWdzIEhFQURgKTtcbiAgICByZXR1cm4gYCR7dmVyc2lvbi5yZXBsYWNlKC8tKFswLTldKyktZy8sICcrJDEuc2hhLScpfSR7XG4gICAgICAgIChoYXNMb2NhbENoYW5nZXMoKSA/ICcud2l0aC1sb2NhbC1jaGFuZ2VzJyA6ICcnKX1gO1xuICB9XG4gIHJldHVybiAnMC4wLjAnO1xufVxuXG4vKiogR2V0IHRoZSBjdXJyZW50IFNIQSBvZiBIRUFELiAqL1xuZnVuY3Rpb24gZ2V0Q3VycmVudFNoYSgpIHtcbiAgcmV0dXJuIGV4ZWMoYGdpdCByZXYtcGFyc2UgSEVBRGApO1xufVxuXG4vKiogR2V0IHRoZSBjdXJyZW50bHkgY2hlY2tlZCBvdXQgYnJhbmNoLiAqL1xuZnVuY3Rpb24gZ2V0Q3VycmVudEJyYW5jaCgpIHtcbiAgcmV0dXJuIGV4ZWMoYGdpdCBzeW1ib2xpYy1yZWYgLS1zaG9ydCBIRUFEYCk7XG59XG5cbi8qKiBHZXQgdGhlIGN1cnJlbnQgZ2l0IHVzZXIgYmFzZWQgb24gdGhlIGdpdCBjb25maWcuICovXG5mdW5jdGlvbiBnZXRDdXJyZW50R2l0VXNlcigpIHtcbiAgY29uc3QgdXNlck5hbWUgPSBleGVjKGBnaXQgY29uZmlnIHVzZXIubmFtZWApO1xuICBjb25zdCB1c2VyRW1haWwgPSBleGVjKGBnaXQgY29uZmlnIHVzZXIuZW1haWxgKTtcblxuICByZXR1cm4gYCR7dXNlck5hbWV9IDwke3VzZXJFbWFpbH0+YDtcbn1cbiJdfQ==