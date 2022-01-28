"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTestConfig = void 0;
const path_1 = require("path");
const console_1 = require("../utils/console");
/**
 * Loads the configuration for the circular dependencies test. If the config cannot be
 * loaded, an error will be printed and the process exists with a non-zero exit code.
 */
function loadTestConfig(configPath) {
    const configBaseDir = (0, path_1.dirname)(configPath);
    const resolveRelativePath = (relativePath) => (0, path_1.resolve)(configBaseDir, relativePath);
    try {
        const config = require(configPath);
        if (!(0, path_1.isAbsolute)(config.baseDir)) {
            config.baseDir = resolveRelativePath(config.baseDir);
        }
        if (!(0, path_1.isAbsolute)(config.goldenFile)) {
            config.goldenFile = resolveRelativePath(config.goldenFile);
        }
        if (!(0, path_1.isAbsolute)(config.glob)) {
            config.glob = resolveRelativePath(config.glob);
        }
        return config;
    }
    catch (e) {
        (0, console_1.error)('Could not load test configuration file at: ' + configPath);
        (0, console_1.error)(`Failed with error:`, e);
        process.exit(1);
    }
}
exports.loadTestConfig = loadTestConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbmctZGV2L3RzLWNpcmN1bGFyLWRlcGVuZGVuY2llcy9jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsK0JBQWtEO0FBRWxELDhDQUF1QztBQXdCdkM7OztHQUdHO0FBQ0gsU0FBZ0IsY0FBYyxDQUFDLFVBQWtCO0lBQy9DLE1BQU0sYUFBYSxHQUFHLElBQUEsY0FBTyxFQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzFDLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxZQUFvQixFQUFFLEVBQUUsQ0FBQyxJQUFBLGNBQU8sRUFBQyxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFFM0YsSUFBSTtRQUNGLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQW1DLENBQUM7UUFDckUsSUFBSSxDQUFDLElBQUEsaUJBQVUsRUFBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDL0IsTUFBTSxDQUFDLE9BQU8sR0FBRyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDdEQ7UUFDRCxJQUFJLENBQUMsSUFBQSxpQkFBVSxFQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNsQyxNQUFNLENBQUMsVUFBVSxHQUFHLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM1RDtRQUNELElBQUksQ0FBQyxJQUFBLGlCQUFVLEVBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzVCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsbUJBQW1CLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2hEO1FBQ0QsT0FBTyxNQUFNLENBQUM7S0FDZjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsSUFBQSxlQUFLLEVBQUMsNkNBQTZDLEdBQUcsVUFBVSxDQUFDLENBQUM7UUFDbEUsSUFBQSxlQUFLLEVBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0IsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNqQjtBQUNILENBQUM7QUFyQkQsd0NBcUJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7ZGlybmFtZSwgaXNBYnNvbHV0ZSwgcmVzb2x2ZX0gZnJvbSAncGF0aCc7XG5cbmltcG9ydCB7ZXJyb3J9IGZyb20gJy4uL3V0aWxzL2NvbnNvbGUnO1xuXG5pbXBvcnQge01vZHVsZVJlc29sdmVyfSBmcm9tICcuL2FuYWx5emVyJztcblxuLyoqIENvbmZpZ3VyYXRpb24gZm9yIGEgY2lyY3VsYXIgZGVwZW5kZW5jaWVzIHRlc3QuICovXG5leHBvcnQgaW50ZXJmYWNlIENpcmN1bGFyRGVwZW5kZW5jaWVzVGVzdENvbmZpZyB7XG4gIC8qKiBCYXNlIGRpcmVjdG9yeSB1c2VkIGZvciBzaG9ydGVuaW5nIHBhdGhzIGluIHRoZSBnb2xkZW4gZmlsZS4gKi9cbiAgYmFzZURpcjogc3RyaW5nO1xuICAvKiogUGF0aCB0byB0aGUgZ29sZGVuIGZpbGUgdGhhdCBpcyB1c2VkIGZvciBjaGVja2luZyBhbmQgYXBwcm92aW5nLiAqL1xuICBnb2xkZW5GaWxlOiBzdHJpbmc7XG4gIC8qKiBHbG9iIHRoYXQgcmVzb2x2ZXMgc291cmNlIGZpbGVzIHdoaWNoIHNob3VsZCBiZSBjaGVja2VkLiAqL1xuICBnbG9iOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBPcHRpb25hbCBtb2R1bGUgcmVzb2x2ZXIgZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byByZXNvbHZlIG1vZHVsZXNcbiAgICogdG8gYWJzb2x1dGUgZmlsZSBwYXRocy5cbiAgICovXG4gIHJlc29sdmVNb2R1bGU/OiBNb2R1bGVSZXNvbHZlcjtcbiAgLyoqXG4gICAqIE9wdGlvbmFsIGNvbW1hbmQgdGhhdCB3aWxsIGJlIGRpc3BsYXllZCBpZiB0aGUgZ29sZGVuIGNoZWNrIGZhaWxlZC4gVGhpcyBjYW4gYmUgdXNlZFxuICAgKiB0byBjb25zaXN0ZW50bHkgdXNlIHNjcmlwdCBhbGlhc2VzIGZvciBjaGVja2luZy9hcHByb3ZpbmcgdGhlIGdvbGRlbi5cbiAgICovXG4gIGFwcHJvdmVDb21tYW5kPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIExvYWRzIHRoZSBjb25maWd1cmF0aW9uIGZvciB0aGUgY2lyY3VsYXIgZGVwZW5kZW5jaWVzIHRlc3QuIElmIHRoZSBjb25maWcgY2Fubm90IGJlXG4gKiBsb2FkZWQsIGFuIGVycm9yIHdpbGwgYmUgcHJpbnRlZCBhbmQgdGhlIHByb2Nlc3MgZXhpc3RzIHdpdGggYSBub24temVybyBleGl0IGNvZGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2FkVGVzdENvbmZpZyhjb25maWdQYXRoOiBzdHJpbmcpOiBDaXJjdWxhckRlcGVuZGVuY2llc1Rlc3RDb25maWcge1xuICBjb25zdCBjb25maWdCYXNlRGlyID0gZGlybmFtZShjb25maWdQYXRoKTtcbiAgY29uc3QgcmVzb2x2ZVJlbGF0aXZlUGF0aCA9IChyZWxhdGl2ZVBhdGg6IHN0cmluZykgPT4gcmVzb2x2ZShjb25maWdCYXNlRGlyLCByZWxhdGl2ZVBhdGgpO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgY29uZmlnID0gcmVxdWlyZShjb25maWdQYXRoKSBhcyBDaXJjdWxhckRlcGVuZGVuY2llc1Rlc3RDb25maWc7XG4gICAgaWYgKCFpc0Fic29sdXRlKGNvbmZpZy5iYXNlRGlyKSkge1xuICAgICAgY29uZmlnLmJhc2VEaXIgPSByZXNvbHZlUmVsYXRpdmVQYXRoKGNvbmZpZy5iYXNlRGlyKTtcbiAgICB9XG4gICAgaWYgKCFpc0Fic29sdXRlKGNvbmZpZy5nb2xkZW5GaWxlKSkge1xuICAgICAgY29uZmlnLmdvbGRlbkZpbGUgPSByZXNvbHZlUmVsYXRpdmVQYXRoKGNvbmZpZy5nb2xkZW5GaWxlKTtcbiAgICB9XG4gICAgaWYgKCFpc0Fic29sdXRlKGNvbmZpZy5nbG9iKSkge1xuICAgICAgY29uZmlnLmdsb2IgPSByZXNvbHZlUmVsYXRpdmVQYXRoKGNvbmZpZy5nbG9iKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbmZpZztcbiAgfSBjYXRjaCAoZSkge1xuICAgIGVycm9yKCdDb3VsZCBub3QgbG9hZCB0ZXN0IGNvbmZpZ3VyYXRpb24gZmlsZSBhdDogJyArIGNvbmZpZ1BhdGgpO1xuICAgIGVycm9yKGBGYWlsZWQgd2l0aCBlcnJvcjpgLCBlKTtcbiAgICBwcm9jZXNzLmV4aXQoMSk7XG4gIH1cbn1cbiJdfQ==