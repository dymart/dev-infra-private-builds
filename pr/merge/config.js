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
        define("@angular/dev-infra-private/pr/merge/config", ["require", "exports", "tslib", "@angular/dev-infra-private/utils/config"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var config_1 = require("@angular/dev-infra-private/utils/config");
    /** Loads and validates the merge configuration. */
    function loadAndValidateConfig() {
        var config = config_1.getConfig();
        if (config.merge === undefined) {
            return {
                errors: ['No merge configuration found. Set the `merge` configuration.']
            };
        }
        if (typeof config.merge !== 'function') {
            return {
                errors: ['Expected merge configuration to be defined lazily through a function.']
            };
        }
        var mergeConfig = config.merge();
        var errors = validateMergeConfig(mergeConfig);
        if (errors.length) {
            return { errors: errors };
        }
        if (mergeConfig.remote) {
            mergeConfig.remote = tslib_1.__assign(tslib_1.__assign({}, config.github), mergeConfig.remote);
        }
        else {
            mergeConfig.remote = config.github;
        }
        // We always set the `remote` option, so we can safely cast the
        // config to `MergeConfigWithRemote`.
        return { config: mergeConfig };
    }
    exports.loadAndValidateConfig = loadAndValidateConfig;
    /** Validates the specified configuration. Returns a list of failure messages. */
    function validateMergeConfig(config) {
        var errors = [];
        if (!config.labels) {
            errors.push('No label configuration.');
        }
        else if (!Array.isArray(config.labels)) {
            errors.push('Label configuration needs to be an array.');
        }
        if (!config.claSignedLabel) {
            errors.push('No CLA signed label configured.');
        }
        if (!config.mergeReadyLabel) {
            errors.push('No merge ready label configured.');
        }
        if (config.githubApiMerge === undefined) {
            errors.push('No explicit choice of merge strategy. Please set `githubApiMerge`.');
        }
        return errors;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vZGV2LWluZnJhL3ByL21lcmdlL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFFSCxrRUFBMEQ7SUE0RTFELG1EQUFtRDtJQUNuRCxTQUFnQixxQkFBcUI7UUFDbkMsSUFBTSxNQUFNLEdBQWlDLGtCQUFTLEVBQUUsQ0FBQztRQUV6RCxJQUFJLE1BQU0sQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQzlCLE9BQU87Z0JBQ0wsTUFBTSxFQUFFLENBQUMsOERBQThELENBQUM7YUFDekUsQ0FBQTtTQUNGO1FBRUQsSUFBSSxPQUFPLE1BQU0sQ0FBQyxLQUFLLEtBQUssVUFBVSxFQUFFO1lBQ3RDLE9BQU87Z0JBQ0wsTUFBTSxFQUFFLENBQUMsdUVBQXVFLENBQUM7YUFDbEYsQ0FBQTtTQUNGO1FBRUQsSUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ25DLElBQU0sTUFBTSxHQUFHLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRWhELElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRTtZQUNqQixPQUFPLEVBQUMsTUFBTSxRQUFBLEVBQUMsQ0FBQztTQUNqQjtRQUVELElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRTtZQUN0QixXQUFXLENBQUMsTUFBTSx5Q0FBTyxNQUFNLENBQUMsTUFBTSxHQUFLLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNoRTthQUFNO1lBQ0wsV0FBVyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1NBQ3BDO1FBRUQsK0RBQStEO1FBQy9ELHFDQUFxQztRQUNyQyxPQUFPLEVBQUMsTUFBTSxFQUFFLFdBQW9DLEVBQUMsQ0FBQztJQUN4RCxDQUFDO0lBL0JELHNEQStCQztJQUVELGlGQUFpRjtJQUNqRixTQUFTLG1CQUFtQixDQUFDLE1BQTRCO1FBQ3ZELElBQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtZQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7U0FDeEM7YUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1NBQzFEO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUU7WUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1NBQ2hEO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUU7WUFDM0IsTUFBTSxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO1NBQ2pEO1FBQ0QsSUFBSSxNQUFNLENBQUMsY0FBYyxLQUFLLFNBQVMsRUFBRTtZQUN2QyxNQUFNLENBQUMsSUFBSSxDQUFDLG9FQUFvRSxDQUFDLENBQUM7U0FDbkY7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Z2V0Q29uZmlnLCBOZ0RldkNvbmZpZ30gZnJvbSAnLi4vLi4vdXRpbHMvY29uZmlnJztcblxuaW1wb3J0IHtHaXRodWJBcGlNZXJnZVN0cmF0ZWd5Q29uZmlnfSBmcm9tICcuL3N0cmF0ZWdpZXMvYXBpLW1lcmdlJztcblxuLyoqXG4gKiBQb3NzaWJsZSBtZXJnZSBtZXRob2RzIHN1cHBvcnRlZCBieSB0aGUgR2l0aHViIEFQSS5cbiAqIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcHVsbHMvI21lcmdlLWEtcHVsbC1yZXF1ZXN0LW1lcmdlLWJ1dHRvbi5cbiAqL1xuZXhwb3J0IHR5cGUgR2l0aHViQXBpTWVyZ2VNZXRob2QgPSAnbWVyZ2UnfCdzcXVhc2gnfCdyZWJhc2UnO1xuXG4vKipcbiAqIFRhcmdldCBsYWJlbHMgcmVwcmVzZW50IEdpdGh1YiBwdWxsIHJlcXVlc3RzIGxhYmVscy4gVGhlc2UgbGFiZWxzIGluc3RydWN0IHRoZSBtZXJnZVxuICogc2NyaXB0IGludG8gd2hpY2ggYnJhbmNoZXMgYSBnaXZlbiBwdWxsIHJlcXVlc3Qgc2hvdWxkIGJlIG1lcmdlZCB0by5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUYXJnZXRMYWJlbCB7XG4gIC8qKiBQYXR0ZXJuIHRoYXQgbWF0Y2hlcyB0aGUgZ2l2ZW4gdGFyZ2V0IGxhYmVsLiAqL1xuICBwYXR0ZXJuOiBSZWdFeHB8c3RyaW5nO1xuICAvKipcbiAgICogTGlzdCBvZiBicmFuY2hlcyBhIHB1bGwgcmVxdWVzdCB3aXRoIHRoaXMgdGFyZ2V0IGxhYmVsIHNob3VsZCBiZSBtZXJnZWQgaW50by5cbiAgICogQ2FuIGFsc28gYmUgd3JhcHBlZCBpbiBhIGZ1bmN0aW9uIHRoYXQgYWNjZXB0cyB0aGUgdGFyZ2V0IGJyYW5jaCBzcGVjaWZpZWQgaW4gdGhlXG4gICAqIEdpdGh1YiBXZWIgVUkuIFRoaXMgaXMgdXNlZnVsIGZvciBzdXBwb3J0aW5nIGxhYmVscyBsaWtlIGB0YXJnZXQ6IGRldmVsb3BtZW50LWJyYW5jaGAuXG4gICAqL1xuICBicmFuY2hlczogc3RyaW5nW118KChnaXRodWJUYXJnZXRCcmFuY2g6IHN0cmluZykgPT4gc3RyaW5nW10pO1xufVxuXG4vKiogRGVzY3JpYmVzIHRoZSByZW1vdGUgdXNlZCBmb3IgbWVyZ2luZyBwdWxsIHJlcXVlc3RzLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNZXJnZVJlbW90ZSB7XG4gIC8qKiBPd25lciBuYW1lIG9mIHRoZSByZXBvc2l0b3J5LiAqL1xuICBvd25lcjogc3RyaW5nO1xuICAvKiogTmFtZSBvZiB0aGUgcmVwb3NpdG9yeS4gKi9cbiAgbmFtZTogc3RyaW5nO1xuICAvKiogV2hldGhlciBTU0ggc2hvdWxkIGJlIHVzZWQgZm9yIG1lcmdpbmcgcHVsbCByZXF1ZXN0cy4gKi9cbiAgdXNlU3NoPzogYm9vbGVhblxufVxuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gZm9yIHRoZSBtZXJnZSBzY3JpcHQgd2l0aCBhbGwgcmVtb3RlIG9wdGlvbnMgc3BlY2lmaWVkLiBUaGVcbiAqIGRlZmF1bHQgYE1lcmdlQ29uZmlnYCBoYXMgZG9lcyBub3QgcmVxdWlyZSBhbnkgb2YgdGhlc2Ugb3B0aW9ucyBhcyBkZWZhdWx0c1xuICogYXJlIHByb3ZpZGVkIGJ5IHRoZSBjb21tb24gZGV2LWluZnJhIGdpdGh1YiBjb25maWd1cmF0aW9uLlxuICovXG5leHBvcnQgdHlwZSBNZXJnZUNvbmZpZ1dpdGhSZW1vdGUgPSBNZXJnZUNvbmZpZyZ7cmVtb3RlOiBNZXJnZVJlbW90ZX07XG5cbi8qKiBDb25maWd1cmF0aW9uIGZvciB0aGUgbWVyZ2Ugc2NyaXB0LiAqL1xuZXhwb3J0IGludGVyZmFjZSBNZXJnZUNvbmZpZyB7XG4gIC8qKlxuICAgKiBDb25maWd1cmF0aW9uIGZvciB0aGUgdXBzdHJlYW0gcmVtb3RlLiBBbGwgb2YgdGhlc2Ugb3B0aW9ucyBhcmUgb3B0aW9uYWwgYXNcbiAgICogZGVmYXVsdHMgYXJlIHByb3ZpZGVkIGJ5IHRoZSBjb21tb24gZGV2LWluZnJhIGdpdGh1YiBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgcmVtb3RlPzogUGFydGlhbDxNZXJnZVJlbW90ZT47XG4gIC8qKiBMaXN0IG9mIHRhcmdldCBsYWJlbHMuICovXG4gIGxhYmVsczogVGFyZ2V0TGFiZWxbXTtcbiAgLyoqIFJlcXVpcmVkIGJhc2UgY29tbWl0cyBmb3IgZ2l2ZW4gYnJhbmNoZXMuICovXG4gIHJlcXVpcmVkQmFzZUNvbW1pdHM/OiB7W2JyYW5jaE5hbWU6IHN0cmluZ106IHN0cmluZ307XG4gIC8qKiBQYXR0ZXJuIHRoYXQgbWF0Y2hlcyBsYWJlbHMgd2hpY2ggaW1wbHkgYSBzaWduZWQgQ0xBLiAqL1xuICBjbGFTaWduZWRMYWJlbDogc3RyaW5nfFJlZ0V4cDtcbiAgLyoqIFBhdHRlcm4gdGhhdCBtYXRjaGVzIGxhYmVscyB3aGljaCBpbXBseSBhIG1lcmdlIHJlYWR5IHB1bGwgcmVxdWVzdC4gKi9cbiAgbWVyZ2VSZWFkeUxhYmVsOiBzdHJpbmd8UmVnRXhwO1xuICAvKiogTGFiZWwgd2hpY2ggY2FuIGJlIGFwcGxpZWQgdG8gZml4dXAgY29tbWl0IG1lc3NhZ2VzIGluIHRoZSBtZXJnZSBzY3JpcHQuICovXG4gIGNvbW1pdE1lc3NhZ2VGaXh1cExhYmVsOiBzdHJpbmd8UmVnRXhwO1xuICAvKipcbiAgICogV2hldGhlciBwdWxsIHJlcXVlc3RzIHNob3VsZCBiZSBtZXJnZWQgdXNpbmcgdGhlIEdpdGh1YiBBUEkuIFRoaXMgY2FuIGJlIGVuYWJsZWRcbiAgICogaWYgcHJvamVjdHMgd2FudCB0byBoYXZlIHRoZWlyIHB1bGwgcmVxdWVzdHMgc2hvdyB1cCBhcyBgTWVyZ2VkYCBpbiB0aGUgR2l0aHViIFVJLlxuICAgKiBUaGUgZG93bnNpZGUgaXMgdGhhdCBmaXh1cCBvciBzcXVhc2ggY29tbWl0cyBubyBsb25nZXIgd29yayBhcyB0aGUgR2l0aHViIEFQSSBkb2VzXG4gICAqIG5vdCBzdXBwb3J0IHRoaXMuXG4gICAqL1xuICBnaXRodWJBcGlNZXJnZTogZmFsc2V8R2l0aHViQXBpTWVyZ2VTdHJhdGVneUNvbmZpZztcbn1cblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIG9mIHRoZSBtZXJnZSBzY3JpcHQgaW4gdGhlIGRldi1pbmZyYSBjb25maWd1cmF0aW9uLiBOb3RlIHRoYXQgdGhlXG4gKiBtZXJnZSBjb25maWd1cmF0aW9uIGlzIHJldHJpZXZlZCBsYXppbHkgYXMgdXN1YWxseSB0aGVzZSBjb25maWd1cmF0aW9ucyByZWx5XG4gKiBvbiBicmFuY2ggbmFtZSBjb21wdXRhdGlvbnMuIFdlIGRvbid0IHdhbnQgdG8gcnVuIHRoZXNlIGltbWVkaWF0ZWx5IHdoZW5ldmVyXG4gKiB0aGUgZGV2LWluZnJhIGNvbmZpZ3VyYXRpb24gaXMgbG9hZGVkIGFzIHRoYXQgY291bGQgc2xvdy1kb3duIG90aGVyIGNvbW1hbmRzLlxuICovXG5leHBvcnQgdHlwZSBEZXZJbmZyYU1lcmdlQ29uZmlnID0gTmdEZXZDb25maWc8eydtZXJnZSc6ICgpID0+IE1lcmdlQ29uZmlnfT47XG5cbi8qKiBMb2FkcyBhbmQgdmFsaWRhdGVzIHRoZSBtZXJnZSBjb25maWd1cmF0aW9uLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvYWRBbmRWYWxpZGF0ZUNvbmZpZygpOiB7Y29uZmlnPzogTWVyZ2VDb25maWdXaXRoUmVtb3RlLCBlcnJvcnM/OiBzdHJpbmdbXX0ge1xuICBjb25zdCBjb25maWc6IFBhcnRpYWw8RGV2SW5mcmFNZXJnZUNvbmZpZz4gPSBnZXRDb25maWcoKTtcblxuICBpZiAoY29uZmlnLm1lcmdlID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXJyb3JzOiBbJ05vIG1lcmdlIGNvbmZpZ3VyYXRpb24gZm91bmQuIFNldCB0aGUgYG1lcmdlYCBjb25maWd1cmF0aW9uLiddXG4gICAgfVxuICB9XG5cbiAgaWYgKHR5cGVvZiBjb25maWcubWVyZ2UgIT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXJyb3JzOiBbJ0V4cGVjdGVkIG1lcmdlIGNvbmZpZ3VyYXRpb24gdG8gYmUgZGVmaW5lZCBsYXppbHkgdGhyb3VnaCBhIGZ1bmN0aW9uLiddXG4gICAgfVxuICB9XG5cbiAgY29uc3QgbWVyZ2VDb25maWcgPSBjb25maWcubWVyZ2UoKTtcbiAgY29uc3QgZXJyb3JzID0gdmFsaWRhdGVNZXJnZUNvbmZpZyhtZXJnZUNvbmZpZyk7XG5cbiAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICByZXR1cm4ge2Vycm9yc307XG4gIH1cblxuICBpZiAobWVyZ2VDb25maWcucmVtb3RlKSB7XG4gICAgbWVyZ2VDb25maWcucmVtb3RlID0gey4uLmNvbmZpZy5naXRodWIsIC4uLm1lcmdlQ29uZmlnLnJlbW90ZX07XG4gIH0gZWxzZSB7XG4gICAgbWVyZ2VDb25maWcucmVtb3RlID0gY29uZmlnLmdpdGh1YjtcbiAgfVxuXG4gIC8vIFdlIGFsd2F5cyBzZXQgdGhlIGByZW1vdGVgIG9wdGlvbiwgc28gd2UgY2FuIHNhZmVseSBjYXN0IHRoZVxuICAvLyBjb25maWcgdG8gYE1lcmdlQ29uZmlnV2l0aFJlbW90ZWAuXG4gIHJldHVybiB7Y29uZmlnOiBtZXJnZUNvbmZpZyBhcyBNZXJnZUNvbmZpZ1dpdGhSZW1vdGV9O1xufVxuXG4vKiogVmFsaWRhdGVzIHRoZSBzcGVjaWZpZWQgY29uZmlndXJhdGlvbi4gUmV0dXJucyBhIGxpc3Qgb2YgZmFpbHVyZSBtZXNzYWdlcy4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlTWVyZ2VDb25maWcoY29uZmlnOiBQYXJ0aWFsPE1lcmdlQ29uZmlnPik6IHN0cmluZ1tdIHtcbiAgY29uc3QgZXJyb3JzOiBzdHJpbmdbXSA9IFtdO1xuICBpZiAoIWNvbmZpZy5sYWJlbHMpIHtcbiAgICBlcnJvcnMucHVzaCgnTm8gbGFiZWwgY29uZmlndXJhdGlvbi4nKTtcbiAgfSBlbHNlIGlmICghQXJyYXkuaXNBcnJheShjb25maWcubGFiZWxzKSkge1xuICAgIGVycm9ycy5wdXNoKCdMYWJlbCBjb25maWd1cmF0aW9uIG5lZWRzIHRvIGJlIGFuIGFycmF5LicpO1xuICB9XG4gIGlmICghY29uZmlnLmNsYVNpZ25lZExhYmVsKSB7XG4gICAgZXJyb3JzLnB1c2goJ05vIENMQSBzaWduZWQgbGFiZWwgY29uZmlndXJlZC4nKTtcbiAgfVxuICBpZiAoIWNvbmZpZy5tZXJnZVJlYWR5TGFiZWwpIHtcbiAgICBlcnJvcnMucHVzaCgnTm8gbWVyZ2UgcmVhZHkgbGFiZWwgY29uZmlndXJlZC4nKTtcbiAgfVxuICBpZiAoY29uZmlnLmdpdGh1YkFwaU1lcmdlID09PSB1bmRlZmluZWQpIHtcbiAgICBlcnJvcnMucHVzaCgnTm8gZXhwbGljaXQgY2hvaWNlIG9mIG1lcmdlIHN0cmF0ZWd5LiBQbGVhc2Ugc2V0IGBnaXRodWJBcGlNZXJnZWAuJyk7XG4gIH1cbiAgcmV0dXJuIGVycm9ycztcbn1cbiJdfQ==