"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Changelog = exports.splitMarker = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const semver = require("semver");
/** Project-relative path for the changelog file. */
const changelogPath = 'CHANGELOG.md';
/** Project-relative path for the changelog archive file. */
const changelogArchivePath = 'CHANGELOG_ARCHIVE.md';
/** A marker used to split a CHANGELOG.md file into individual entries. */
exports.splitMarker = '<!-- CHANGELOG SPLIT MARKER -->';
/**
 * A string to use between each changelog entry when joining them together.
 *
 * Since all every changelog entry's content is trimmed, when joining back together, two new lines
 * must be placed around the splitMarker to create a one line buffer around the comment in the
 * markdown.
 * i.e.
 * <changelog entry content>
 *
 * <!-- CHANGELOG SPLIT MARKER -->
 *
 * <changelog entry content>
 */
const joinMarker = `\n\n${exports.splitMarker}\n\n`;
/** A RegExp matcher to extract the version of a changelog entry from the entry content. */
const versionAnchorMatcher = new RegExp(`<a name="(.*)"></a>`);
class Changelog {
    constructor(git) {
        this.git = git;
        /** The absolute path to the changelog file. */
        this.filePath = (0, path_1.join)(this.git.baseDir, changelogPath);
        /** The absolute path to the changelog archive file. */
        this.archiveFilePath = (0, path_1.join)(this.git.baseDir, changelogArchivePath);
        this._entries = undefined;
        this._archiveEntries = undefined;
    }
    /** Prepend a changelog entry to the current changelog file. */
    static prependEntryToChangelogFile(git, entry) {
        const changelog = new this(git);
        changelog.prependEntryToChangelogFile(entry);
    }
    /**
     * Move all changelog entries from the CHANGELOG.md file for versions prior to the provided
     * version to the changelog archive.
     *
     * Versions should be used to determine which entries are moved to archive as versions are the
     * most accurate piece of context found within a changelog entry to determine its relationship to
     * other changelog entries.  This allows for example, moving all changelog entries out of the
     * main changelog when a version moves out of support.
     */
    static moveEntriesPriorToVersionToArchive(git, version) {
        const changelog = new this(git);
        changelog.moveEntriesPriorToVersionToArchive(version);
    }
    /**
     * Remove all changelog entries from the CHANGELOG.md file for versions which are prereleases
     * for the provided version. This is expected to be done on each major and minor release to remove
     * the changelog entries which will be made redundant by the first major/minor changelog for a
     * version.
     */
    static removePrereleaseEntriesForVersion(git, version) {
        const changelog = new this(git);
        changelog.removePrereleaseEntriesForVersion(version);
    }
    // TODO(josephperrott): Remove this after it is unused.
    /** Retrieve the file paths for the changelog files. */
    static getChangelogFilePaths(git) {
        return new this(git);
    }
    /**
     * The changelog entries in the CHANGELOG.md file.
     * Delays reading the CHANGELOG.md file until it is actually used.
     */
    get entries() {
        if (this._entries === undefined) {
            return (this._entries = this.getEntriesFor(this.filePath));
        }
        return this._entries;
    }
    /**
     * The changelog entries in the CHANGELOG_ARCHIVE.md file.
     * Delays reading the CHANGELOG_ARCHIVE.md file until it is actually used.
     */
    get archiveEntries() {
        if (this._archiveEntries === undefined) {
            return (this._archiveEntries = this.getEntriesFor(this.archiveFilePath));
        }
        return this._archiveEntries;
    }
    /** Prepend a changelog entry to the changelog. */
    prependEntryToChangelogFile(entry) {
        this.entries.unshift(parseChangelogEntry(entry));
        this.writeToChangelogFile();
    }
    /**
     * Remove all changelog entries from the CHANGELOG.md file for versions which are prereleases
     * for the provided version. This is expected to be done on each major and minor release to remove
     * the changelog entries which will be made redundant by the first major/minor changelog for a
     * version.
     */
    removePrereleaseEntriesForVersion(version) {
        this._entries = this.entries.filter((entry) => {
            return semver.diff(entry.version, version) !== 'prerelease';
        });
        this.writeToChangelogFile();
    }
    /**
     * Move all changelog entries from the CHANGELOG.md file for versions prior to the provided
     * version to the changelog archive.
     *
     * Versions should be used to determine which entries are moved to archive as versions are the
     * most accurate piece of context found within a changelog entry to determine its relationship to
     * other changelog entries.  This allows for example, moving all changelog entries out of the
     * main changelog when a version moves out of support.
     */
    moveEntriesPriorToVersionToArchive(version) {
        [...this.entries].reverse().forEach((entry) => {
            if (semver.lt(entry.version, version)) {
                this.archiveEntries.unshift(entry);
                this.entries.splice(this.entries.indexOf(entry), 1);
            }
        });
        this.writeToChangelogFile();
        if (this.archiveEntries.length) {
            this.writeToChangelogArchiveFile();
        }
    }
    /** Update the changelog archive file with the known changelog archive entries. */
    writeToChangelogArchiveFile() {
        const changelogArchive = this.archiveEntries.map((entry) => entry.content).join(joinMarker);
        (0, fs_1.writeFileSync)(this.archiveFilePath, changelogArchive);
    }
    /** Update the changelog file with the known changelog entries. */
    writeToChangelogFile() {
        const changelog = this.entries.map((entry) => entry.content).join(joinMarker);
        (0, fs_1.writeFileSync)(this.filePath, changelog);
    }
    /**
     * Retrieve the changelog entries for the provide changelog path, if the file does not exist an
     * empty array is returned.
     */
    getEntriesFor(path) {
        if (!(0, fs_1.existsSync)(path)) {
            return [];
        }
        return ((0, fs_1.readFileSync)(path, { encoding: 'utf8' })
            // Use the versionMarker as the separator for .split().
            .split(exports.splitMarker)
            // If the `split()` method finds the separator at the beginning or end of a string, it
            // includes an empty string at the respective locaiton, so we filter to remove all of these
            // potential empty strings.
            .filter((entry) => entry.trim().length !== 0)
            // Create a ChangelogEntry for each of the string entry.
            .map(parseChangelogEntry));
    }
}
exports.Changelog = Changelog;
/** Parse the provided string into a ChangelogEntry object. */
function parseChangelogEntry(content) {
    const versionMatcherResult = versionAnchorMatcher.exec(content);
    if (versionMatcherResult === null) {
        throw Error(`Unable to determine version for changelog entry: ${content}`);
    }
    const version = semver.parse(versionMatcherResult[1]);
    if (version === null) {
        throw Error(`Unable to determine version for changelog entry, with tag: ${versionMatcherResult[1]}`);
    }
    return {
        content: content.trim(),
        version,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbmctZGV2L3JlbGVhc2Uvbm90ZXMvY2hhbmdlbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJCQUEyRDtBQUMzRCwrQkFBMEI7QUFDMUIsaUNBQWlDO0FBSWpDLG9EQUFvRDtBQUNwRCxNQUFNLGFBQWEsR0FBRyxjQUFjLENBQUM7QUFFckMsNERBQTREO0FBQzVELE1BQU0sb0JBQW9CLEdBQUcsc0JBQXNCLENBQUM7QUFFcEQsMEVBQTBFO0FBQzdELFFBQUEsV0FBVyxHQUFHLGlDQUFpQyxDQUFDO0FBRTdEOzs7Ozs7Ozs7Ozs7R0FZRztBQUNILE1BQU0sVUFBVSxHQUFHLE9BQU8sbUJBQVcsTUFBTSxDQUFDO0FBRTVDLDJGQUEyRjtBQUMzRixNQUFNLG9CQUFvQixHQUFHLElBQUksTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFRL0QsTUFBYSxTQUFTO0lBaUVwQixZQUE0QixHQUFjO1FBQWQsUUFBRyxHQUFILEdBQUcsQ0FBVztRQTNCMUMsK0NBQStDO1FBQ3RDLGFBQVEsR0FBRyxJQUFBLFdBQUksRUFBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQztRQUMxRCx1REFBdUQ7UUFDOUMsb0JBQWUsR0FBRyxJQUFBLFdBQUksRUFBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1FBV2hFLGFBQVEsR0FBaUMsU0FBUyxDQUFDO1FBV25ELG9CQUFlLEdBQWlDLFNBQVMsQ0FBQztJQUVyQixDQUFDO0lBaEU5QywrREFBK0Q7SUFDL0QsTUFBTSxDQUFDLDJCQUEyQixDQUFDLEdBQWMsRUFBRSxLQUFhO1FBQzlELE1BQU0sU0FBUyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLFNBQVMsQ0FBQywyQkFBMkIsQ0FBQyxLQUFLLENB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LENBQUMsQ0FBQztJQUNoRSxJQUFJLG9CQUFvQixLQUFLLElBQUksRUFBRTtRQUNqQyxNQUFNLEtBQUssQ0FBQyxvREFBb0QsT0FBTyxFQUFFLENBQUMsQ0FBQztLQUM1RTtJQUNELE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV0RCxJQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUU7UUFDcEIsTUFBTSxLQUFLLENBQ1QsOERBQThELG9CQUFvQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQ3hGLENBQUM7S0FDSDtJQUVELE9BQU87UUFDTCxPQUFPLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRTtRQUN2QixPQUFPO0tBQ1IsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2V4aXN0c1N5bmMsIHJlYWRGaWxlU3luYywgd3JpdGVGaWxlU3luY30gZnJvbSAnZnMnO1xuaW1wb3J0IHtqb2lufSBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIHNlbXZlciBmcm9tICdzZW12ZXInO1xuaW1wb3J0IHtBdXRoZW50aWNhdGVkR2l0Q2xpZW50fSBmcm9tICcuLi8uLi91dGlscy9naXQvYXV0aGVudGljYXRlZC1naXQtY2xpZW50JztcbmltcG9ydCB7R2l0Q2xpZW50fSBmcm9tICcuLi8uLi91dGlscy9naXQvZ2l0LWNsaWVudCc7XG5cbi8qKiBQcm9qZWN0LXJlbGF0aXZlIHBhdGggZm9yIHRoZSBjaGFuZ2Vsb2cgZmlsZS4gKi9cbmNvbnN0IGNoYW5nZWxvZ1BhdGggPSAnQ0hBTkdFTE9HLm1kJztcblxuLyoqIFByb2plY3QtcmVsYXRpdmUgcGF0aCBmb3IgdGhlIGNoYW5nZWxvZyBhcmNoaXZlIGZpbGUuICovXG5jb25zdCBjaGFuZ2Vsb2dBcmNoaXZlUGF0aCA9ICdDSEFOR0VMT0dfQVJDSElWRS5tZCc7XG5cbi8qKiBBIG1hcmtlciB1c2VkIHRvIHNwbGl0IGEgQ0hBTkdFTE9HLm1kIGZpbGUgaW50byBpbmRpdmlkdWFsIGVudHJpZXMuICovXG5leHBvcnQgY29uc3Qgc3BsaXRNYXJrZXIgPSAnPCEtLSBDSEFOR0VMT0cgU1BMSVQgTUFSS0VSIC0tPic7XG5cbi8qKlxuICogQSBzdHJpbmcgdG8gdXNlIGJldHdlZW4gZWFjaCBjaGFuZ2Vsb2cgZW50cnkgd2hlbiBqb2luaW5nIHRoZW0gdG9nZXRoZXIuXG4gKlxuICogU2luY2UgYWxsIGV2ZXJ5IGNoYW5nZWxvZyBlbnRyeSdzIGNvbnRlbnQgaXMgdHJpbW1lZCwgd2hlbiBqb2luaW5nIGJhY2sgdG9nZXRoZXIsIHR3byBuZXcgbGluZXNcbiAqIG11c3QgYmUgcGxhY2VkIGFyb3VuZCB0aGUgc3BsaXRNYXJrZXIgdG8gY3JlYXRlIGEgb25lIGxpbmUgYnVmZmVyIGFyb3VuZCB0aGUgY29tbWVudCBpbiB0aGVcbiAqIG1hcmtkb3duLlxuICogaS5lLlxuICogPGNoYW5nZWxvZyBlbnRyeSBjb250ZW50PlxuICpcbiAqIDwhLS0gQ0hBTkdFTE9HIFNQTElUIE1BUktFUiAtLT5cbiAqXG4gKiA8Y2hhbmdlbG9nIGVudHJ5IGNvbnRlbnQ+XG4gKi9cbmNvbnN0IGpvaW5NYXJrZXIgPSBgXFxuXFxuJHtzcGxpdE1hcmtlcn1cXG5cXG5gO1xuXG4vKiogQSBSZWdFeHAgbWF0Y2hlciB0byBleHRyYWN0IHRoZSB2ZXJzaW9uIG9mIGEgY2hhbmdlbG9nIGVudHJ5IGZyb20gdGhlIGVudHJ5IGNvbnRlbnQuICovXG5jb25zdCB2ZXJzaW9uQW5jaG9yTWF0Y2hlciA9IG5ldyBSZWdFeHAoYDxhIG5hbWU9XCIoLiopXCI+PC9hPmApO1xuXG4vKiogQW4gaW5kaXZpZHVhbCBjaGFuZ2Vsb2cgZW50cnkuICovXG5pbnRlcmZhY2UgQ2hhbmdlbG9nRW50cnkge1xuICBjb250ZW50OiBzdHJpbmc7XG4gIHZlcnNpb246IHNlbXZlci5TZW1WZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBDaGFuZ2Vsb2cge1xuICAvKiogUHJlcGVuZCBhIGNoYW5nZWxvZyBlbnRyeSB0byB0aGUgY3VycmVudCBjaGFuZ2Vsb2cgZmlsZS4gKi9cbiAgc3RhdGljIHByZXBlbmRFbnRyeVRvQ2hhbmdlbG9nRmlsZShnaXQ6IEdpdENsaWVudCwgZW50cnk6IHN0cmluZykge1xuICAgIGNvbnN0IGNoYW5nZWxvZyA9IG5ldyB0aGlzKGdpdCk7XG4gICAgY2hhbmdlbG9nLnByZXBlbmRFbnRyeVRvQ2hhbmdlbG9nRmlsZShlbnRyeSk7XG4gIH1cblxuICAvKipcbiAgICogTW92ZSBhbGwgY2hhbmdlbG9nIGVudHJpZXMgZnJvbSB0aGUgQ0hBTkdFTE9HLm1kIGZpbGUgZm9yIHZlcnNpb25zIHByaW9yIHRvIHRoZSBwcm92aWRlZFxuICAgKiB2ZXJzaW9uIHRvIHRoZSBjaGFuZ2Vsb2cgYXJjaGl2ZS5cbiAgICpcbiAgICogVmVyc2lvbnMgc2hvdWxkIGJlIHVzZWQgdG8gZGV0ZXJtaW5lIHdoaWNoIGVudHJpZXMgYXJlIG1vdmVkIHRvIGFyY2hpdmUgYXMgdmVyc2lvbnMgYXJlIHRoZVxuICAgKiBtb3N0IGFjY3VyYXRlIHBpZWNlIG9mIGNvbnRleHQgZm91bmQgd2l0aGluIGEgY2hhbmdlbG9nIGVudHJ5IHRvIGRldGVybWluZSBpdHMgcmVsYXRpb25zaGlwIHRvXG4gICAqIG90aGVyIGNoYW5nZWxvZyBlbnRyaWVzLiAgVGhpcyBhbGxvd3MgZm9yIGV4YW1wbGUsIG1vdmluZyBhbGwgY2hhbmdlbG9nIGVudHJpZXMgb3V0IG9mIHRoZVxuICAgKiBtYWluIGNoYW5nZWxvZyB3aGVuIGEgdmVyc2lvbiBtb3ZlcyBvdXQgb2Ygc3VwcG9ydC5cbiAgICovXG4gIHN0YXRpYyBtb3ZlRW50cmllc1ByaW9yVG9WZXJzaW9uVG9BcmNoaXZlKGdpdDogR2l0Q2xpZW50LCB2ZXJzaW9uOiBzZW12ZXIuU2VtVmVyKSB7XG4gICAgY29uc3QgY2hhbmdlbG9nID0gbmV3IHRoaXMoZ2l0KTtcbiAgICBjaGFuZ2Vsb2cubW92ZUVudHJpZXNQcmlvclRvVmVyc2lvblRvQXJjaGl2ZSh2ZXJzaW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYWxsIGNoYW5nZWxvZyBlbnRyaWVzIGZyb20gdGhlIENIQU5HRUxPRy5tZCBmaWxlIGZvciB2ZXJzaW9ucyB3aGljaCBhcmUgcHJlcmVsZWFzZXNcbiAgICogZm9yIHRoZSBwcm92aWRlZCB2ZXJzaW9uLiBUaGlzIGlzIGV4cGVjdGVkIHRvIGJlIGRvbmUgb24gZWFjaCBtYWpvciBhbmQgbWlub3IgcmVsZWFzZSB0byByZW1vdmVcbiAgICogdGhlIGNoYW5nZWxvZyBlbnRyaWVzIHdoaWNoIHdpbGwgYmUgbWFkZSByZWR1bmRhbnQgYnkgdGhlIGZpcnN0IG1ham9yL21pbm9yIGNoYW5nZWxvZyBmb3IgYVxuICAgKiB2ZXJzaW9uLlxuICAgKi9cbiAgc3RhdGljIHJlbW92ZVByZXJlbGVhc2VFbnRyaWVzRm9yVmVyc2lvbihnaXQ6IEdpdENsaWVudCwgdmVyc2lvbjogc2VtdmVyLlNlbVZlcikge1xuICAgIGNvbnN0IGNoYW5nZWxvZyA9IG5ldyB0aGlzKGdpdCk7XG4gICAgY2hhbmdlbG9nLnJlbW92ZVByZXJlbGVhc2VFbnRyaWVzRm9yVmVyc2lvbih2ZXJzaW9uKTtcbiAgfVxuXG4gIC8vIFRPRE8oam9zZXBocGVycm90dCk6IFJlbW92ZSB0aGlzIGFmdGVyIGl0IGlzIHVudXNlZC5cbiAgLyoqIFJldHJpZXZlIHRoZSBmaWxlIHBhdGhzIGZvciB0aGUgY2hhbmdlbG9nIGZpbGVzLiAqL1xuICBzdGF0aWMgZ2V0Q2hhbmdlbG9nRmlsZVBhdGhzKGdpdDogR2l0Q2xpZW50KSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzKGdpdCk7XG4gIH1cblxuICAvKiogVGhlIGFic29sdXRlIHBhdGggdG8gdGhlIGNoYW5nZWxvZyBmaWxlLiAqL1xuICByZWFkb25seSBmaWxlUGF0aCA9IGpvaW4odGhpcy5naXQuYmFzZURpciwgY2hhbmdlbG9nUGF0aCk7XG4gIC8qKiBUaGUgYWJzb2x1dGUgcGF0aCB0byB0aGUgY2hhbmdlbG9nIGFyY2hpdmUgZmlsZS4gKi9cbiAgcmVhZG9ubHkgYXJjaGl2ZUZpbGVQYXRoID0gam9pbih0aGlzLmdpdC5iYXNlRGlyLCBjaGFuZ2Vsb2dBcmNoaXZlUGF0aCk7XG4gIC8qKlxuICAgKiBUaGUgY2hhbmdlbG9nIGVudHJpZXMgaW4gdGhlIENIQU5HRUxPRy5tZCBmaWxlLlxuICAgKiBEZWxheXMgcmVhZGluZyB0aGUgQ0hBTkdFTE9HLm1kIGZpbGUgdW50aWwgaXQgaXMgYWN0dWFsbHkgdXNlZC5cbiAgICovXG4gIHByaXZhdGUgZ2V0IGVudHJpZXMoKSB7XG4gICAgaWYgKHRoaXMuX2VudHJpZXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuICh0aGlzLl9lbnRyaWVzID0gdGhpcy5nZXRFbnRyaWVzRm9yKHRoaXMuZmlsZVBhdGgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2VudHJpZXM7XG4gIH1cbiAgcHJpdmF0ZSBfZW50cmllczogdW5kZWZpbmVkIHwgQ2hhbmdlbG9nRW50cnlbXSA9IHVuZGVmaW5lZDtcbiAgLyoqXG4gICAqIFRoZSBjaGFuZ2Vsb2cgZW50cmllcyBpbiB0aGUgQ0hBTkdFTE9HX0FSQ0hJVkUubWQgZmlsZS5cbiAgICogRGVsYXlzIHJlYWRpbmcgdGhlIENIQU5HRUxPR19BUkNISVZFLm1kIGZpbGUgdW50aWwgaXQgaXMgYWN0dWFsbHkgdXNlZC5cbiAgICovXG4gIHByaXZhdGUgZ2V0IGFyY2hpdmVFbnRyaWVzKCkge1xuICAgIGlmICh0aGlzLl9hcmNoaXZlRW50cmllcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gKHRoaXMuX2FyY2hpdmVFbnRyaWVzID0gdGhpcy5nZXRFbnRyaWVzRm9yKHRoaXMuYXJjaGl2ZUZpbGVQYXRoKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9hcmNoaXZlRW50cmllcztcbiAgfVxuICBwcml2YXRlIF9hcmNoaXZlRW50cmllczogdW5kZWZpbmVkIHwgQ2hhbmdlbG9nRW50cnlbXSA9IHVuZGVmaW5lZDtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHByaXZhdGUgZ2l0OiBHaXRDbGllbnQpIHt9XG5cbiAgLyoqIFByZXBlbmQgYSBjaGFuZ2Vsb2cgZW50cnkgdG8gdGhlIGNoYW5nZWxvZy4gKi9cbiAgcHJpdmF0ZSBwcmVwZW5kRW50cnlUb0NoYW5nZWxvZ0ZpbGUoZW50cnk6IHN0cmluZykge1xuICAgIHRoaXMuZW50cmllcy51bnNoaWZ0KHBhcnNlQ2hhbmdlbG9nRW50cnkoZW50cnkpKTtcbiAgICB0aGlzLndyaXRlVG9DaGFuZ2Vsb2dGaWxlKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFsbCBjaGFuZ2Vsb2cgZW50cmllcyBmcm9tIHRoZSBDSEFOR0VMT0cubWQgZmlsZSBmb3IgdmVyc2lvbnMgd2hpY2ggYXJlIHByZXJlbGVhc2VzXG4gICAqIGZvciB0aGUgcHJvdmlkZWQgdmVyc2lvbi4gVGhpcyBpcyBleHBlY3RlZCB0byBiZSBkb25lIG9uIGVhY2ggbWFqb3IgYW5kIG1pbm9yIHJlbGVhc2UgdG8gcmVtb3ZlXG4gICAqIHRoZSBjaGFuZ2Vsb2cgZW50cmllcyB3aGljaCB3aWxsIGJlIG1hZGUgcmVkdW5kYW50IGJ5IHRoZSBmaXJzdCBtYWpvci9taW5vciBjaGFuZ2Vsb2cgZm9yIGFcbiAgICogdmVyc2lvbi5cbiAgICovXG4gIHByaXZhdGUgcmVtb3ZlUHJlcmVsZWFzZUVudHJpZXNGb3JWZXJzaW9uKHZlcnNpb246IHNlbXZlci5TZW1WZXIpIHtcbiAgICB0aGlzLl9lbnRyaWVzID0gdGhpcy5lbnRyaWVzLmZpbHRlcigoZW50cnk6IENoYW5nZWxvZ0VudHJ5KSA9PiB7XG4gICAgICByZXR1cm4gc2VtdmVyLmRpZmYoZW50cnkudmVyc2lvbiwgdmVyc2lvbikgIT09ICdwcmVyZWxlYXNlJztcbiAgICB9KTtcbiAgICB0aGlzLndyaXRlVG9DaGFuZ2Vsb2dGaWxlKCk7XG4gIH1cblxuICAvKipcbiAgICogTW92ZSBhbGwgY2hhbmdlbG9nIGVudHJpZXMgZnJvbSB0aGUgQ0hBTkdFTE9HLm1kIGZpbGUgZm9yIHZlcnNpb25zIHByaW9yIHRvIHRoZSBwcm92aWRlZFxuICAgKiB2ZXJzaW9uIHRvIHRoZSBjaGFuZ2Vsb2cgYXJjaGl2ZS5cbiAgICpcbiAgICogVmVyc2lvbnMgc2hvdWxkIGJlIHVzZWQgdG8gZGV0ZXJtaW5lIHdoaWNoIGVudHJpZXMgYXJlIG1vdmVkIHRvIGFyY2hpdmUgYXMgdmVyc2lvbnMgYXJlIHRoZVxuICAgKiBtb3N0IGFjY3VyYXRlIHBpZWNlIG9mIGNvbnRleHQgZm91bmQgd2l0aGluIGEgY2hhbmdlbG9nIGVudHJ5IHRvIGRldGVybWluZSBpdHMgcmVsYXRpb25zaGlwIHRvXG4gICAqIG90aGVyIGNoYW5nZWxvZyBlbnRyaWVzLiAgVGhpcyBhbGxvd3MgZm9yIGV4YW1wbGUsIG1vdmluZyBhbGwgY2hhbmdlbG9nIGVudHJpZXMgb3V0IG9mIHRoZVxuICAgKiBtYWluIGNoYW5nZWxvZyB3aGVuIGEgdmVyc2lvbiBtb3ZlcyBvdXQgb2Ygc3VwcG9ydC5cbiAgICovXG4gIHByaXZhdGUgbW92ZUVudHJpZXNQcmlvclRvVmVyc2lvblRvQXJjaGl2ZSh2ZXJzaW9uOiBzZW12ZXIuU2VtVmVyKSB7XG4gICAgWy4uLnRoaXMuZW50cmllc10ucmV2ZXJzZSgpLmZvckVhY2goKGVudHJ5OiBDaGFuZ2Vsb2dFbnRyeSkgPT4ge1xuICAgICAgaWYgKHNlbXZlci5sdChlbnRyeS52ZXJzaW9uLCB2ZXJzaW9uKSkge1xuICAgICAgICB0aGlzLmFyY2hpdmVFbnRyaWVzLnVuc2hpZnQoZW50cnkpO1xuICAgICAgICB0aGlzLmVudHJpZXMuc3BsaWNlKHRoaXMuZW50cmllcy5pbmRleE9mKGVudHJ5KSwgMSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLndyaXRlVG9DaGFuZ2Vsb2dGaWxlKCk7XG4gICAgaWYgKHRoaXMuYXJjaGl2ZUVudHJpZXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLndyaXRlVG9DaGFuZ2Vsb2dBcmNoaXZlRmlsZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBVcGRhdGUgdGhlIGNoYW5nZWxvZyBhcmNoaXZlIGZpbGUgd2l0aCB0aGUga25vd24gY2hhbmdlbG9nIGFyY2hpdmUgZW50cmllcy4gKi9cbiAgcHJpdmF0ZSB3cml0ZVRvQ2hhbmdlbG9nQXJjaGl2ZUZpbGUoKTogdm9pZCB7XG4gICAgY29uc3QgY2hhbmdlbG9nQXJjaGl2ZSA9IHRoaXMuYXJjaGl2ZUVudHJpZXMubWFwKChlbnRyeSkgPT4gZW50cnkuY29udGVudCkuam9pbihqb2luTWFya2VyKTtcbiAgICB3cml0ZUZpbGVTeW5jKHRoaXMuYXJjaGl2ZUZpbGVQYXRoLCBjaGFuZ2Vsb2dBcmNoaXZlKTtcbiAgfVxuXG4gIC8qKiBVcGRhdGUgdGhlIGNoYW5nZWxvZyBmaWxlIHdpdGggdGhlIGtub3duIGNoYW5nZWxvZyBlbnRyaWVzLiAqL1xuICBwcml2YXRlIHdyaXRlVG9DaGFuZ2Vsb2dGaWxlKCk6IHZvaWQge1xuICAgIGNvbnN0IGNoYW5nZWxvZyA9IHRoaXMuZW50cmllcy5tYXAoKGVudHJ5KSA9PiBlbnRyeS5jb250ZW50KS5qb2luKGpvaW5NYXJrZXIpO1xuICAgIHdyaXRlRmlsZVN5bmModGhpcy5maWxlUGF0aCwgY2hhbmdlbG9nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgY2hhbmdlbG9nIGVudHJpZXMgZm9yIHRoZSBwcm92aWRlIGNoYW5nZWxvZyBwYXRoLCBpZiB0aGUgZmlsZSBkb2VzIG5vdCBleGlzdCBhblxuICAgKiBlbXB0eSBhcnJheSBpcyByZXR1cm5lZC5cbiAgICovXG4gIHByaXZhdGUgZ2V0RW50cmllc0ZvcihwYXRoOiBzdHJpbmcpOiBDaGFuZ2Vsb2dFbnRyeVtdIHtcbiAgICBpZiAoIWV4aXN0c1N5bmMocGF0aCkpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgcmVhZEZpbGVTeW5jKHBhdGgsIHtlbmNvZGluZzogJ3V0ZjgnfSlcbiAgICAgICAgLy8gVXNlIHRoZSB2ZXJzaW9uTWFya2VyIGFzIHRoZSBzZXBhcmF0b3IgZm9yIC5zcGxpdCgpLlxuICAgICAgICAuc3BsaXQoc3BsaXRNYXJrZXIpXG4gICAgICAgIC8vIElmIHRoZSBgc3BsaXQoKWAgbWV0aG9kIGZpbmRzIHRoZSBzZXBhcmF0b3IgYXQgdGhlIGJlZ2lubmluZyBvciBlbmQgb2YgYSBzdHJpbmcsIGl0XG4gICAgICAgIC8vIGluY2x1ZGVzIGFuIGVtcHR5IHN0cmluZyBhdCB0aGUgcmVzcGVjdGl2ZSBsb2NhaXRvbiwgc28gd2UgZmlsdGVyIHRvIHJlbW92ZSBhbGwgb2YgdGhlc2VcbiAgICAgICAgLy8gcG90ZW50aWFsIGVtcHR5IHN0cmluZ3MuXG4gICAgICAgIC5maWx0ZXIoKGVudHJ5KSA9PiBlbnRyeS50cmltKCkubGVuZ3RoICE9PSAwKVxuICAgICAgICAvLyBDcmVhdGUgYSBDaGFuZ2Vsb2dFbnRyeSBmb3IgZWFjaCBvZiB0aGUgc3RyaW5nIGVudHJ5LlxuICAgICAgICAubWFwKHBhcnNlQ2hhbmdlbG9nRW50cnkpXG4gICAgKTtcbiAgfVxufVxuXG4vKiogUGFyc2UgdGhlIHByb3ZpZGVkIHN0cmluZyBpbnRvIGEgQ2hhbmdlbG9nRW50cnkgb2JqZWN0LiAqL1xuZnVuY3Rpb24gcGFyc2VDaGFuZ2Vsb2dFbnRyeShjb250ZW50OiBzdHJpbmcpOiBDaGFuZ2Vsb2dFbnRyeSB7XG4gIGNvbnN0IHZlcnNpb25NYXRjaGVyUmVzdWx0ID0gdmVyc2lvbkFuY2hvck1hdGNoZXIuZXhlYyhjb250ZW50KTtcbiAgaWYgKHZlcnNpb25NYXRjaGVyUmVzdWx0ID09PSBudWxsKSB7XG4gICAgdGhyb3cgRXJyb3IoYFVuYWJsZSB0byBkZXRlcm1pbmUgdmVyc2lvbiBmb3IgY2hhbmdlbG9nIGVudHJ5OiAke2NvbnRlbnR9YCk7XG4gIH1cbiAgY29uc3QgdmVyc2lvbiA9IHNlbXZlci5wYXJzZSh2ZXJzaW9uTWF0Y2hlclJlc3VsdFsxXSk7XG5cbiAgaWYgKHZlcnNpb24gPT09IG51bGwpIHtcbiAgICB0aHJvdyBFcnJvcihcbiAgICAgIGBVbmFibGUgdG8gZGV0ZXJtaW5lIHZlcnNpb24gZm9yIGNoYW5nZWxvZyBlbnRyeSwgd2l0aCB0YWc6ICR7dmVyc2lvbk1hdGNoZXJSZXN1bHRbMV19YCxcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBjb250ZW50OiBjb250ZW50LnRyaW0oKSxcbiAgICB2ZXJzaW9uLFxuICB9O1xufVxuIl19