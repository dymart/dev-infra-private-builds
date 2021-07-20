/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __assign, __extends, __read, __spreadArray } from "tslib";
import { spawnSync } from 'child_process';
import { parse, SemVer } from 'semver';
import { getConfig } from '../config';
import { debug, info } from '../console';
import { DryRunError, isDryRun } from '../dry-run';
import { GithubClient } from './github';
import { getRepositoryGitUrl } from './github-urls';
/** Error for failed Git commands. */
var GitCommandError = /** @class */ (function (_super) {
    __extends(GitCommandError, _super);
    function GitCommandError(client, args) {
        var _this = 
        // Errors are not guaranteed to be caught. To ensure that we don't
        // accidentally leak the Github token that might be used in a command,
        // we sanitize the command that will be part of the error message.
        _super.call(this, "Command failed: git " + client.sanitizeConsoleOutput(args.join(' '))) || this;
        _this.args = args;
        return _this;
    }
    return GitCommandError;
}(Error));
export { GitCommandError };
/** Class that can be used to perform Git interactions with a given remote. **/
var GitClient = /** @class */ (function () {
    function GitClient(
    /** The full path to the root of the repository base. */
    baseDir, 
    /** The configuration, containing the github specific configuration. */
    config) {
        if (baseDir === void 0) { baseDir = determineRepoBaseDirFromCwd(); }
        if (config === void 0) { config = getConfig(baseDir); }
        this.baseDir = baseDir;
        this.config = config;
        /** Short-hand for accessing the default remote configuration. */
        this.remoteConfig = this.config.github;
        /** Octokit request parameters object for targeting the configured remote. */
        this.remoteParams = { owner: this.remoteConfig.owner, repo: this.remoteConfig.name };
        /** Instance of the Github client. */
        this.github = new GithubClient();
    }
    /** Executes the given git command. Throws if the command fails. */
    GitClient.prototype.run = function (args, options) {
        var result = this.runGraceful(args, options);
        if (result.status !== 0) {
            throw new GitCommandError(this, args);
        }
        // Omit `status` from the type so that it's obvious that the status is never
        // non-zero as explained in the method description.
        return result;
    };
    /**
     * Spawns a given Git command process. Does not throw if the command fails. Additionally,
     * if there is any stderr output, the output will be printed. This makes it easier to
     * info failed commands.
     */
    GitClient.prototype.runGraceful = function (args, options) {
        if (options === void 0) { options = {}; }
        /** The git command to be run. */
        var gitCommand = args[0];
        if (isDryRun() && gitCommand === 'push') {
            debug("\"git push\" is not able to be run in dryRun mode.");
            throw new DryRunError();
        }
        // To improve the debugging experience in case something fails, we print all executed Git
        // commands at the DEBUG level to better understand the git actions occurring. Verbose logging,
        // always logging at the INFO level, can be enabled either by setting the verboseLogging
        // property on the GitClient class or the options object provided to the method.
        var printFn = (GitClient.verboseLogging || options.verboseLogging) ? info : debug;
        // Note that we sanitize the command before printing it to the console. We do not want to
        // print an access token if it is contained in the command. It's common to share errors with
        // others if the tool failed, and we do not want to leak tokens.
        printFn('Executing: git', this.sanitizeConsoleOutput(args.join(' ')));
        var result = spawnSync('git', args, __assign(__assign({ cwd: this.baseDir, stdio: 'pipe' }, options), { 
            // Encoding is always `utf8` and not overridable. This ensures that this method
            // always returns `string` as output instead of buffers.
            encoding: 'utf8' }));
        if (result.stderr !== null) {
            // Git sometimes prints the command if it failed. This means that it could
            // potentially leak the Github token used for accessing the remote. To avoid
            // printing a token, we sanitize the string before printing the stderr output.
            process.stderr.write(this.sanitizeConsoleOutput(result.stderr));
        }
        return result;
    };
    /** Git URL that resolves to the configured repository. */
    GitClient.prototype.getRepoGitUrl = function () {
        return getRepositoryGitUrl(this.remoteConfig);
    };
    /** Whether the given branch contains the specified SHA. */
    GitClient.prototype.hasCommit = function (branchName, sha) {
        return this.run(['branch', branchName, '--contains', sha]).stdout !== '';
    };
    /** Gets the currently checked out branch or revision. */
    GitClient.prototype.getCurrentBranchOrRevision = function () {
        var branchName = this.run(['rev-parse', '--abbrev-ref', 'HEAD']).stdout.trim();
        // If no branch name could be resolved. i.e. `HEAD` has been returned, then Git
        // is currently in a detached state. In those cases, we just want to return the
        // currently checked out revision/SHA.
        if (branchName === 'HEAD') {
            return this.run(['rev-parse', 'HEAD']).stdout.trim();
        }
        return branchName;
    };
    /** Gets whether the current Git repository has uncommitted changes. */
    GitClient.prototype.hasUncommittedChanges = function () {
        return this.runGraceful(['diff-index', '--quiet', 'HEAD']).status !== 0;
    };
    /**
     * Checks out a requested branch or revision, optionally cleaning the state of the repository
     * before attempting the checking. Returns a boolean indicating whether the branch or revision
     * was cleanly checked out.
     */
    GitClient.prototype.checkout = function (branchOrRevision, cleanState) {
        if (cleanState) {
            // Abort any outstanding ams.
            this.runGraceful(['am', '--abort'], { stdio: 'ignore' });
            // Abort any outstanding cherry-picks.
            this.runGraceful(['cherry-pick', '--abort'], { stdio: 'ignore' });
            // Abort any outstanding rebases.
            this.runGraceful(['rebase', '--abort'], { stdio: 'ignore' });
            // Clear any changes in the current repo.
            this.runGraceful(['reset', '--hard'], { stdio: 'ignore' });
        }
        return this.runGraceful(['checkout', branchOrRevision], { stdio: 'ignore' }).status === 0;
    };
    /** Gets the latest git tag on the current branch that matches SemVer. */
    GitClient.prototype.getLatestSemverTag = function () {
        var semVerOptions = { loose: true };
        var tags = this.runGraceful(['tag', '--sort=-committerdate', '--merged']).stdout.split('\n');
        var latestTag = tags.find(function (tag) { return parse(tag, semVerOptions); });
        if (latestTag === undefined) {
            throw new Error("Unable to find a SemVer matching tag on \"" + this.getCurrentBranchOrRevision() + "\"");
        }
        return new SemVer(latestTag, semVerOptions);
    };
    /** Retrieves the git tag matching the provided SemVer, if it exists. */
    GitClient.prototype.getMatchingTagForSemver = function (semver) {
        var semVerOptions = { loose: true };
        var tags = this.runGraceful(['tag', '--sort=-committerdate', '--merged']).stdout.split('\n');
        var matchingTag = tags.find(function (tag) { var _a; return ((_a = parse(tag, semVerOptions)) === null || _a === void 0 ? void 0 : _a.compare(semver)) === 0; });
        if (matchingTag === undefined) {
            throw new Error("Unable to find a tag for the version: \"" + semver.format() + "\"");
        }
        return matchingTag;
    };
    /** Retrieve a list of all files in the repository changed since the provided shaOrRef. */
    GitClient.prototype.allChangesFilesSince = function (shaOrRef) {
        if (shaOrRef === void 0) { shaOrRef = 'HEAD'; }
        return Array.from(new Set(__spreadArray(__spreadArray([], __read(gitOutputAsArray(this.runGraceful(['diff', '--name-only', '--diff-filter=d', shaOrRef])))), __read(gitOutputAsArray(this.runGraceful(['ls-files', '--others', '--exclude-standard']))))));
    };
    /** Retrieve a list of all files currently staged in the repostitory. */
    GitClient.prototype.allStagedFiles = function () {
        return gitOutputAsArray(this.runGraceful(['diff', '--name-only', '--diff-filter=ACM', '--staged']));
    };
    /** Retrieve a list of all files tracked in the repository. */
    GitClient.prototype.allFiles = function () {
        return gitOutputAsArray(this.runGraceful(['ls-files']));
    };
    /**
     * Sanitizes the given console message. This method can be overridden by
     * derived classes. e.g. to sanitize access tokens from Git commands.
     */
    GitClient.prototype.sanitizeConsoleOutput = function (value) {
        return value;
    };
    /** Set the verbose logging state of all git client instances. */
    GitClient.setVerboseLoggingState = function (verbose) {
        GitClient.verboseLogging = verbose;
    };
    /**
     * Static method to get the singleton instance of the `GitClient`, creating it
     * if it has not yet been created.
     */
    GitClient.get = function () {
        if (!this._unauthenticatedInstance) {
            GitClient._unauthenticatedInstance = new GitClient();
        }
        return GitClient._unauthenticatedInstance;
    };
    /** Whether verbose logging of Git actions should be used. */
    GitClient.verboseLogging = false;
    return GitClient;
}());
export { GitClient };
/**
 * Takes the output from `run` and `runGraceful` and returns an array of strings for each
 * new line. Git commands typically return multiple output values for a command a set of
 * strings separated by new lines.
 *
 * Note: This is specifically created as a locally available function for usage as convenience
 * utility within `GitClient`'s methods to create outputs as array.
 */
function gitOutputAsArray(gitCommandResult) {
    return gitCommandResult.stdout.split('\n').map(function (x) { return x.trim(); }).filter(function (x) { return !!x; });
}
/** Determines the repository base directory from the current working directory. */
function determineRepoBaseDirFromCwd() {
    // TODO(devversion): Replace with common spawn sync utility once available.
    var _a = spawnSync('git', ['rev-parse --show-toplevel'], { shell: true, stdio: 'pipe', encoding: 'utf8' }), stdout = _a.stdout, stderr = _a.stderr, status = _a.status;
    if (status !== 0) {
        throw Error("Unable to find the path to the base directory of the repository.\n" +
            "Was the command run from inside of the repo?\n\n" +
            ("" + stderr));
    }
    return stdout.trim();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0LWNsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2Rldi1pbmZyYS91dGlscy9naXQvZ2l0LWNsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBcUMsTUFBTSxlQUFlLENBQUM7QUFDNUUsT0FBTyxFQUEyQixLQUFLLEVBQUUsTUFBTSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBRy9ELE9BQU8sRUFBQyxTQUFTLEVBQTRCLE1BQU0sV0FBVyxDQUFDO0FBQy9ELE9BQU8sRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxXQUFXLEVBQUUsUUFBUSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRWpELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDdEMsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRWxELHFDQUFxQztBQUNyQztJQUFxQyxtQ0FBSztJQUN4Qyx5QkFBWSxNQUFpQixFQUFTLElBQWM7UUFBcEQ7UUFDRSxrRUFBa0U7UUFDbEUsc0VBQXNFO1FBQ3RFLGtFQUFrRTtRQUNsRSxrQkFBTSx5QkFBdUIsTUFBTSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUcsQ0FBQyxTQUM3RTtRQUxxQyxVQUFJLEdBQUosSUFBSSxDQUFVOztJQUtwRCxDQUFDO0lBQ0gsc0JBQUM7QUFBRCxDQUFDLEFBUEQsQ0FBcUMsS0FBSyxHQU96Qzs7QUFPRCwrRUFBK0U7QUFDL0U7SUFVRTtJQUNJLHdEQUF3RDtJQUMvQyxPQUF1QztJQUNoRCx1RUFBdUU7SUFDOUQsTUFBMkI7UUFGM0Isd0JBQUEsRUFBQSxVQUFVLDJCQUEyQixFQUFFO1FBRXZDLHVCQUFBLEVBQUEsU0FBUyxTQUFTLENBQUMsT0FBTyxDQUFDO1FB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QU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN2QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7c3Bhd25TeW5jLCBTcGF3blN5bmNPcHRpb25zLCBTcGF3blN5bmNSZXR1cm5zfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCB7T3B0aW9ucyBhcyBTZW1WZXJPcHRpb25zLCBwYXJzZSwgU2VtVmVyfSBmcm9tICdzZW12ZXInO1xuXG5pbXBvcnQge3NwYXduV2l0aERlYnVnT3V0cHV0fSBmcm9tICcuLi9jaGlsZC1wcm9jZXNzJztcbmltcG9ydCB7Z2V0Q29uZmlnLCBHaXRodWJDb25maWcsIE5nRGV2Q29uZmlnfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0IHtkZWJ1ZywgaW5mb30gZnJvbSAnLi4vY29uc29sZSc7XG5pbXBvcnQge0RyeVJ1bkVycm9yLCBpc0RyeVJ1bn0gZnJvbSAnLi4vZHJ5LXJ1bic7XG5cbmltcG9ydCB7R2l0aHViQ2xpZW50fSBmcm9tICcuL2dpdGh1Yic7XG5pbXBvcnQge2dldFJlcG9zaXRvcnlHaXRVcmx9IGZyb20gJy4vZ2l0aHViLXVybHMnO1xuXG4vKiogRXJyb3IgZm9yIGZhaWxlZCBHaXQgY29tbWFuZHMuICovXG5leHBvcnQgY2xhc3MgR2l0Q29tbWFuZEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihjbGllbnQ6IEdpdENsaWVudCwgcHVibGljIGFyZ3M6IHN0cmluZ1tdKSB7XG4gICAgLy8gRXJyb3JzIGFyZSBub3QgZ3VhcmFudGVlZCB0byBiZSBjYXVnaHQuIFRvIGVuc3VyZSB0aGF0IHdlIGRvbid0XG4gICAgLy8gYWNjaWRlbnRhbGx5IGxlYWsgdGhlIEdpdGh1YiB0b2tlbiB0aGF0IG1pZ2h0IGJlIHVzZWQgaW4gYSBjb21tYW5kLFxuICAgIC8vIHdlIHNhbml0aXplIHRoZSBjb21tYW5kIHRoYXQgd2lsbCBiZSBwYXJ0IG9mIHRoZSBlcnJvciBtZXNzYWdlLlxuICAgIHN1cGVyKGBDb21tYW5kIGZhaWxlZDogZ2l0ICR7Y2xpZW50LnNhbml0aXplQ29uc29sZU91dHB1dChhcmdzLmpvaW4oJyAnKSl9YCk7XG4gIH1cbn1cblxuLyoqIFRoZSBvcHRpb25zIGF2YWlsYWJsZSBmb3IgdGhlIGBHaXRDbGllbnRgYHJ1bmAgYW5kIGBydW5HcmFjZWZ1bGAgbWV0aG9kcy4gKi9cbnR5cGUgR2l0Q29tbWFuZFJ1bk9wdGlvbnMgPSBTcGF3blN5bmNPcHRpb25zJntcbiAgdmVyYm9zZUxvZ2dpbmc/OiBib29sZWFuO1xufTtcblxuLyoqIENsYXNzIHRoYXQgY2FuIGJlIHVzZWQgdG8gcGVyZm9ybSBHaXQgaW50ZXJhY3Rpb25zIHdpdGggYSBnaXZlbiByZW1vdGUuICoqL1xuZXhwb3J0IGNsYXNzIEdpdENsaWVudCB7XG4gIC8qKiBTaG9ydC1oYW5kIGZvciBhY2Nlc3NpbmcgdGhlIGRlZmF1bHQgcmVtb3RlIGNvbmZpZ3VyYXRpb24uICovXG4gIHJlYWRvbmx5IHJlbW90ZUNvbmZpZzogR2l0aHViQ29uZmlnID0gdGhpcy5jb25maWcuZ2l0aHViO1xuXG4gIC8qKiBPY3Rva2l0IHJlcXVlc3QgcGFyYW1ldGVycyBvYmplY3QgZm9yIHRhcmdldGluZyB0aGUgY29uZmlndXJlZCByZW1vdGUuICovXG4gIHJlYWRvbmx5IHJlbW90ZVBhcmFtcyA9IHtvd25lcjogdGhpcy5yZW1vdGVDb25maWcub3duZXIsIHJlcG86IHRoaXMucmVtb3RlQ29uZmlnLm5hbWV9O1xuXG4gIC8qKiBJbnN0YW5jZSBvZiB0aGUgR2l0aHViIGNsaWVudC4gKi9cbiAgcmVhZG9ubHkgZ2l0aHViID0gbmV3IEdpdGh1YkNsaWVudCgpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgLyoqIFRoZSBmdWxsIHBhdGggdG8gdGhlIHJvb3Qgb2YgdGhlIHJlcG9zaXRvcnkgYmFzZS4gKi9cbiAgICAgIHJlYWRvbmx5IGJhc2VEaXIgPSBkZXRlcm1pbmVSZXBvQmFzZURpckZyb21Dd2QoKSxcbiAgICAgIC8qKiBUaGUgY29uZmlndXJhdGlvbiwgY29udGFpbmluZyB0aGUgZ2l0aHViIHNwZWNpZmljIGNvbmZpZ3VyYXRpb24uICovXG4gICAgICByZWFkb25seSBjb25maWcgPSBnZXRDb25maWcoYmFzZURpcikpIHt9XG5cbiAgLyoqIEV4ZWN1dGVzIHRoZSBnaXZlbiBnaXQgY29tbWFuZC4gVGhyb3dzIGlmIHRoZSBjb21tYW5kIGZhaWxzLiAqL1xuICBydW4oYXJnczogc3RyaW5nW10sIG9wdGlvbnM/OiBHaXRDb21tYW5kUnVuT3B0aW9ucyk6IE9taXQ8U3Bhd25TeW5jUmV0dXJuczxzdHJpbmc+LCAnc3RhdHVzJz4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMucnVuR3JhY2VmdWwoYXJncywgb3B0aW9ucyk7XG4gICAgaWYgKHJlc3VsdC5zdGF0dXMgIT09IDApIHtcbiAgICAgIHRocm93IG5ldyBHaXRDb21tYW5kRXJyb3IodGhpcywgYXJncyk7XG4gICAgfVxuICAgIC8vIE9taXQgYHN0YXR1c2AgZnJvbSB0aGUgdHlwZSBzbyB0aGF0IGl0J3Mgb2J2aW91cyB0aGF0IHRoZSBzdGF0dXMgaXMgbmV2ZXJcbiAgICAvLyBub24temVybyBhcyBleHBsYWluZWQgaW4gdGhlIG1ldGhvZCBkZXNjcmlwdGlvbi5cbiAgICByZXR1cm4gcmVzdWx0IGFzIE9taXQ8U3Bhd25TeW5jUmV0dXJuczxzdHJpbmc+LCAnc3RhdHVzJz47XG4gIH1cblxuICAvKipcbiAgICogU3Bhd25zIGEgZ2l2ZW4gR2l0IGNvbW1hbmQgcHJvY2Vzcy4gRG9lcyBub3QgdGhyb3cgaWYgdGhlIGNvbW1hbmQgZmFpbHMuIEFkZGl0aW9uYWxseSxcbiAgICogaWYgdGhlcmUgaXMgYW55IHN0ZGVyciBvdXRwdXQsIHRoZSBvdXRwdXQgd2lsbCBiZSBwcmludGVkLiBUaGlzIG1ha2VzIGl0IGVhc2llciB0b1xuICAgKiBpbmZvIGZhaWxlZCBjb21tYW5kcy5cbiAgICovXG4gIHJ1bkdyYWNlZnVsKGFyZ3M6IHN0cmluZ1tdLCBvcHRpb25zOiBHaXRDb21tYW5kUnVuT3B0aW9ucyA9IHt9KTogU3Bhd25TeW5jUmV0dXJuczxzdHJpbmc+IHtcbiAgICAvKiogVGhlIGdpdCBjb21tYW5kIHRvIGJlIHJ1bi4gKi9cbiAgICBjb25zdCBnaXRDb21tYW5kID0gYXJnc1swXTtcblxuICAgIGlmIChpc0RyeVJ1bigpICYmIGdpdENvbW1hbmQgPT09ICdwdXNoJykge1xuICAgICAgZGVidWcoYFwiZ2l0IHB1c2hcIiBpcyBub3QgYWJsZSB0byBiZSBydW4gaW4gZHJ5UnVuIG1vZGUuYCk7XG4gICAgICB0aHJvdyBuZXcgRHJ5UnVuRXJyb3IoKTtcbiAgICB9XG5cbiAgICAvLyBUbyBpbXByb3ZlIHRoZSBkZWJ1Z2dpbmcgZXhwZXJpZW5jZSBpbiBjYXNlIHNvbWV0aGluZyBmYWlscywgd2UgcHJpbnQgYWxsIGV4ZWN1dGVkIEdpdFxuICAgIC8vIGNvbW1hbmRzIGF0IHRoZSBERUJVRyBsZXZlbCB0byBiZXR0ZXIgdW5kZXJzdGFuZCB0aGUgZ2l0IGFjdGlvbnMgb2NjdXJyaW5nLiBWZXJib3NlIGxvZ2dpbmcsXG4gICAgLy8gYWx3YXlzIGxvZ2dpbmcgYXQgdGhlIElORk8gbGV2ZWwsIGNhbiBiZSBlbmFibGVkIGVpdGhlciBieSBzZXR0aW5nIHRoZSB2ZXJib3NlTG9nZ2luZ1xuICAgIC8vIHByb3BlcnR5IG9uIHRoZSBHaXRDbGllbnQgY2xhc3Mgb3IgdGhlIG9wdGlvbnMgb2JqZWN0IHByb3ZpZGVkIHRvIHRoZSBtZXRob2QuXG4gICAgY29uc3QgcHJpbnRGbiA9IChHaXRDbGllbnQudmVyYm9zZUxvZ2dpbmcgfHwgb3B0aW9ucy52ZXJib3NlTG9nZ2luZykgPyBpbmZvIDogZGVidWc7XG4gICAgLy8gTm90ZSB0aGF0IHdlIHNhbml0aXplIHRoZSBjb21tYW5kIGJlZm9yZSBwcmludGluZyBpdCB0byB0aGUgY29uc29sZS4gV2UgZG8gbm90IHdhbnQgdG9cbiAgICAvLyBwcmludCBhbiBhY2Nlc3MgdG9rZW4gaWYgaXQgaXMgY29udGFpbmVkIGluIHRoZSBjb21tYW5kLiBJdCdzIGNvbW1vbiB0byBzaGFyZSBlcnJvcnMgd2l0aFxuICAgIC8vIG90aGVycyBpZiB0aGUgdG9vbCBmYWlsZWQsIGFuZCB3ZSBkbyBub3Qgd2FudCB0byBsZWFrIHRva2Vucy5cbiAgICBwcmludEZuKCdFeGVjdXRpbmc6IGdpdCcsIHRoaXMuc2FuaXRpemVDb25zb2xlT3V0cHV0KGFyZ3Muam9pbignICcpKSk7XG5cbiAgICBjb25zdCByZXN1bHQgPSBzcGF3blN5bmMoJ2dpdCcsIGFyZ3MsIHtcbiAgICAgIGN3ZDogdGhpcy5iYXNlRGlyLFxuICAgICAgc3RkaW86ICdwaXBlJyxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAvLyBFbmNvZGluZyBpcyBhbHdheXMgYHV0ZjhgIGFuZCBub3Qgb3ZlcnJpZGFibGUuIFRoaXMgZW5zdXJlcyB0aGF0IHRoaXMgbWV0aG9kXG4gICAgICAvLyBhbHdheXMgcmV0dXJucyBgc3RyaW5nYCBhcyBvdXRwdXQgaW5zdGVhZCBvZiBidWZmZXJzLlxuICAgICAgZW5jb2Rpbmc6ICd1dGY4JyxcbiAgICB9KTtcblxuICAgIGlmIChyZXN1bHQuc3RkZXJyICE9PSBudWxsKSB7XG4gICAgICAvLyBHaXQgc29tZXRpbWVzIHByaW50cyB0aGUgY29tbWFuZCBpZiBpdCBmYWlsZWQuIFRoaXMgbWVhbnMgdGhhdCBpdCBjb3VsZFxuICAgICAgLy8gcG90ZW50aWFsbHkgbGVhayB0aGUgR2l0aHViIHRva2VuIHVzZWQgZm9yIGFjY2Vzc2luZyB0aGUgcmVtb3RlLiBUbyBhdm9pZFxuICAgICAgLy8gcHJpbnRpbmcgYSB0b2tlbiwgd2Ugc2FuaXRpemUgdGhlIHN0cmluZyBiZWZvcmUgcHJpbnRpbmcgdGhlIHN0ZGVyciBvdXRwdXQuXG4gICAgICBwcm9jZXNzLnN0ZGVyci53cml0ZSh0aGlzLnNhbml0aXplQ29uc29sZU91dHB1dChyZXN1bHQuc3RkZXJyKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKiBHaXQgVVJMIHRoYXQgcmVzb2x2ZXMgdG8gdGhlIGNvbmZpZ3VyZWQgcmVwb3NpdG9yeS4gKi9cbiAgZ2V0UmVwb0dpdFVybCgpIHtcbiAgICByZXR1cm4gZ2V0UmVwb3NpdG9yeUdpdFVybCh0aGlzLnJlbW90ZUNvbmZpZyk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgZ2l2ZW4gYnJhbmNoIGNvbnRhaW5zIHRoZSBzcGVjaWZpZWQgU0hBLiAqL1xuICBoYXNDb21taXQoYnJhbmNoTmFtZTogc3RyaW5nLCBzaGE6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnJ1bihbJ2JyYW5jaCcsIGJyYW5jaE5hbWUsICctLWNvbnRhaW5zJywgc2hhXSkuc3Rkb3V0ICE9PSAnJztcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBjdXJyZW50bHkgY2hlY2tlZCBvdXQgYnJhbmNoIG9yIHJldmlzaW9uLiAqL1xuICBnZXRDdXJyZW50QnJhbmNoT3JSZXZpc2lvbigpOiBzdHJpbmcge1xuICAgIGNvbnN0IGJyYW5jaE5hbWUgPSB0aGlzLnJ1bihbJ3Jldi1wYXJzZScsICctLWFiYnJldi1yZWYnLCAnSEVBRCddKS5zdGRvdXQudHJpbSgpO1xuICAgIC8vIElmIG5vIGJyYW5jaCBuYW1lIGNvdWxkIGJlIHJlc29sdmVkLiBpLmUuIGBIRUFEYCBoYXMgYmVlbiByZXR1cm5lZCwgdGhlbiBHaXRcbiAgICAvLyBpcyBjdXJyZW50bHkgaW4gYSBkZXRhY2hlZCBzdGF0ZS4gSW4gdGhvc2UgY2FzZXMsIHdlIGp1c3Qgd2FudCB0byByZXR1cm4gdGhlXG4gICAgLy8gY3VycmVudGx5IGNoZWNrZWQgb3V0IHJldmlzaW9uL1NIQS5cbiAgICBpZiAoYnJhbmNoTmFtZSA9PT0gJ0hFQUQnKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydW4oWydyZXYtcGFyc2UnLCAnSEVBRCddKS5zdGRvdXQudHJpbSgpO1xuICAgIH1cbiAgICByZXR1cm4gYnJhbmNoTmFtZTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIGN1cnJlbnQgR2l0IHJlcG9zaXRvcnkgaGFzIHVuY29tbWl0dGVkIGNoYW5nZXMuICovXG4gIGhhc1VuY29tbWl0dGVkQ2hhbmdlcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5ydW5HcmFjZWZ1bChbJ2RpZmYtaW5kZXgnLCAnLS1xdWlldCcsICdIRUFEJ10pLnN0YXR1cyAhPT0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3Mgb3V0IGEgcmVxdWVzdGVkIGJyYW5jaCBvciByZXZpc2lvbiwgb3B0aW9uYWxseSBjbGVhbmluZyB0aGUgc3RhdGUgb2YgdGhlIHJlcG9zaXRvcnlcbiAgICogYmVmb3JlIGF0dGVtcHRpbmcgdGhlIGNoZWNraW5nLiBSZXR1cm5zIGEgYm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIGJyYW5jaCBvciByZXZpc2lvblxuICAgKiB3YXMgY2xlYW5seSBjaGVja2VkIG91dC5cbiAgICovXG4gIGNoZWNrb3V0KGJyYW5jaE9yUmV2aXNpb246IHN0cmluZywgY2xlYW5TdGF0ZTogYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgIGlmIChjbGVhblN0YXRlKSB7XG4gICAgICAvLyBBYm9ydCBhbnkgb3V0c3RhbmRpbmcgYW1zLlxuICAgICAgdGhpcy5ydW5HcmFjZWZ1bChbJ2FtJywgJy0tYWJvcnQnXSwge3N0ZGlvOiAnaWdub3JlJ30pO1xuICAgICAgLy8gQWJvcnQgYW55IG91dHN0YW5kaW5nIGNoZXJyeS1waWNrcy5cbiAgICAgIHRoaXMucnVuR3JhY2VmdWwoWydjaGVycnktcGljaycsICctLWFib3J0J10sIHtzdGRpbzogJ2lnbm9yZSd9KTtcbiAgICAgIC8vIEFib3J0IGFueSBvdXRzdGFuZGluZyByZWJhc2VzLlxuICAgICAgdGhpcy5ydW5HcmFjZWZ1bChbJ3JlYmFzZScsICctLWFib3J0J10sIHtzdGRpbzogJ2lnbm9yZSd9KTtcbiAgICAgIC8vIENsZWFyIGFueSBjaGFuZ2VzIGluIHRoZSBjdXJyZW50IHJlcG8uXG4gICAgICB0aGlzLnJ1bkdyYWNlZnVsKFsncmVzZXQnLCAnLS1oYXJkJ10sIHtzdGRpbzogJ2lnbm9yZSd9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucnVuR3JhY2VmdWwoWydjaGVja291dCcsIGJyYW5jaE9yUmV2aXNpb25dLCB7c3RkaW86ICdpZ25vcmUnfSkuc3RhdHVzID09PSAwO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGxhdGVzdCBnaXQgdGFnIG9uIHRoZSBjdXJyZW50IGJyYW5jaCB0aGF0IG1hdGNoZXMgU2VtVmVyLiAqL1xuICBnZXRMYXRlc3RTZW12ZXJUYWcoKTogU2VtVmVyIHtcbiAgICBjb25zdCBzZW1WZXJPcHRpb25zOiBTZW1WZXJPcHRpb25zID0ge2xvb3NlOiB0cnVlfTtcbiAgICBjb25zdCB0YWdzID0gdGhpcy5ydW5HcmFjZWZ1bChbJ3RhZycsICctLXNvcnQ9LWNvbW1pdHRlcmRhdGUnLCAnLS1tZXJnZWQnXSkuc3Rkb3V0LnNwbGl0KCdcXG4nKTtcbiAgICBjb25zdCBsYXRlc3RUYWcgPSB0YWdzLmZpbmQoKHRhZzogc3RyaW5nKSA9PiBwYXJzZSh0YWcsIHNlbVZlck9wdGlvbnMpKTtcblxuICAgIGlmIChsYXRlc3RUYWcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBVbmFibGUgdG8gZmluZCBhIFNlbVZlciBtYXRjaGluZyB0YWcgb24gXCIke3RoaXMuZ2V0Q3VycmVudEJyYW5jaE9yUmV2aXNpb24oKX1cImApO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFNlbVZlcihsYXRlc3RUYWcsIHNlbVZlck9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIFJldHJpZXZlcyB0aGUgZ2l0IHRhZyBtYXRjaGluZyB0aGUgcHJvdmlkZWQgU2VtVmVyLCBpZiBpdCBleGlzdHMuICovXG4gIGdldE1hdGNoaW5nVGFnRm9yU2VtdmVyKHNlbXZlcjogU2VtVmVyKTogc3RyaW5nIHtcbiAgICBjb25zdCBzZW1WZXJPcHRpb25zOiBTZW1WZXJPcHRpb25zID0ge2xvb3NlOiB0cnVlfTtcbiAgICBjb25zdCB0YWdzID0gdGhpcy5ydW5HcmFjZWZ1bChbJ3RhZycsICctLXNvcnQ9LWNvbW1pdHRlcmRhdGUnLCAnLS1tZXJnZWQnXSkuc3Rkb3V0LnNwbGl0KCdcXG4nKTtcbiAgICBjb25zdCBtYXRjaGluZ1RhZyA9XG4gICAgICAgIHRhZ3MuZmluZCgodGFnOiBzdHJpbmcpID0+IHBhcnNlKHRhZywgc2VtVmVyT3B0aW9ucyk/LmNvbXBhcmUoc2VtdmVyKSA9PT0gMCk7XG5cbiAgICBpZiAobWF0Y2hpbmdUYWcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gZmluZCBhIHRhZyBmb3IgdGhlIHZlcnNpb246IFwiJHtzZW12ZXIuZm9ybWF0KCl9XCJgKTtcbiAgICB9XG4gICAgcmV0dXJuIG1hdGNoaW5nVGFnO1xuICB9XG5cbiAgLyoqIFJldHJpZXZlIGEgbGlzdCBvZiBhbGwgZmlsZXMgaW4gdGhlIHJlcG9zaXRvcnkgY2hhbmdlZCBzaW5jZSB0aGUgcHJvdmlkZWQgc2hhT3JSZWYuICovXG4gIGFsbENoYW5nZXNGaWxlc1NpbmNlKHNoYU9yUmVmID0gJ0hFQUQnKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQoW1xuICAgICAgLi4uZ2l0T3V0cHV0QXNBcnJheSh0aGlzLnJ1bkdyYWNlZnVsKFsnZGlmZicsICctLW5hbWUtb25seScsICctLWRpZmYtZmlsdGVyPWQnLCBzaGFPclJlZl0pKSxcbiAgICAgIC4uLmdpdE91dHB1dEFzQXJyYXkodGhpcy5ydW5HcmFjZWZ1bChbJ2xzLWZpbGVzJywgJy0tb3RoZXJzJywgJy0tZXhjbHVkZS1zdGFuZGFyZCddKSksXG4gICAgXSkpO1xuICB9XG5cbiAgLyoqIFJldHJpZXZlIGEgbGlzdCBvZiBhbGwgZmlsZXMgY3VycmVudGx5IHN0YWdlZCBpbiB0aGUgcmVwb3N0aXRvcnkuICovXG4gIGFsbFN0YWdlZEZpbGVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gZ2l0T3V0cHV0QXNBcnJheShcbiAgICAgICAgdGhpcy5ydW5HcmFjZWZ1bChbJ2RpZmYnLCAnLS1uYW1lLW9ubHknLCAnLS1kaWZmLWZpbHRlcj1BQ00nLCAnLS1zdGFnZWQnXSkpO1xuICB9XG5cbiAgLyoqIFJldHJpZXZlIGEgbGlzdCBvZiBhbGwgZmlsZXMgdHJhY2tlZCBpbiB0aGUgcmVwb3NpdG9yeS4gKi9cbiAgYWxsRmlsZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBnaXRPdXRwdXRBc0FycmF5KHRoaXMucnVuR3JhY2VmdWwoWydscy1maWxlcyddKSk7XG4gIH1cblxuICAvKipcbiAgICogU2FuaXRpemVzIHRoZSBnaXZlbiBjb25zb2xlIG1lc3NhZ2UuIFRoaXMgbWV0aG9kIGNhbiBiZSBvdmVycmlkZGVuIGJ5XG4gICAqIGRlcml2ZWQgY2xhc3Nlcy4gZS5nLiB0byBzYW5pdGl6ZSBhY2Nlc3MgdG9rZW5zIGZyb20gR2l0IGNvbW1hbmRzLlxuICAgKi9cbiAgc2FuaXRpemVDb25zb2xlT3V0cHV0KHZhbHVlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvKiogV2hldGhlciB2ZXJib3NlIGxvZ2dpbmcgb2YgR2l0IGFjdGlvbnMgc2hvdWxkIGJlIHVzZWQuICovXG4gIHByaXZhdGUgc3RhdGljIHZlcmJvc2VMb2dnaW5nID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBzaW5nbGV0b24gaW5zdGFuY2Ugb2YgdGhlIHVuYXV0aGVudGljYXRlZCBgR2l0Q2xpZW50YC4gKi9cbiAgcHJpdmF0ZSBzdGF0aWMgX3VuYXV0aGVudGljYXRlZEluc3RhbmNlOiBHaXRDbGllbnQ7XG5cbiAgLyoqIFNldCB0aGUgdmVyYm9zZSBsb2dnaW5nIHN0YXRlIG9mIGFsbCBnaXQgY2xpZW50IGluc3RhbmNlcy4gKi9cbiAgc3RhdGljIHNldFZlcmJvc2VMb2dnaW5nU3RhdGUodmVyYm9zZTogYm9vbGVhbikge1xuICAgIEdpdENsaWVudC52ZXJib3NlTG9nZ2luZyA9IHZlcmJvc2U7XG4gIH1cblxuICAvKipcbiAgICogU3RhdGljIG1ldGhvZCB0byBnZXQgdGhlIHNpbmdsZXRvbiBpbnN0YW5jZSBvZiB0aGUgYEdpdENsaWVudGAsIGNyZWF0aW5nIGl0XG4gICAqIGlmIGl0IGhhcyBub3QgeWV0IGJlZW4gY3JlYXRlZC5cbiAgICovXG4gIHN0YXRpYyBnZXQoKTogR2l0Q2xpZW50IHtcbiAgICBpZiAoIXRoaXMuX3VuYXV0aGVudGljYXRlZEluc3RhbmNlKSB7XG4gICAgICBHaXRDbGllbnQuX3VuYXV0aGVudGljYXRlZEluc3RhbmNlID0gbmV3IEdpdENsaWVudCgpO1xuICAgIH1cbiAgICByZXR1cm4gR2l0Q2xpZW50Ll91bmF1dGhlbnRpY2F0ZWRJbnN0YW5jZTtcbiAgfVxufVxuXG4vKipcbiAqIFRha2VzIHRoZSBvdXRwdXQgZnJvbSBgcnVuYCBhbmQgYHJ1bkdyYWNlZnVsYCBhbmQgcmV0dXJucyBhbiBhcnJheSBvZiBzdHJpbmdzIGZvciBlYWNoXG4gKiBuZXcgbGluZS4gR2l0IGNvbW1hbmRzIHR5cGljYWxseSByZXR1cm4gbXVsdGlwbGUgb3V0cHV0IHZhbHVlcyBmb3IgYSBjb21tYW5kIGEgc2V0IG9mXG4gKiBzdHJpbmdzIHNlcGFyYXRlZCBieSBuZXcgbGluZXMuXG4gKlxuICogTm90ZTogVGhpcyBpcyBzcGVjaWZpY2FsbHkgY3JlYXRlZCBhcyBhIGxvY2FsbHkgYXZhaWxhYmxlIGZ1bmN0aW9uIGZvciB1c2FnZSBhcyBjb252ZW5pZW5jZVxuICogdXRpbGl0eSB3aXRoaW4gYEdpdENsaWVudGAncyBtZXRob2RzIHRvIGNyZWF0ZSBvdXRwdXRzIGFzIGFycmF5LlxuICovXG5mdW5jdGlvbiBnaXRPdXRwdXRBc0FycmF5KGdpdENvbW1hbmRSZXN1bHQ6IFNwYXduU3luY1JldHVybnM8c3RyaW5nPik6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIGdpdENvbW1hbmRSZXN1bHQuc3Rkb3V0LnNwbGl0KCdcXG4nKS5tYXAoeCA9PiB4LnRyaW0oKSkuZmlsdGVyKHggPT4gISF4KTtcbn1cblxuLyoqIERldGVybWluZXMgdGhlIHJlcG9zaXRvcnkgYmFzZSBkaXJlY3RvcnkgZnJvbSB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS4gKi9cbmZ1bmN0aW9uIGRldGVybWluZVJlcG9CYXNlRGlyRnJvbUN3ZCgpIHtcbiAgLy8gVE9ETyhkZXZ2ZXJzaW9uKTogUmVwbGFjZSB3aXRoIGNvbW1vbiBzcGF3biBzeW5jIHV0aWxpdHkgb25jZSBhdmFpbGFibGUuXG4gIGNvbnN0IHtzdGRvdXQsIHN0ZGVyciwgc3RhdHVzfSA9IHNwYXduU3luYyhcbiAgICAgICdnaXQnLCBbJ3Jldi1wYXJzZSAtLXNob3ctdG9wbGV2ZWwnXSwge3NoZWxsOiB0cnVlLCBzdGRpbzogJ3BpcGUnLCBlbmNvZGluZzogJ3V0ZjgnfSk7XG4gIGlmIChzdGF0dXMgIT09IDApIHtcbiAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgYFVuYWJsZSB0byBmaW5kIHRoZSBwYXRoIHRvIHRoZSBiYXNlIGRpcmVjdG9yeSBvZiB0aGUgcmVwb3NpdG9yeS5cXG5gICtcbiAgICAgICAgYFdhcyB0aGUgY29tbWFuZCBydW4gZnJvbSBpbnNpZGUgb2YgdGhlIHJlcG8/XFxuXFxuYCArXG4gICAgICAgIGAke3N0ZGVycn1gKTtcbiAgfVxuICByZXR1cm4gc3Rkb3V0LnRyaW0oKTtcbn1cbiJdfQ==