"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertValidReleaseConfig = void 0;
const config_1 = require("../../utils/config");
/** Asserts that the given configuration is a valid `DevInfraReleaseConfig`. */
function assertValidReleaseConfig(config) {
    // List of errors encountered validating the config.
    const errors = [];
    if (config.release === undefined) {
        throw new config_1.ConfigValidationError('No configuration provided for `release`');
    }
    if (config.release.npmPackages === undefined) {
        errors.push(`No "npmPackages" configured for releasing.`);
    }
    if (config.release.buildPackages === undefined) {
        errors.push(`No "buildPackages" function configured for releasing.`);
    }
    if (errors.length) {
        throw new config_1.ConfigValidationError('Invalid `release` configuration', errors);
    }
}
exports.assertValidReleaseConfig = assertValidReleaseConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9uZy1kZXYvcmVsZWFzZS9jb25maWcvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsK0NBQW9GO0FBMENwRiwrRUFBK0U7QUFDL0UsU0FBZ0Isd0JBQXdCLENBQ3RDLE1BQTBDO0lBRTFDLG9EQUFvRDtJQUNwRCxNQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7SUFFNUIsSUFBSSxNQUFNLENBQUMsT0FBTyxLQUFLLFNBQVMsRUFBRTtRQUNoQyxNQUFNLElBQUksOEJBQXFCLENBQUMseUNBQXlDLENBQUMsQ0FBQztLQUM1RTtJQUVELElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEtBQUssU0FBUyxFQUFFO1FBQzVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsNENBQTRDLENBQUMsQ0FBQztLQUMzRDtJQUNELElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEtBQUssU0FBUyxFQUFFO1FBQzlDLE1BQU0sQ0FBQyxJQUFJLENBQUMsdURBQXVELENBQUMsQ0FBQztLQUN0RTtJQUNELElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRTtRQUNqQixNQUFNLElBQUksOEJBQXFCLENBQUMsaUNBQWlDLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDNUU7QUFDSCxDQUFDO0FBbkJELDREQW1CQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2Fzc2VydE5vRXJyb3JzLCBDb25maWdWYWxpZGF0aW9uRXJyb3IsIGdldENvbmZpZ30gZnJvbSAnLi4vLi4vdXRpbHMvY29uZmlnJztcblxuLyoqIEludGVyZmFjZSBkZXNjcmliaW5nIGEgYnVpbHQgcGFja2FnZS4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQnVpbHRQYWNrYWdlIHtcbiAgLyoqIE5hbWUgb2YgdGhlIHBhY2thZ2UuICovXG4gIG5hbWU6IHN0cmluZztcbiAgLyoqIFBhdGggdG8gdGhlIHBhY2thZ2Ugb3V0cHV0IGRpcmVjdG9yeS4gKi9cbiAgb3V0cHV0UGF0aDogc3RyaW5nO1xufVxuXG4vKiogQ29uZmlndXJhdGlvbiBmb3Igc3RhZ2luZyBhbmQgcHVibGlzaGluZyBhIHJlbGVhc2UuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlbGVhc2VDb25maWcge1xuICAvKiogUmVnaXN0cnkgVVJMIHVzZWQgZm9yIHB1Ymxpc2hpbmcgcmVsZWFzZSBwYWNrYWdlcy4gRGVmYXVsdHMgdG8gdGhlIE5QTSByZWdpc3RyeS4gKi9cbiAgcHVibGlzaFJlZ2lzdHJ5Pzogc3RyaW5nO1xuICAvKiogTGlzdCBvZiBOUE0gcGFja2FnZXMgdGhhdCBhcmUgcHVibGlzaGVkIGFzIHBhcnQgb2YgdGhpcyBwcm9qZWN0LiAqL1xuICBucG1QYWNrYWdlczogc3RyaW5nW107XG4gIC8qKiBCdWlsZHMgcmVsZWFzZSBwYWNrYWdlcyBhbmQgcmV0dXJucyBhIGxpc3Qgb2YgcGF0aHMgcG9pbnRpbmcgdG8gdGhlIG91dHB1dC4gKi9cbiAgYnVpbGRQYWNrYWdlczogKHN0YW1wRm9yUmVsZWFzZT86IGJvb2xlYW4pID0+IFByb21pc2U8QnVpbHRQYWNrYWdlW10gfCBudWxsPjtcbiAgLyoqIFRoZSBsaXN0IG9mIGdpdGh1YiBsYWJlbHMgdG8gYWRkIHRvIHRoZSByZWxlYXNlIFBScy4gKi9cbiAgcmVsZWFzZVByTGFiZWxzPzogc3RyaW5nW107XG4gIC8qKiBDb25maWd1cmF0aW9uIGZvciBjcmVhdGluZyByZWxlYXNlIG5vdGVzIGR1cmluZyBwdWJsaXNoaW5nLiAqL1xuICByZWxlYXNlTm90ZXM/OiBSZWxlYXNlTm90ZXNDb25maWc7XG59XG5cbi8qKiBDb25maWd1cmF0aW9uIGZvciBjcmVhdGluZyByZWxlYXNlIG5vdGVzIGR1cmluZyBwdWJsaXNoaW5nLiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZWxlYXNlTm90ZXNDb25maWcge1xuICAvKiogV2hldGhlciB0byBwcm9tcHQgZm9yIGFuZCBpbmNsdWRlIGEgcmVsZWFzZSB0aXRsZSBpbiB0aGUgZ2VuZXJhdGVkIHJlbGVhc2Ugbm90ZXMuICovXG4gIHVzZVJlbGVhc2VUaXRsZT86IGJvb2xlYW47XG4gIC8qKiBMaXN0IG9mIGNvbW1pdCBzY29wZXMgdG8gZGlzY2x1ZGUgZnJvbSBnZW5lcmF0ZWQgcmVsZWFzZSBub3Rlcy4gKi9cbiAgaGlkZGVuU2NvcGVzPzogc3RyaW5nW107XG4gIC8qKlxuICAgKiBMaXN0IG9mIGNvbW1pdCBncm91cHMsIGVpdGhlciB7bnBtU2NvcGV9L3tzY29wZX0gb3Ige3Njb3BlfSwgdG8gdXNlIGZvciBvcmRlcmluZy5cbiAgICpcbiAgICogRWFjaCBncm91cCBmb3IgdGhlIHJlbGVhc2Ugbm90ZXMsIHdpbGwgYXBwZWFyIGluIHRoZSBvcmRlciBwcm92aWRlZCBpbiBncm91cE9yZGVyIGFuZCBhbnkgb3RoZXJcbiAgICogZ3JvdXBzIHdpbGwgYXBwZWFyIGFmdGVyIHRoZXNlIGdyb3Vwcywgc29ydGVkIGJ5IGBBcnJheS5zb3J0YCdzIGRlZmF1bHQgc29ydGluZyBvcmRlci5cbiAgICovXG4gIGdyb3VwT3JkZXI/OiBzdHJpbmdbXTtcbn1cblxuLyoqIENvbmZpZ3VyYXRpb24gZm9yIHJlbGVhc2VzIGluIHRoZSBkZXYtaW5mcmEgY29uZmlndXJhdGlvbi4gKi9cbmV4cG9ydCB0eXBlIERldkluZnJhUmVsZWFzZUNvbmZpZyA9IHtyZWxlYXNlOiBSZWxlYXNlQ29uZmlnfTtcblxuLyoqIEFzc2VydHMgdGhhdCB0aGUgZ2l2ZW4gY29uZmlndXJhdGlvbiBpcyBhIHZhbGlkIGBEZXZJbmZyYVJlbGVhc2VDb25maWdgLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydFZhbGlkUmVsZWFzZUNvbmZpZzxUPihcbiAgY29uZmlnOiBUICYgUGFydGlhbDxEZXZJbmZyYVJlbGVhc2VDb25maWc+LFxuKTogYXNzZXJ0cyBjb25maWcgaXMgVCAmIERldkluZnJhUmVsZWFzZUNvbmZpZyB7XG4gIC8vIExpc3Qgb2YgZXJyb3JzIGVuY291bnRlcmVkIHZhbGlkYXRpbmcgdGhlIGNvbmZpZy5cbiAgY29uc3QgZXJyb3JzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIGlmIChjb25maWcucmVsZWFzZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IENvbmZpZ1ZhbGlkYXRpb25FcnJvcignTm8gY29uZmlndXJhdGlvbiBwcm92aWRlZCBmb3IgYHJlbGVhc2VgJyk7XG4gIH1cblxuICBpZiAoY29uZmlnLnJlbGVhc2UubnBtUGFja2FnZXMgPT09IHVuZGVmaW5lZCkge1xuICAgIGVycm9ycy5wdXNoKGBObyBcIm5wbVBhY2thZ2VzXCIgY29uZmlndXJlZCBmb3IgcmVsZWFzaW5nLmApO1xuICB9XG4gIGlmIChjb25maWcucmVsZWFzZS5idWlsZFBhY2thZ2VzID09PSB1bmRlZmluZWQpIHtcbiAgICBlcnJvcnMucHVzaChgTm8gXCJidWlsZFBhY2thZ2VzXCIgZnVuY3Rpb24gY29uZmlndXJlZCBmb3IgcmVsZWFzaW5nLmApO1xuICB9XG4gIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IENvbmZpZ1ZhbGlkYXRpb25FcnJvcignSW52YWxpZCBgcmVsZWFzZWAgY29uZmlndXJhdGlvbicsIGVycm9ycyk7XG4gIH1cbn1cbiJdfQ==