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
        define("@angular/dev-infra-private/release/publish/cli", ["require", "exports", "tslib", "@angular/dev-infra-private/utils/config", "@angular/dev-infra-private/utils/console", "@angular/dev-infra-private/utils/git/github-yargs", "@angular/dev-infra-private/utils/git/index", "@angular/dev-infra-private/release/config", "@angular/dev-infra-private/release/publish"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReleasePublishCommandModule = void 0;
    var tslib_1 = require("tslib");
    var config_1 = require("@angular/dev-infra-private/utils/config");
    var console_1 = require("@angular/dev-infra-private/utils/console");
    var github_yargs_1 = require("@angular/dev-infra-private/utils/git/github-yargs");
    var index_1 = require("@angular/dev-infra-private/utils/git/index");
    var index_2 = require("@angular/dev-infra-private/release/config");
    var index_3 = require("@angular/dev-infra-private/release/publish");
    /** Yargs command builder for configuring the `ng-dev release publish` command. */
    function builder(argv) {
        return github_yargs_1.addGithubTokenOption(argv);
    }
    /** Yargs command handler for staging a release. */
    function handler() {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var git, config, releaseConfig, projectDir, task, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        git = index_1.GitClient.getInstance();
                        config = config_1.getConfig();
                        releaseConfig = index_2.getReleaseConfig(config);
                        projectDir = git.baseDir;
                        task = new index_3.ReleaseTool(releaseConfig, config.github, projectDir);
                        return [4 /*yield*/, task.run()];
                    case 1:
                        result = _a.sent();
                        switch (result) {
                            case index_3.CompletionState.FATAL_ERROR:
                                console_1.error(console_1.red("Release action has been aborted due to fatal errors. See above."));
                                process.exitCode = 2;
                                break;
                            case index_3.CompletionState.MANUALLY_ABORTED:
                                console_1.info(console_1.yellow("Release action has been manually aborted."));
                                process.exitCode = 1;
                                break;
                            case index_3.CompletionState.SUCCESS:
                                console_1.info(console_1.green("Release action has completed successfully."));
                                break;
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    /** CLI command module for publishing a release. */
    exports.ReleasePublishCommandModule = {
        builder: builder,
        handler: handler,
        command: 'publish',
        describe: 'Publish new releases and configure version branches.',
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vZGV2LWluZnJhL3JlbGVhc2UvcHVibGlzaC9jbGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztJQUlILGtFQUE2QztJQUM3QyxvRUFBb0U7SUFDcEUsa0ZBQWtFO0lBQ2xFLG9FQUFnRDtJQUNoRCxtRUFBaUQ7SUFFakQsb0VBQXFEO0lBT3JELGtGQUFrRjtJQUNsRixTQUFTLE9BQU8sQ0FBQyxJQUFVO1FBQ3pCLE9BQU8sbUNBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELG1EQUFtRDtJQUNuRCxTQUFlLE9BQU87Ozs7Ozt3QkFDZCxHQUFHLEdBQUcsaUJBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQzt3QkFDOUIsTUFBTSxHQUFHLGtCQUFTLEVBQUUsQ0FBQzt3QkFDckIsYUFBYSxHQUFHLHdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUN6QyxVQUFVLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQzt3QkFDekIsSUFBSSxHQUFHLElBQUksbUJBQVcsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQzt3QkFDeEQscUJBQU0sSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFBOzt3QkFBekIsTUFBTSxHQUFHLFNBQWdCO3dCQUUvQixRQUFRLE1BQU0sRUFBRTs0QkFDZCxLQUFLLHVCQUFlLENBQUMsV0FBVztnQ0FDOUIsZUFBSyxDQUFDLGFBQUcsQ0FBQyxpRUFBaUUsQ0FBQyxDQUFDLENBQUM7Z0NBQzlFLE9BQU8sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO2dDQUNyQixNQUFNOzRCQUNSLEtBQUssdUJBQWUsQ0FBQyxnQkFBZ0I7Z0NBQ25DLGNBQUksQ0FBQyxnQkFBTSxDQUFDLDJDQUEyQyxDQUFDLENBQUMsQ0FBQztnQ0FDMUQsT0FBTyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7Z0NBQ3JCLE1BQU07NEJBQ1IsS0FBSyx1QkFBZSxDQUFDLE9BQU87Z0NBQzFCLGNBQUksQ0FBQyxlQUFLLENBQUMsNENBQTRDLENBQUMsQ0FBQyxDQUFDO2dDQUMxRCxNQUFNO3lCQUNUOzs7OztLQUNGO0lBRUQsbURBQW1EO0lBQ3RDLFFBQUEsMkJBQTJCLEdBQTZDO1FBQ25GLE9BQU8sU0FBQTtRQUNQLE9BQU8sU0FBQTtRQUNQLE9BQU8sRUFBRSxTQUFTO1FBQ2xCLFFBQVEsRUFBRSxzREFBc0Q7S0FDakUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0FyZ3VtZW50cywgQXJndiwgQ29tbWFuZE1vZHVsZX0gZnJvbSAneWFyZ3MnO1xuXG5pbXBvcnQge2dldENvbmZpZ30gZnJvbSAnLi4vLi4vdXRpbHMvY29uZmlnJztcbmltcG9ydCB7ZXJyb3IsIGdyZWVuLCBpbmZvLCByZWQsIHllbGxvd30gZnJvbSAnLi4vLi4vdXRpbHMvY29uc29sZSc7XG5pbXBvcnQge2FkZEdpdGh1YlRva2VuT3B0aW9ufSBmcm9tICcuLi8uLi91dGlscy9naXQvZ2l0aHViLXlhcmdzJztcbmltcG9ydCB7R2l0Q2xpZW50fSBmcm9tICcuLi8uLi91dGlscy9naXQvaW5kZXgnO1xuaW1wb3J0IHtnZXRSZWxlYXNlQ29uZmlnfSBmcm9tICcuLi9jb25maWcvaW5kZXgnO1xuXG5pbXBvcnQge0NvbXBsZXRpb25TdGF0ZSwgUmVsZWFzZVRvb2x9IGZyb20gJy4vaW5kZXgnO1xuXG4vKiogQ29tbWFuZCBsaW5lIG9wdGlvbnMgZm9yIHB1Ymxpc2hpbmcgYSByZWxlYXNlLiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZWxlYXNlUHVibGlzaE9wdGlvbnMge1xuICBnaXRodWJUb2tlbjogc3RyaW5nO1xufVxuXG4vKiogWWFyZ3MgY29tbWFuZCBidWlsZGVyIGZvciBjb25maWd1cmluZyB0aGUgYG5nLWRldiByZWxlYXNlIHB1Ymxpc2hgIGNvbW1hbmQuICovXG5mdW5jdGlvbiBidWlsZGVyKGFyZ3Y6IEFyZ3YpOiBBcmd2PFJlbGVhc2VQdWJsaXNoT3B0aW9ucz4ge1xuICByZXR1cm4gYWRkR2l0aHViVG9rZW5PcHRpb24oYXJndik7XG59XG5cbi8qKiBZYXJncyBjb21tYW5kIGhhbmRsZXIgZm9yIHN0YWdpbmcgYSByZWxlYXNlLiAqL1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlcigpIHtcbiAgY29uc3QgZ2l0ID0gR2l0Q2xpZW50LmdldEluc3RhbmNlKCk7XG4gIGNvbnN0IGNvbmZpZyA9IGdldENvbmZpZygpO1xuICBjb25zdCByZWxlYXNlQ29uZmlnID0gZ2V0UmVsZWFzZUNvbmZpZyhjb25maWcpO1xuICBjb25zdCBwcm9qZWN0RGlyID0gZ2l0LmJhc2VEaXI7XG4gIGNvbnN0IHRhc2sgPSBuZXcgUmVsZWFzZVRvb2wocmVsZWFzZUNvbmZpZywgY29uZmlnLmdpdGh1YiwgcHJvamVjdERpcik7XG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRhc2sucnVuKCk7XG5cbiAgc3dpdGNoIChyZXN1bHQpIHtcbiAgICBjYXNlIENvbXBsZXRpb25TdGF0ZS5GQVRBTF9FUlJPUjpcbiAgICAgIGVycm9yKHJlZChgUmVsZWFzZSBhY3Rpb24gaGFzIGJlZW4gYWJvcnRlZCBkdWUgdG8gZmF0YWwgZXJyb3JzLiBTZWUgYWJvdmUuYCkpO1xuICAgICAgcHJvY2Vzcy5leGl0Q29kZSA9IDI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIENvbXBsZXRpb25TdGF0ZS5NQU5VQUxMWV9BQk9SVEVEOlxuICAgICAgaW5mbyh5ZWxsb3coYFJlbGVhc2UgYWN0aW9uIGhhcyBiZWVuIG1hbnVhbGx5IGFib3J0ZWQuYCkpO1xuICAgICAgcHJvY2Vzcy5leGl0Q29kZSA9IDE7XG4gICAgICBicmVhaztcbiAgICBjYXNlIENvbXBsZXRpb25TdGF0ZS5TVUNDRVNTOlxuICAgICAgaW5mbyhncmVlbihgUmVsZWFzZSBhY3Rpb24gaGFzIGNvbXBsZXRlZCBzdWNjZXNzZnVsbHkuYCkpO1xuICAgICAgYnJlYWs7XG4gIH1cbn1cblxuLyoqIENMSSBjb21tYW5kIG1vZHVsZSBmb3IgcHVibGlzaGluZyBhIHJlbGVhc2UuICovXG5leHBvcnQgY29uc3QgUmVsZWFzZVB1Ymxpc2hDb21tYW5kTW9kdWxlOiBDb21tYW5kTW9kdWxlPHt9LCBSZWxlYXNlUHVibGlzaE9wdGlvbnM+ID0ge1xuICBidWlsZGVyLFxuICBoYW5kbGVyLFxuICBjb21tYW5kOiAncHVibGlzaCcsXG4gIGRlc2NyaWJlOiAnUHVibGlzaCBuZXcgcmVsZWFzZXMgYW5kIGNvbmZpZ3VyZSB2ZXJzaW9uIGJyYW5jaGVzLicsXG59O1xuIl19