/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
/*
 * This file will be spawned as a separate process when the `ng-dev release build` command is
 * invoked. A separate process allows us to hide any superfluous stdout output from arbitrary
 * build commands that we cannot control. This is necessary as the `ng-dev release build` command
 * supports stdout JSON output that should be parsable and not polluted from other stdout messages.
 */
import { getReleaseConfig } from '../config/index';
// Start the release package building.
main(process.argv[2] === 'true');
/** Main function for building the release packages. */
function main(stampForRelease) {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.send === undefined) {
            throw Error('This script needs to be invoked as a NodeJS worker.');
        }
        const config = getReleaseConfig();
        const builtPackages = yield config.buildPackages(stampForRelease);
        // Transfer the built packages back to the parent process.
        process.send(builtPackages);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQtd29ya2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vZGV2LWluZnJhL3JlbGVhc2UvYnVpbGQvYnVpbGQtd29ya2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSDs7Ozs7R0FLRztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRWpELHNDQUFzQztBQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxNQUFNLENBQUMsQ0FBQztBQUVqQyx1REFBdUQ7QUFDdkQsU0FBZSxJQUFJLENBQUMsZUFBd0I7O1FBQzFDLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7WUFDOUIsTUFBTSxLQUFLLENBQUMscURBQXFELENBQUMsQ0FBQztTQUNwRTtRQUVELE1BQU0sTUFBTSxHQUFHLGdCQUFnQixFQUFFLENBQUM7UUFDbEMsTUFBTSxhQUFhLEdBQUcsTUFBTSxNQUFNLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRWxFLDBEQUEwRDtRQUMxRCxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzlCLENBQUM7Q0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKlxuICogVGhpcyBmaWxlIHdpbGwgYmUgc3Bhd25lZCBhcyBhIHNlcGFyYXRlIHByb2Nlc3Mgd2hlbiB0aGUgYG5nLWRldiByZWxlYXNlIGJ1aWxkYCBjb21tYW5kIGlzXG4gKiBpbnZva2VkLiBBIHNlcGFyYXRlIHByb2Nlc3MgYWxsb3dzIHVzIHRvIGhpZGUgYW55IHN1cGVyZmx1b3VzIHN0ZG91dCBvdXRwdXQgZnJvbSBhcmJpdHJhcnlcbiAqIGJ1aWxkIGNvbW1hbmRzIHRoYXQgd2UgY2Fubm90IGNvbnRyb2wuIFRoaXMgaXMgbmVjZXNzYXJ5IGFzIHRoZSBgbmctZGV2IHJlbGVhc2UgYnVpbGRgIGNvbW1hbmRcbiAqIHN1cHBvcnRzIHN0ZG91dCBKU09OIG91dHB1dCB0aGF0IHNob3VsZCBiZSBwYXJzYWJsZSBhbmQgbm90IHBvbGx1dGVkIGZyb20gb3RoZXIgc3Rkb3V0IG1lc3NhZ2VzLlxuICovXG5cbmltcG9ydCB7Z2V0UmVsZWFzZUNvbmZpZ30gZnJvbSAnLi4vY29uZmlnL2luZGV4JztcblxuLy8gU3RhcnQgdGhlIHJlbGVhc2UgcGFja2FnZSBidWlsZGluZy5cbm1haW4ocHJvY2Vzcy5hcmd2WzJdID09PSAndHJ1ZScpO1xuXG4vKiogTWFpbiBmdW5jdGlvbiBmb3IgYnVpbGRpbmcgdGhlIHJlbGVhc2UgcGFja2FnZXMuICovXG5hc3luYyBmdW5jdGlvbiBtYWluKHN0YW1wRm9yUmVsZWFzZTogYm9vbGVhbikge1xuICBpZiAocHJvY2Vzcy5zZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBFcnJvcignVGhpcyBzY3JpcHQgbmVlZHMgdG8gYmUgaW52b2tlZCBhcyBhIE5vZGVKUyB3b3JrZXIuJyk7XG4gIH1cblxuICBjb25zdCBjb25maWcgPSBnZXRSZWxlYXNlQ29uZmlnKCk7XG4gIGNvbnN0IGJ1aWx0UGFja2FnZXMgPSBhd2FpdCBjb25maWcuYnVpbGRQYWNrYWdlcyhzdGFtcEZvclJlbGVhc2UpO1xuXG4gIC8vIFRyYW5zZmVyIHRoZSBidWlsdCBwYWNrYWdlcyBiYWNrIHRvIHRoZSBwYXJlbnQgcHJvY2Vzcy5cbiAgcHJvY2Vzcy5zZW5kKGJ1aWx0UGFja2FnZXMpO1xufVxuIl19