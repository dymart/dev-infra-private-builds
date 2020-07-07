(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/dev-infra-private/release/cli", ["require", "exports", "yargs", "@angular/dev-infra-private/release/env-stamp"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buildReleaseParser = void 0;
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var yargs = require("yargs");
    var env_stamp_1 = require("@angular/dev-infra-private/release/env-stamp");
    /** Build the parser for the release commands. */
    function buildReleaseParser(localYargs) {
        return localYargs.help().strict().demandCommand().command('build-env-stamp', 'Build the environment stamping information', {}, function () { return env_stamp_1.buildEnvStamp(); });
    }
    exports.buildReleaseParser = buildReleaseParser;
    if (require.main === module) {
        buildReleaseParser(yargs).parse();
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vZGV2LWluZnJhL3JlbGVhc2UvY2xpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDZCQUErQjtJQUMvQiwwRUFBMEM7SUFFMUMsaURBQWlEO0lBQ2pELFNBQWdCLGtCQUFrQixDQUFDLFVBQXNCO1FBQ3ZELE9BQU8sVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDLE9BQU8sQ0FDckQsaUJBQWlCLEVBQUUsNENBQTRDLEVBQUUsRUFBRSxFQUFFLGNBQU0sT0FBQSx5QkFBYSxFQUFFLEVBQWYsQ0FBZSxDQUFDLENBQUM7SUFDbEcsQ0FBQztJQUhELGdEQUdDO0lBRUQsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtRQUMzQixrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNuQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgeWFyZ3MgZnJvbSAneWFyZ3MnO1xuaW1wb3J0IHtidWlsZEVudlN0YW1wfSBmcm9tICcuL2Vudi1zdGFtcCc7XG5cbi8qKiBCdWlsZCB0aGUgcGFyc2VyIGZvciB0aGUgcmVsZWFzZSBjb21tYW5kcy4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFJlbGVhc2VQYXJzZXIobG9jYWxZYXJnczogeWFyZ3MuQXJndikge1xuICByZXR1cm4gbG9jYWxZYXJncy5oZWxwKCkuc3RyaWN0KCkuZGVtYW5kQ29tbWFuZCgpLmNvbW1hbmQoXG4gICAgICAnYnVpbGQtZW52LXN0YW1wJywgJ0J1aWxkIHRoZSBlbnZpcm9ubWVudCBzdGFtcGluZyBpbmZvcm1hdGlvbicsIHt9LCAoKSA9PiBidWlsZEVudlN0YW1wKCkpO1xufVxuXG5pZiAocmVxdWlyZS5tYWluID09PSBtb2R1bGUpIHtcbiAgYnVpbGRSZWxlYXNlUGFyc2VyKHlhcmdzKS5wYXJzZSgpO1xufVxuIl19