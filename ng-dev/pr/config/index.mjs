"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.breakingChangeLabel = exports.assertValidPullRequestConfig = void 0;
const config_1 = require("../../utils/config");
/** Loads and validates the merge configuration. */
function assertValidPullRequestConfig(config) {
    const errors = [];
    if (config.pullRequest === undefined) {
        throw new config_1.ConfigValidationError('No pullRequest configuration found. Set the `pullRequest` configuration.');
    }
    if (!config.pullRequest.mergeReadyLabel) {
        errors.push('No merge ready label configured.');
    }
    if (config.pullRequest.githubApiMerge === undefined) {
        errors.push('No explicit choice of merge strategy. Please set `githubApiMerge`.');
    }
    if (errors.length) {
        throw new config_1.ConfigValidationError('Invalid `pullRequest` configuration', errors);
    }
}
exports.assertValidPullRequestConfig = assertValidPullRequestConfig;
/** Label for pull requests containing a breaking change. */
exports.breakingChangeLabel = 'flag: breaking change';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9uZy1kZXYvcHIvY29uZmlnL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILCtDQUF1RTtBQStDdkUsbURBQW1EO0FBQ25ELFNBQWdCLDRCQUE0QixDQUMxQyxNQUFxRDtJQUVyRCxNQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7SUFDNUIsSUFBSSxNQUFNLENBQUMsV0FBVyxLQUFLLFNBQVMsRUFBRTtRQUNwQyxNQUFNLElBQUksOEJBQXFCLENBQzdCLDBFQUEwRSxDQUMzRSxDQUFDO0tBQ0g7SUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxlQUFlLEVBQUU7UUFDdkMsTUFBTSxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO0tBQ2pEO0lBQ0QsSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLGNBQWMsS0FBSyxTQUFTLEVBQUU7UUFDbkQsTUFBTSxDQUFDLElBQUksQ0FBQyxvRUFBb0UsQ0FBQyxDQUFDO0tBQ25GO0lBRUQsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO1FBQ2pCLE1BQU0sSUFBSSw4QkFBcUIsQ0FBQyxxQ0FBcUMsRUFBRSxNQUFNLENBQUMsQ0FBQztLQUNoRjtBQUNILENBQUM7QUFwQkQsb0VBb0JDO0FBRUQsNERBQTREO0FBQy9DLFFBQUEsbUJBQW1CLEdBQUcsdUJBQXVCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb25maWdWYWxpZGF0aW9uRXJyb3IsIEdpdGh1YkNvbmZpZ30gZnJvbSAnLi4vLi4vdXRpbHMvY29uZmlnJztcblxuLyoqXG4gKiBQb3NzaWJsZSBtZXJnZSBtZXRob2RzIHN1cHBvcnRlZCBieSB0aGUgR2l0aHViIEFQSS5cbiAqIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcHVsbHMvI21lcmdlLWEtcHVsbC1yZXF1ZXN0LW1lcmdlLWJ1dHRvbi5cbiAqL1xuZXhwb3J0IHR5cGUgR2l0aHViQXBpTWVyZ2VNZXRob2QgPSAnbWVyZ2UnIHwgJ3NxdWFzaCcgfCAncmViYXNlJztcblxuLyoqIENvbmZpZ3VyYXRpb24gZm9yIHRoZSBHaXRodWIgQVBJIG1lcmdlIHN0cmF0ZWd5LiAqL1xuZXhwb3J0IGludGVyZmFjZSBHaXRodWJBcGlNZXJnZVN0cmF0ZWd5Q29uZmlnIHtcbiAgLyoqIERlZmF1bHQgbWV0aG9kIHVzZWQgZm9yIG1lcmdpbmcgcHVsbCByZXF1ZXN0cyAqL1xuICBkZWZhdWx0OiBHaXRodWJBcGlNZXJnZU1ldGhvZDtcbiAgLyoqIExhYmVscyB3aGljaCBzcGVjaWZ5IGEgZGlmZmVyZW50IG1lcmdlIG1ldGhvZCB0aGFuIHRoZSBkZWZhdWx0LiAqL1xuICBsYWJlbHM/OiB7cGF0dGVybjogc3RyaW5nOyBtZXRob2Q6IEdpdGh1YkFwaU1lcmdlTWV0aG9kfVtdO1xufVxuXG4vKiogQ29uZmlndXJhdGlvbiBmb3IgdGhlIG1lcmdlIHNjcmlwdC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUHVsbFJlcXVlc3RDb25maWcge1xuICAvKipcbiAgICogQ29uZmlndXJhdGlvbiBmb3IgdGhlIHVwc3RyZWFtIHJlbW90ZS4gQWxsIG9mIHRoZXNlIG9wdGlvbnMgYXJlIG9wdGlvbmFsIGFzXG4gICAqIGRlZmF1bHRzIGFyZSBwcm92aWRlZCBieSB0aGUgY29tbW9uIGRldi1pbmZyYSBnaXRodWIgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIHJlbW90ZT86IEdpdGh1YkNvbmZpZztcbiAgLyoqIExpc3Qgb2YgdGFyZ2V0IGxhYmVscy4gKi9cbiAgbm9UYXJnZXRMYWJlbGluZz86IGJvb2xlYW47XG4gIC8qKiBSZXF1aXJlZCBiYXNlIGNvbW1pdHMgZm9yIGdpdmVuIGJyYW5jaGVzLiAqL1xuICByZXF1aXJlZEJhc2VDb21taXRzPzoge1ticmFuY2hOYW1lOiBzdHJpbmddOiBzdHJpbmd9O1xuICAvKiogUGF0dGVybiB0aGF0IG1hdGNoZXMgbGFiZWxzIHdoaWNoIGltcGx5IGEgbWVyZ2UgcmVhZHkgcHVsbCByZXF1ZXN0LiAqL1xuICBtZXJnZVJlYWR5TGFiZWw6IHN0cmluZyB8IFJlZ0V4cDtcbiAgLyoqIExhYmVsIHRoYXQgaXMgYXBwbGllZCB3aGVuIHNwZWNpYWwgYXR0ZW50aW9uIGZyb20gdGhlIGNhcmV0YWtlciBpcyByZXF1aXJlZC4gKi9cbiAgY2FyZXRha2VyTm90ZUxhYmVsPzogc3RyaW5nIHwgUmVnRXhwO1xuICAvKiogTGFiZWwgd2hpY2ggY2FuIGJlIGFwcGxpZWQgdG8gZml4dXAgY29tbWl0IG1lc3NhZ2VzIGluIHRoZSBtZXJnZSBzY3JpcHQuICovXG4gIGNvbW1pdE1lc3NhZ2VGaXh1cExhYmVsOiBzdHJpbmcgfCBSZWdFeHA7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHB1bGwgcmVxdWVzdHMgc2hvdWxkIGJlIG1lcmdlZCB1c2luZyB0aGUgR2l0aHViIEFQSS4gVGhpcyBjYW4gYmUgZW5hYmxlZFxuICAgKiBpZiBwcm9qZWN0cyB3YW50IHRvIGhhdmUgdGhlaXIgcHVsbCByZXF1ZXN0cyBzaG93IHVwIGFzIGBNZXJnZWRgIGluIHRoZSBHaXRodWIgVUkuXG4gICAqIFRoZSBkb3duc2lkZSBpcyB0aGF0IGZpeHVwIG9yIHNxdWFzaCBjb21taXRzIG5vIGxvbmdlciB3b3JrIGFzIHRoZSBHaXRodWIgQVBJIGRvZXNcbiAgICogbm90IHN1cHBvcnQgdGhpcy5cbiAgICovXG4gIGdpdGh1YkFwaU1lcmdlOiBmYWxzZSB8IEdpdGh1YkFwaU1lcmdlU3RyYXRlZ3lDb25maWc7XG4gIC8qKlxuICAgKiBMaXN0IG9mIGNvbW1pdCBzY29wZXMgd2hpY2ggYXJlIGV4ZW1wdGVkIGZyb20gdGFyZ2V0IGxhYmVsIGNvbnRlbnQgcmVxdWlyZW1lbnRzLiBpLmUuIG5vIGBmZWF0YFxuICAgKiBzY29wZXMgaW4gcGF0Y2ggYnJhbmNoZXMsIG5vIGJyZWFraW5nIGNoYW5nZXMgaW4gbWlub3Igb3IgcGF0Y2ggY2hhbmdlcy5cbiAgICovXG4gIHRhcmdldExhYmVsRXhlbXB0U2NvcGVzPzogc3RyaW5nW107XG59XG5cbi8qKiBMb2FkcyBhbmQgdmFsaWRhdGVzIHRoZSBtZXJnZSBjb25maWd1cmF0aW9uLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydFZhbGlkUHVsbFJlcXVlc3RDb25maWc8VD4oXG4gIGNvbmZpZzogVCAmIFBhcnRpYWw8e3B1bGxSZXF1ZXN0OiBQdWxsUmVxdWVzdENvbmZpZ30+LFxuKTogYXNzZXJ0cyBjb25maWcgaXMgVCAmIHtwdWxsUmVxdWVzdDogUHVsbFJlcXVlc3RDb25maWd9IHtcbiAgY29uc3QgZXJyb3JzOiBzdHJpbmdbXSA9IFtdO1xuICBpZiAoY29uZmlnLnB1bGxSZXF1ZXN0ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgQ29uZmlnVmFsaWRhdGlvbkVycm9yKFxuICAgICAgJ05vIHB1bGxSZXF1ZXN0IGNvbmZpZ3VyYXRpb24gZm91bmQuIFNldCB0aGUgYHB1bGxSZXF1ZXN0YCBjb25maWd1cmF0aW9uLicsXG4gICAgKTtcbiAgfVxuXG4gIGlmICghY29uZmlnLnB1bGxSZXF1ZXN0Lm1lcmdlUmVhZHlMYWJlbCkge1xuICAgIGVycm9ycy5wdXNoKCdObyBtZXJnZSByZWFkeSBsYWJlbCBjb25maWd1cmVkLicpO1xuICB9XG4gIGlmIChjb25maWcucHVsbFJlcXVlc3QuZ2l0aHViQXBpTWVyZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgIGVycm9ycy5wdXNoKCdObyBleHBsaWNpdCBjaG9pY2Ugb2YgbWVyZ2Ugc3RyYXRlZ3kuIFBsZWFzZSBzZXQgYGdpdGh1YkFwaU1lcmdlYC4nKTtcbiAgfVxuXG4gIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IENvbmZpZ1ZhbGlkYXRpb25FcnJvcignSW52YWxpZCBgcHVsbFJlcXVlc3RgIGNvbmZpZ3VyYXRpb24nLCBlcnJvcnMpO1xuICB9XG59XG5cbi8qKiBMYWJlbCBmb3IgcHVsbCByZXF1ZXN0cyBjb250YWluaW5nIGEgYnJlYWtpbmcgY2hhbmdlLiAqL1xuZXhwb3J0IGNvbnN0IGJyZWFraW5nQ2hhbmdlTGFiZWwgPSAnZmxhZzogYnJlYWtpbmcgY2hhbmdlJztcbiJdfQ==