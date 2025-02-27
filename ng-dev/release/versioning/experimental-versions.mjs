"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExperimentalSemver = exports.isExperimentalSemver = void 0;
const semver = require("semver");
/** Gets whether the given version denotes an experimental SemVer version. */
function isExperimentalSemver(semver) {
    return semver.major === 0 && semver.minor >= 100;
}
exports.isExperimentalSemver = isExperimentalSemver;
/** Creates the equivalent experimental version for a provided SemVer. */
function createExperimentalSemver(version) {
    version = new semver.SemVer(version);
    const experimentalVersion = new semver.SemVer(version.format());
    experimentalVersion.major = 0;
    experimentalVersion.minor = version.major * 100 + version.minor;
    return new semver.SemVer(experimentalVersion.format());
}
exports.createExperimentalSemver = createExperimentalSemver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwZXJpbWVudGFsLXZlcnNpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbmctZGV2L3JlbGVhc2UvdmVyc2lvbmluZy9leHBlcmltZW50YWwtdmVyc2lvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsaUNBQWlDO0FBRWpDLDZFQUE2RTtBQUM3RSxTQUFnQixvQkFBb0IsQ0FBQyxNQUFxQjtJQUN4RCxPQUFPLE1BQU0sQ0FBQyxLQUFLLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDO0FBQ25ELENBQUM7QUFGRCxvREFFQztBQUVELHlFQUF5RTtBQUN6RSxTQUFnQix3QkFBd0IsQ0FBQyxPQUErQjtJQUN0RSxPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3JDLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ2hFLG1CQUFtQixDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDOUIsbUJBQW1CLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLEdBQUcsR0FBRyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7SUFDaEUsT0FBTyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUN6RCxDQUFDO0FBTkQsNERBTUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgc2VtdmVyIGZyb20gJ3NlbXZlcic7XG5cbi8qKiBHZXRzIHdoZXRoZXIgdGhlIGdpdmVuIHZlcnNpb24gZGVub3RlcyBhbiBleHBlcmltZW50YWwgU2VtVmVyIHZlcnNpb24uICovXG5leHBvcnQgZnVuY3Rpb24gaXNFeHBlcmltZW50YWxTZW12ZXIoc2VtdmVyOiBzZW12ZXIuU2VtVmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiBzZW12ZXIubWFqb3IgPT09IDAgJiYgc2VtdmVyLm1pbm9yID49IDEwMDtcbn1cblxuLyoqIENyZWF0ZXMgdGhlIGVxdWl2YWxlbnQgZXhwZXJpbWVudGFsIHZlcnNpb24gZm9yIGEgcHJvdmlkZWQgU2VtVmVyLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUV4cGVyaW1lbnRhbFNlbXZlcih2ZXJzaW9uOiBzdHJpbmcgfCBzZW12ZXIuU2VtVmVyKTogc2VtdmVyLlNlbVZlciB7XG4gIHZlcnNpb24gPSBuZXcgc2VtdmVyLlNlbVZlcih2ZXJzaW9uKTtcbiAgY29uc3QgZXhwZXJpbWVudGFsVmVyc2lvbiA9IG5ldyBzZW12ZXIuU2VtVmVyKHZlcnNpb24uZm9ybWF0KCkpO1xuICBleHBlcmltZW50YWxWZXJzaW9uLm1ham9yID0gMDtcbiAgZXhwZXJpbWVudGFsVmVyc2lvbi5taW5vciA9IHZlcnNpb24ubWFqb3IgKiAxMDAgKyB2ZXJzaW9uLm1pbm9yO1xuICByZXR1cm4gbmV3IHNlbXZlci5TZW1WZXIoZXhwZXJpbWVudGFsVmVyc2lvbi5mb3JtYXQoKSk7XG59XG4iXX0=