#!/usr/bin/env node
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/dev-infra-private/cli", ["require", "exports", "yargs", "@angular/dev-infra-private/ts-circular-dependencies", "@angular/dev-infra-private/pullapprove/cli", "@angular/dev-infra-private/commit-message/cli", "@angular/dev-infra-private/format/cli", "@angular/dev-infra-private/release/cli", "@angular/dev-infra-private/pr/cli", "@angular/dev-infra-private/utils/console", "@angular/dev-infra-private/caretaker/cli", "@angular/dev-infra-private/ngbot/cli"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var yargs = require("yargs");
    var index_1 = require("@angular/dev-infra-private/ts-circular-dependencies");
    var cli_1 = require("@angular/dev-infra-private/pullapprove/cli");
    var cli_2 = require("@angular/dev-infra-private/commit-message/cli");
    var cli_3 = require("@angular/dev-infra-private/format/cli");
    var cli_4 = require("@angular/dev-infra-private/release/cli");
    var cli_5 = require("@angular/dev-infra-private/pr/cli");
    var console_1 = require("@angular/dev-infra-private/utils/console");
    var cli_6 = require("@angular/dev-infra-private/caretaker/cli");
    var cli_7 = require("@angular/dev-infra-private/ngbot/cli");
    yargs.scriptName('ng-dev')
        .middleware(console_1.captureLogOutputForCommand)
        .demandCommand()
        .recommendCommands()
        .command('commit-message <command>', '', cli_2.buildCommitMessageParser)
        .command('format <command>', '', cli_3.buildFormatParser)
        .command('pr <command>', '', cli_5.buildPrParser)
        .command('pullapprove <command>', '', cli_1.buildPullapproveParser)
        .command('release <command>', '', cli_4.buildReleaseParser)
        .command('ts-circular-deps <command>', '', index_1.tsCircularDependenciesBuilder)
        .command('caretaker <command>', '', cli_6.buildCaretakerParser)
        .command('ngbot <command>', false, cli_7.buildNgbotParser)
        .wrap(120)
        .strict()
        .parse();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vZGV2LWluZnJhL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFDQTs7Ozs7O09BTUc7SUFDSCw2QkFBK0I7SUFDL0IsNkVBQStFO0lBQy9FLGtFQUF5RDtJQUN6RCxxRUFBOEQ7SUFDOUQsNkRBQStDO0lBQy9DLDhEQUFpRDtJQUNqRCx5REFBdUM7SUFDdkMsb0VBQTJEO0lBQzNELGdFQUFxRDtJQUNyRCw0REFBNkM7SUFFN0MsS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7U0FDckIsVUFBVSxDQUFDLG9DQUEwQixDQUFDO1NBQ3RDLGFBQWEsRUFBRTtTQUNmLGlCQUFpQixFQUFFO1NBQ25CLE9BQU8sQ0FBQywwQkFBMEIsRUFBRSxFQUFFLEVBQUUsOEJBQXdCLENBQUM7U0FDakUsT0FBTyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsRUFBRSx1QkFBaUIsQ0FBQztTQUNsRCxPQUFPLENBQUMsY0FBYyxFQUFFLEVBQUUsRUFBRSxtQkFBYSxDQUFDO1NBQzFDLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRSxFQUFFLEVBQUUsNEJBQXNCLENBQUM7U0FDNUQsT0FBTyxDQUFDLG1CQUFtQixFQUFFLEVBQUUsRUFBRSx3QkFBa0IsQ0FBQztTQUNwRCxPQUFPLENBQUMsNEJBQTRCLEVBQUUsRUFBRSxFQUFFLHFDQUE2QixDQUFDO1NBQ3hFLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxFQUFFLEVBQUUsMEJBQW9CLENBQUM7U0FDeEQsT0FBTyxDQUFDLGlCQUFpQixFQUFFLEtBQUssRUFBRSxzQkFBZ0IsQ0FBQztTQUNuRCxJQUFJLENBQUMsR0FBRyxDQUFDO1NBQ1QsTUFBTSxFQUFFO1NBQ1IsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAqIGFzIHlhcmdzIGZyb20gJ3lhcmdzJztcbmltcG9ydCB7dHNDaXJjdWxhckRlcGVuZGVuY2llc0J1aWxkZXJ9IGZyb20gJy4vdHMtY2lyY3VsYXItZGVwZW5kZW5jaWVzL2luZGV4JztcbmltcG9ydCB7YnVpbGRQdWxsYXBwcm92ZVBhcnNlcn0gZnJvbSAnLi9wdWxsYXBwcm92ZS9jbGknO1xuaW1wb3J0IHtidWlsZENvbW1pdE1lc3NhZ2VQYXJzZXJ9IGZyb20gJy4vY29tbWl0LW1lc3NhZ2UvY2xpJztcbmltcG9ydCB7YnVpbGRGb3JtYXRQYXJzZXJ9IGZyb20gJy4vZm9ybWF0L2NsaSc7XG5pbXBvcnQge2J1aWxkUmVsZWFzZVBhcnNlcn0gZnJvbSAnLi9yZWxlYXNlL2NsaSc7XG5pbXBvcnQge2J1aWxkUHJQYXJzZXJ9IGZyb20gJy4vcHIvY2xpJztcbmltcG9ydCB7Y2FwdHVyZUxvZ091dHB1dEZvckNvbW1hbmR9IGZyb20gJy4vdXRpbHMvY29uc29sZSc7XG5pbXBvcnQge2J1aWxkQ2FyZXRha2VyUGFyc2VyfSBmcm9tICcuL2NhcmV0YWtlci9jbGknO1xuaW1wb3J0IHtidWlsZE5nYm90UGFyc2VyfSBmcm9tICcuL25nYm90L2NsaSc7XG5cbnlhcmdzLnNjcmlwdE5hbWUoJ25nLWRldicpXG4gICAgLm1pZGRsZXdhcmUoY2FwdHVyZUxvZ091dHB1dEZvckNvbW1hbmQpXG4gICAgLmRlbWFuZENvbW1hbmQoKVxuICAgIC5yZWNvbW1lbmRDb21tYW5kcygpXG4gICAgLmNvbW1hbmQoJ2NvbW1pdC1tZXNzYWdlIDxjb21tYW5kPicsICcnLCBidWlsZENvbW1pdE1lc3NhZ2VQYXJzZXIpXG4gICAgLmNvbW1hbmQoJ2Zvcm1hdCA8Y29tbWFuZD4nLCAnJywgYnVpbGRGb3JtYXRQYXJzZXIpXG4gICAgLmNvbW1hbmQoJ3ByIDxjb21tYW5kPicsICcnLCBidWlsZFByUGFyc2VyKVxuICAgIC5jb21tYW5kKCdwdWxsYXBwcm92ZSA8Y29tbWFuZD4nLCAnJywgYnVpbGRQdWxsYXBwcm92ZVBhcnNlcilcbiAgICAuY29tbWFuZCgncmVsZWFzZSA8Y29tbWFuZD4nLCAnJywgYnVpbGRSZWxlYXNlUGFyc2VyKVxuICAgIC5jb21tYW5kKCd0cy1jaXJjdWxhci1kZXBzIDxjb21tYW5kPicsICcnLCB0c0NpcmN1bGFyRGVwZW5kZW5jaWVzQnVpbGRlcilcbiAgICAuY29tbWFuZCgnY2FyZXRha2VyIDxjb21tYW5kPicsICcnLCBidWlsZENhcmV0YWtlclBhcnNlcilcbiAgICAuY29tbWFuZCgnbmdib3QgPGNvbW1hbmQ+JywgZmFsc2UsIGJ1aWxkTmdib3RQYXJzZXIpXG4gICAgLndyYXAoMTIwKVxuICAgIC5zdHJpY3QoKVxuICAgIC5wYXJzZSgpO1xuIl19