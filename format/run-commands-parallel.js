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
        define("@angular/dev-infra-private/format/run-commands-parallel", ["require", "exports", "tslib", "cli-progress", "multimatch", "os", "shelljs", "@angular/dev-infra-private/utils/console", "@angular/dev-infra-private/format/formatters/index"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.runFormatterInParallel = void 0;
    var tslib_1 = require("tslib");
    var cli_progress_1 = require("cli-progress");
    var multimatch = require("multimatch");
    var os_1 = require("os");
    var shelljs_1 = require("shelljs");
    var console_1 = require("@angular/dev-infra-private/utils/console");
    var formatters_1 = require("@angular/dev-infra-private/format/formatters/index");
    var AVAILABLE_THREADS = Math.max(os_1.cpus().length - 1, 1);
    /**
     * Run the provided commands in parallel for each provided file.
     *
     * Running the formatter is split across (number of available cpu threads - 1) processess.
     * The task is done in multiple processess to speed up the overall time of the task, as running
     * across entire repositories takes a large amount of time.
     * As a data point for illustration, using 8 process rather than 1 cut the execution
     * time from 276 seconds to 39 seconds for the same 2700 files.
     *
     * A promise is returned, completed when the command has completed running for each file.
     * The promise resolves with a list of failures, or `false` if no formatters have matched.
     */
    function runFormatterInParallel(allFiles, action) {
        return new Promise(function (resolve) {
            var e_1, _a;
            var formatters = formatters_1.getActiveFormatters();
            var failures = [];
            var pendingCommands = [];
            var _loop_1 = function (formatter) {
                pendingCommands.push.apply(pendingCommands, tslib_1.__spread(multimatch(allFiles, formatter.getFileMatcher(), {
                    dot: true
                }).map(function (file) { return ({ formatter: formatter, file: file }); })));
            };
            try {
                for (var formatters_2 = tslib_1.__values(formatters), formatters_2_1 = formatters_2.next(); !formatters_2_1.done; formatters_2_1 = formatters_2.next()) {
                    var formatter = formatters_2_1.value;
                    _loop_1(formatter);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (formatters_2_1 && !formatters_2_1.done && (_a = formatters_2.return)) _a.call(formatters_2);
                }
                finally { if (e_1) throw e_1.error; }
            }
            // If no commands are generated, resolve the promise as `false` as no files
            // were run against the any formatters.
            if (pendingCommands.length === 0) {
                return resolve(false);
            }
            switch (action) {
                case 'format':
                    console_1.info("Formatting " + pendingCommands.length + " file(s)");
                    break;
                case 'check':
                    console_1.info("Checking format of " + pendingCommands.length + " file(s)");
                    break;
                default:
                    throw Error("Invalid format action \"" + action + "\": allowed actions are \"format\" and \"check\"");
            }
            // The progress bar instance to use for progress tracking.
            var progressBar = new cli_progress_1.Bar({ format: "[{bar}] ETA: {eta}s | {value}/{total} files", clearOnComplete: true });
            // A local copy of the files to run the command on.
            // An array to represent the current usage state of each of the threads for parallelization.
            var threads = new Array(AVAILABLE_THREADS).fill(false);
            // Recursively run the command on the next available file from the list using the provided
            // thread.
            function runCommandInThread(thread) {
                var nextCommand = pendingCommands.pop();
                // If no file was pulled from the array, return as there are no more files to run against.
                if (nextCommand === undefined) {
                    threads[thread] = false;
                    return;
                }
                // Get the file and formatter for the next command.
                var file = nextCommand.file, formatter = nextCommand.formatter;
                shelljs_1.exec(formatter.commandFor(action) + " " + file, { async: true, silent: true }, function (code, stdout, stderr) {
                    // Run the provided callback function.
                    var failed = formatter.callbackFor(action)(file, code, stdout, stderr);
                    if (failed) {
                        failures.push(file);
                    }
                    // Note in the progress bar another file being completed.
                    progressBar.increment(1);
                    // If more files exist in the list, run again to work on the next file,
                    // using the same slot.
                    if (pendingCommands.length) {
                        return runCommandInThread(thread);
                    }
                    // If not more files are available, mark the thread as unused.
                    threads[thread] = false;
                    // If all of the threads are false, as they are unused, mark the progress bar
                    // completed and resolve the promise.
                    if (threads.every(function (active) { return !active; })) {
                        progressBar.stop();
                        resolve(failures);
                    }
                });
                // Mark the thread as in use as the command execution has been started.
                threads[thread] = true;
            }
            // Start the progress bar
            progressBar.start(pendingCommands.length, 0);
            // Start running the command on files from the least in each available thread.
            threads.forEach(function (_, idx) { return runCommandInThread(idx); });
        });
    }
    exports.runFormatterInParallel = runFormatterInParallel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuLWNvbW1hbmRzLXBhcmFsbGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vZGV2LWluZnJhL2Zvcm1hdC9ydW4tY29tbWFuZHMtcGFyYWxsZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztJQUVILDZDQUFpQztJQUNqQyx1Q0FBeUM7SUFDekMseUJBQXdCO0lBQ3hCLG1DQUE2QjtJQUU3QixvRUFBc0M7SUFFdEMsaUZBQTZFO0lBRTdFLElBQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFJLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRXpEOzs7Ozs7Ozs7OztPQVdHO0lBQ0gsU0FBZ0Isc0JBQXNCLENBQUMsUUFBa0IsRUFBRSxNQUF1QjtRQUNoRixPQUFPLElBQUksT0FBTyxDQUFpQixVQUFDLE9BQU87O1lBQ3pDLElBQU0sVUFBVSxHQUFHLGdDQUFtQixFQUFFLENBQUM7WUFDekMsSUFBTSxRQUFRLEdBQWEsRUFBRSxDQUFDO1lBQzlCLElBQU0sZUFBZSxHQUEyQyxFQUFFLENBQUM7b0NBRXhELFNBQVM7Z0JBQ2xCLGVBQWUsQ0FBQyxJQUFJLE9BQXBCLGVBQWUsbUJBQVMsVUFBVSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsY0FBYyxFQUFFLEVBQUU7b0JBQ2xELEdBQUcsRUFBRSxJQUFJO2lCQUNWLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxDQUFDLEVBQUMsU0FBUyxXQUFBLEVBQUUsSUFBSSxNQUFBLEVBQUMsQ0FBQyxFQUFuQixDQUFtQixDQUFDLEdBQUU7OztnQkFINUQsS0FBd0IsSUFBQSxlQUFBLGlCQUFBLFVBQVUsQ0FBQSxzQ0FBQTtvQkFBN0IsSUFBTSxTQUFTLHVCQUFBOzRCQUFULFNBQVM7aUJBSW5COzs7Ozs7Ozs7WUFFRCwyRUFBMkU7WUFDM0UsdUNBQXVDO1lBQ3ZDLElBQUksZUFBZSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQ2hDLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3ZCO1lBRUQsUUFBUSxNQUFNLEVBQUU7Z0JBQ2QsS0FBSyxRQUFRO29CQUNYLGNBQUksQ0FBQyxnQkFBYyxlQUFlLENBQUMsTUFBTSxhQUFVLENBQUMsQ0FBQztvQkFDckQsTUFBTTtnQkFDUixLQUFLLE9BQU87b0JBQ1YsY0FBSSxDQUFDLHdCQUFzQixlQUFlLENBQUMsTUFBTSxhQUFVLENBQUMsQ0FBQztvQkFDN0QsTUFBTTtnQkFDUjtvQkFDRSxNQUFNLEtBQUssQ0FBQyw2QkFBMEIsTUFBTSxxREFBNkMsQ0FBQyxDQUFDO2FBQzlGO1lBRUQsMERBQTBEO1lBQzFELElBQU0sV0FBVyxHQUNiLElBQUksa0JBQUcsQ0FBQyxFQUFDLE1BQU0sRUFBRSw2Q0FBNkMsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztZQUM1RixtREFBbUQ7WUFDbkQsNEZBQTRGO1lBQzVGLElBQU0sT0FBTyxHQUFHLElBQUksS0FBSyxDQUFVLGlCQUFpQixDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRWxFLDBGQUEwRjtZQUMxRixVQUFVO1lBQ1YsU0FBUyxrQkFBa0IsQ0FBQyxNQUFjO2dCQUN4QyxJQUFNLFdBQVcsR0FBRyxlQUFlLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQzFDLDBGQUEwRjtnQkFDMUYsSUFBSSxXQUFXLEtBQUssU0FBUyxFQUFFO29CQUM3QixPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDO29CQUN4QixPQUFPO2lCQUNSO2dCQUVELG1EQUFtRDtnQkFDNUMsSUFBQSxJQUFJLEdBQWUsV0FBVyxLQUExQixFQUFFLFNBQVMsR0FBSSxXQUFXLFVBQWYsQ0FBZ0I7Z0JBRXRDLGNBQUksQ0FDRyxTQUFTLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxTQUFJLElBQU0sRUFDekMsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUMsRUFDM0IsVUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU07b0JBQ25CLHNDQUFzQztvQkFDdEMsSUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDekUsSUFBSSxNQUFNLEVBQUU7d0JBQ1YsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDckI7b0JBQ0QseURBQXlEO29CQUN6RCxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN6Qix1RUFBdUU7b0JBQ3ZFLHVCQUF1QjtvQkFDdkIsSUFBSSxlQUFlLENBQUMsTUFBTSxFQUFFO3dCQUMxQixPQUFPLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUNuQztvQkFDRCw4REFBOEQ7b0JBQzlELE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUM7b0JBQ3hCLDZFQUE2RTtvQkFDN0UscUNBQXFDO29CQUNyQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBQSxNQUFNLElBQUksT0FBQSxDQUFDLE1BQU0sRUFBUCxDQUFPLENBQUMsRUFBRTt3QkFDcEMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO3dCQUNuQixPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7cUJBQ25CO2dCQUNILENBQUMsQ0FDSixDQUFDO2dCQUNGLHVFQUF1RTtnQkFDdkUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQztZQUN6QixDQUFDO1lBRUQseUJBQXlCO1lBQ3pCLFdBQVcsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM3Qyw4RUFBOEU7WUFDOUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUMsRUFBRSxHQUFHLElBQUssT0FBQSxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsRUFBdkIsQ0FBdUIsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQXBGRCx3REFvRkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtCYXJ9IGZyb20gJ2NsaS1wcm9ncmVzcyc7XG5pbXBvcnQgKiBhcyBtdWx0aW1hdGNoIGZyb20gJ211bHRpbWF0Y2gnO1xuaW1wb3J0IHtjcHVzfSBmcm9tICdvcyc7XG5pbXBvcnQge2V4ZWN9IGZyb20gJ3NoZWxsanMnO1xuXG5pbXBvcnQge2luZm99IGZyb20gJy4uL3V0aWxzL2NvbnNvbGUnO1xuXG5pbXBvcnQge0Zvcm1hdHRlciwgRm9ybWF0dGVyQWN0aW9uLCBnZXRBY3RpdmVGb3JtYXR0ZXJzfSBmcm9tICcuL2Zvcm1hdHRlcnMnO1xuXG5jb25zdCBBVkFJTEFCTEVfVEhSRUFEUyA9IE1hdGgubWF4KGNwdXMoKS5sZW5ndGggLSAxLCAxKTtcblxuLyoqXG4gKiBSdW4gdGhlIHByb3ZpZGVkIGNvbW1hbmRzIGluIHBhcmFsbGVsIGZvciBlYWNoIHByb3ZpZGVkIGZpbGUuXG4gKlxuICogUnVubmluZyB0aGUgZm9ybWF0dGVyIGlzIHNwbGl0IGFjcm9zcyAobnVtYmVyIG9mIGF2YWlsYWJsZSBjcHUgdGhyZWFkcyAtIDEpIHByb2Nlc3Nlc3MuXG4gKiBUaGUgdGFzayBpcyBkb25lIGluIG11bHRpcGxlIHByb2Nlc3Nlc3MgdG8gc3BlZWQgdXAgdGhlIG92ZXJhbGwgdGltZSBvZiB0aGUgdGFzaywgYXMgcnVubmluZ1xuICogYWNyb3NzIGVudGlyZSByZXBvc2l0b3JpZXMgdGFrZXMgYSBsYXJnZSBhbW91bnQgb2YgdGltZS5cbiAqIEFzIGEgZGF0YSBwb2ludCBmb3IgaWxsdXN0cmF0aW9uLCB1c2luZyA4IHByb2Nlc3MgcmF0aGVyIHRoYW4gMSBjdXQgdGhlIGV4ZWN1dGlvblxuICogdGltZSBmcm9tIDI3NiBzZWNvbmRzIHRvIDM5IHNlY29uZHMgZm9yIHRoZSBzYW1lIDI3MDAgZmlsZXMuXG4gKlxuICogQSBwcm9taXNlIGlzIHJldHVybmVkLCBjb21wbGV0ZWQgd2hlbiB0aGUgY29tbWFuZCBoYXMgY29tcGxldGVkIHJ1bm5pbmcgZm9yIGVhY2ggZmlsZS5cbiAqIFRoZSBwcm9taXNlIHJlc29sdmVzIHdpdGggYSBsaXN0IG9mIGZhaWx1cmVzLCBvciBgZmFsc2VgIGlmIG5vIGZvcm1hdHRlcnMgaGF2ZSBtYXRjaGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcnVuRm9ybWF0dGVySW5QYXJhbGxlbChhbGxGaWxlczogc3RyaW5nW10sIGFjdGlvbjogRm9ybWF0dGVyQWN0aW9uKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZTxmYWxzZXxzdHJpbmdbXT4oKHJlc29sdmUpID0+IHtcbiAgICBjb25zdCBmb3JtYXR0ZXJzID0gZ2V0QWN0aXZlRm9ybWF0dGVycygpO1xuICAgIGNvbnN0IGZhaWx1cmVzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGNvbnN0IHBlbmRpbmdDb21tYW5kczoge2Zvcm1hdHRlcjogRm9ybWF0dGVyLCBmaWxlOiBzdHJpbmd9W10gPSBbXTtcblxuICAgIGZvciAoY29uc3QgZm9ybWF0dGVyIG9mIGZvcm1hdHRlcnMpIHtcbiAgICAgIHBlbmRpbmdDb21tYW5kcy5wdXNoKC4uLm11bHRpbWF0Y2goYWxsRmlsZXMsIGZvcm1hdHRlci5nZXRGaWxlTWF0Y2hlcigpLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvdDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkubWFwKGZpbGUgPT4gKHtmb3JtYXR0ZXIsIGZpbGV9KSkpO1xuICAgIH1cblxuICAgIC8vIElmIG5vIGNvbW1hbmRzIGFyZSBnZW5lcmF0ZWQsIHJlc29sdmUgdGhlIHByb21pc2UgYXMgYGZhbHNlYCBhcyBubyBmaWxlc1xuICAgIC8vIHdlcmUgcnVuIGFnYWluc3QgdGhlIGFueSBmb3JtYXR0ZXJzLlxuICAgIGlmIChwZW5kaW5nQ29tbWFuZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZShmYWxzZSk7XG4gICAgfVxuXG4gICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgIGNhc2UgJ2Zvcm1hdCc6XG4gICAgICAgIGluZm8oYEZvcm1hdHRpbmcgJHtwZW5kaW5nQ29tbWFuZHMubGVuZ3RofSBmaWxlKHMpYCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY2hlY2snOlxuICAgICAgICBpbmZvKGBDaGVja2luZyBmb3JtYXQgb2YgJHtwZW5kaW5nQ29tbWFuZHMubGVuZ3RofSBmaWxlKHMpYCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgRXJyb3IoYEludmFsaWQgZm9ybWF0IGFjdGlvbiBcIiR7YWN0aW9ufVwiOiBhbGxvd2VkIGFjdGlvbnMgYXJlIFwiZm9ybWF0XCIgYW5kIFwiY2hlY2tcImApO1xuICAgIH1cblxuICAgIC8vIFRoZSBwcm9ncmVzcyBiYXIgaW5zdGFuY2UgdG8gdXNlIGZvciBwcm9ncmVzcyB0cmFja2luZy5cbiAgICBjb25zdCBwcm9ncmVzc0JhciA9XG4gICAgICAgIG5ldyBCYXIoe2Zvcm1hdDogYFt7YmFyfV0gRVRBOiB7ZXRhfXMgfCB7dmFsdWV9L3t0b3RhbH0gZmlsZXNgLCBjbGVhck9uQ29tcGxldGU6IHRydWV9KTtcbiAgICAvLyBBIGxvY2FsIGNvcHkgb2YgdGhlIGZpbGVzIHRvIHJ1biB0aGUgY29tbWFuZCBvbi5cbiAgICAvLyBBbiBhcnJheSB0byByZXByZXNlbnQgdGhlIGN1cnJlbnQgdXNhZ2Ugc3RhdGUgb2YgZWFjaCBvZiB0aGUgdGhyZWFkcyBmb3IgcGFyYWxsZWxpemF0aW9uLlxuICAgIGNvbnN0IHRocmVhZHMgPSBuZXcgQXJyYXk8Ym9vbGVhbj4oQVZBSUxBQkxFX1RIUkVBRFMpLmZpbGwoZmFsc2UpO1xuXG4gICAgLy8gUmVjdXJzaXZlbHkgcnVuIHRoZSBjb21tYW5kIG9uIHRoZSBuZXh0IGF2YWlsYWJsZSBmaWxlIGZyb20gdGhlIGxpc3QgdXNpbmcgdGhlIHByb3ZpZGVkXG4gICAgLy8gdGhyZWFkLlxuICAgIGZ1bmN0aW9uIHJ1bkNvbW1hbmRJblRocmVhZCh0aHJlYWQ6IG51bWJlcikge1xuICAgICAgY29uc3QgbmV4dENvbW1hbmQgPSBwZW5kaW5nQ29tbWFuZHMucG9wKCk7XG4gICAgICAvLyBJZiBubyBmaWxlIHdhcyBwdWxsZWQgZnJvbSB0aGUgYXJyYXksIHJldHVybiBhcyB0aGVyZSBhcmUgbm8gbW9yZSBmaWxlcyB0byBydW4gYWdhaW5zdC5cbiAgICAgIGlmIChuZXh0Q29tbWFuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocmVhZHNbdGhyZWFkXSA9IGZhbHNlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIEdldCB0aGUgZmlsZSBhbmQgZm9ybWF0dGVyIGZvciB0aGUgbmV4dCBjb21tYW5kLlxuICAgICAgY29uc3Qge2ZpbGUsIGZvcm1hdHRlcn0gPSBuZXh0Q29tbWFuZDtcblxuICAgICAgZXhlYyhcbiAgICAgICAgICBgJHtmb3JtYXR0ZXIuY29tbWFuZEZvcihhY3Rpb24pfSAke2ZpbGV9YCxcbiAgICAgICAgICB7YXN5bmM6IHRydWUsIHNpbGVudDogdHJ1ZX0sXG4gICAgICAgICAgKGNvZGUsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICAgICAgICAvLyBSdW4gdGhlIHByb3ZpZGVkIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgICAgICAgICAgY29uc3QgZmFpbGVkID0gZm9ybWF0dGVyLmNhbGxiYWNrRm9yKGFjdGlvbikoZmlsZSwgY29kZSwgc3Rkb3V0LCBzdGRlcnIpO1xuICAgICAgICAgICAgaWYgKGZhaWxlZCkge1xuICAgICAgICAgICAgICBmYWlsdXJlcy5wdXNoKGZpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTm90ZSBpbiB0aGUgcHJvZ3Jlc3MgYmFyIGFub3RoZXIgZmlsZSBiZWluZyBjb21wbGV0ZWQuXG4gICAgICAgICAgICBwcm9ncmVzc0Jhci5pbmNyZW1lbnQoMSk7XG4gICAgICAgICAgICAvLyBJZiBtb3JlIGZpbGVzIGV4aXN0IGluIHRoZSBsaXN0LCBydW4gYWdhaW4gdG8gd29yayBvbiB0aGUgbmV4dCBmaWxlLFxuICAgICAgICAgICAgLy8gdXNpbmcgdGhlIHNhbWUgc2xvdC5cbiAgICAgICAgICAgIGlmIChwZW5kaW5nQ29tbWFuZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHJldHVybiBydW5Db21tYW5kSW5UaHJlYWQodGhyZWFkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIElmIG5vdCBtb3JlIGZpbGVzIGFyZSBhdmFpbGFibGUsIG1hcmsgdGhlIHRocmVhZCBhcyB1bnVzZWQuXG4gICAgICAgICAgICB0aHJlYWRzW3RocmVhZF0gPSBmYWxzZTtcbiAgICAgICAgICAgIC8vIElmIGFsbCBvZiB0aGUgdGhyZWFkcyBhcmUgZmFsc2UsIGFzIHRoZXkgYXJlIHVudXNlZCwgbWFyayB0aGUgcHJvZ3Jlc3MgYmFyXG4gICAgICAgICAgICAvLyBjb21wbGV0ZWQgYW5kIHJlc29sdmUgdGhlIHByb21pc2UuXG4gICAgICAgICAgICBpZiAodGhyZWFkcy5ldmVyeShhY3RpdmUgPT4gIWFjdGl2ZSkpIHtcbiAgICAgICAgICAgICAgcHJvZ3Jlc3NCYXIuc3RvcCgpO1xuICAgICAgICAgICAgICByZXNvbHZlKGZhaWx1cmVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgKTtcbiAgICAgIC8vIE1hcmsgdGhlIHRocmVhZCBhcyBpbiB1c2UgYXMgdGhlIGNvbW1hbmQgZXhlY3V0aW9uIGhhcyBiZWVuIHN0YXJ0ZWQuXG4gICAgICB0aHJlYWRzW3RocmVhZF0gPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIFN0YXJ0IHRoZSBwcm9ncmVzcyBiYXJcbiAgICBwcm9ncmVzc0Jhci5zdGFydChwZW5kaW5nQ29tbWFuZHMubGVuZ3RoLCAwKTtcbiAgICAvLyBTdGFydCBydW5uaW5nIHRoZSBjb21tYW5kIG9uIGZpbGVzIGZyb20gdGhlIGxlYXN0IGluIGVhY2ggYXZhaWxhYmxlIHRocmVhZC5cbiAgICB0aHJlYWRzLmZvckVhY2goKF8sIGlkeCkgPT4gcnVuQ29tbWFuZEluVGhyZWFkKGlkeCkpO1xuICB9KTtcbn1cbiJdfQ==