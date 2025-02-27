"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rule = void 0;
const rules_1 = require("tslint/lib/rules");
const ts = require("typescript");
const noNamedExportsError = 'Named import is not allowed. The module does not expose named exports when ' +
    'imported in an ES module. Use a default import instead.';
const noDefaultExportError = 'Default import is not allowed. The module does not expose a default export at ' +
    'runtime. Use a named import instead.';
/**
 * Rule that blocks named imports from being used for certain configured module
 * specifiers. This is helpful for enforcing an ESM-compatible interop with CommonJS
 * modules which do not expose named bindings at runtime.
 *
 * For example, consider the `typescript` module. It does not statically expose named
 * exports even though the type definition suggests it. An import like the following
 * will break at runtime when the `typescript` CommonJS module is imported inside an ESM.
 *
 * ```
 * import * as ts from 'typescript';
 * console.log(ts.SyntaxKind.CallExpression); // `SyntaxKind is undefined`.
 * ```
 *
 * More details here: https://nodejs.org/api/esm.html#esm_import_statements.
 */
class Rule extends rules_1.AbstractRule {
    apply(sourceFile) {
        const options = this.getOptions().ruleArguments[0];
        return this.applyWithFunction(sourceFile, (ctx) => visitNode(sourceFile, ctx, options));
    }
}
exports.Rule = Rule;
function visitNode(node, ctx, options) {
    if (options.incompatibleModules && ts.isImportDeclaration(node)) {
        const specifier = node.moduleSpecifier;
        const failureMsg = options.incompatibleModules[specifier.text];
        if (failureMsg !== undefined) {
            ctx.addFailureAtNode(node, failureMsg);
            return;
        }
    }
    if (options.noNamedExports && isNamedImportToDisallowedModule(node, options.noNamedExports)) {
        ctx.addFailureAtNode(node, noNamedExportsError);
    }
    if (options.noDefaultExport && isDefaultImportToDisallowedModule(node, options.noDefaultExport)) {
        ctx.addFailureAtNode(node, noDefaultExportError);
    }
    ts.forEachChild(node, (node) => visitNode(node, ctx, options));
}
function isNamedImportToDisallowedModule(node, disallowed) {
    if (!ts.isImportDeclaration(node) || node.importClause === undefined) {
        return false;
    }
    const specifier = node.moduleSpecifier;
    return !!node.importClause.namedBindings && disallowed.includes(specifier.text);
}
function isDefaultImportToDisallowedModule(node, disallowed) {
    if (!ts.isImportDeclaration(node) || node.importClause === undefined) {
        return false;
    }
    const specifier = node.moduleSpecifier;
    return node.importClause.name !== undefined && disallowed.includes(specifier.text);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGVJbXBvcnRGb3JFc21DanNJbnRlcm9wUnVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3RzbGludC1ydWxlcy92YWxpZGF0ZUltcG9ydEZvckVzbUNqc0ludGVyb3BSdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUdILDRDQUE4QztBQUM5QyxpQ0FBaUM7QUFFakMsTUFBTSxtQkFBbUIsR0FDdkIsNkVBQTZFO0lBQzdFLHlEQUF5RCxDQUFDO0FBRTVELE1BQU0sb0JBQW9CLEdBQ3hCLGdGQUFnRjtJQUNoRixzQ0FBc0MsQ0FBQztBQXNCekM7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsTUFBYSxJQUFLLFNBQVEsb0JBQVk7SUFDM0IsS0FBSyxDQUFDLFVBQXlCO1FBQ3RDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkQsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQzFGLENBQUM7Q0FDRjtBQUxELG9CQUtDO0FBRUQsU0FBUyxTQUFTLENBQUMsSUFBYSxFQUFFLEdBQWdCLEVBQUUsT0FBb0I7SUFDdEUsSUFBSSxPQUFPLENBQUMsbUJBQW1CLElBQUksRUFBRSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxFQUFFO1FBQy9ELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFtQyxDQUFDO1FBQzNELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFL0QsSUFBSSxVQUFVLEtBQUssU0FBUyxFQUFFO1lBQzVCLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDdkMsT0FBTztTQUNSO0tBQ0Y7SUFFRCxJQUFJLE9BQU8sQ0FBQyxjQUFjLElBQUksK0JBQStCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBRTtRQUMzRixHQUFHLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLG1CQUFtQixDQUFDLENBQUM7S0FDakQ7SUFFRCxJQUFJLE9BQU8sQ0FBQyxlQUFlLElBQUksaUNBQWlDLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsRUFBRTtRQUMvRixHQUFHLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLG9CQUFvQixDQUFDLENBQUM7S0FDbEQ7SUFFRCxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNqRSxDQUFDO0FBRUQsU0FBUywrQkFBK0IsQ0FBQyxJQUFhLEVBQUUsVUFBb0I7SUFDMUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLFNBQVMsRUFBRTtRQUNwRSxPQUFPLEtBQUssQ0FBQztLQUNkO0lBQ0QsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGVBQW1DLENBQUM7SUFDM0QsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEYsQ0FBQztBQUVELFNBQVMsaUNBQWlDLENBQUMsSUFBYSxFQUFFLFVBQW9CO0lBQzVFLElBQUksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxTQUFTLEVBQUU7UUFDcEUsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUNELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFtQyxDQUFDO0lBRTNELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEtBQUssU0FBUyxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtSdWxlRmFpbHVyZSwgV2Fsa0NvbnRleHR9IGZyb20gJ3RzbGludC9saWInO1xuaW1wb3J0IHtBYnN0cmFjdFJ1bGV9IGZyb20gJ3RzbGludC9saWIvcnVsZXMnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmNvbnN0IG5vTmFtZWRFeHBvcnRzRXJyb3IgPVxuICAnTmFtZWQgaW1wb3J0IGlzIG5vdCBhbGxvd2VkLiBUaGUgbW9kdWxlIGRvZXMgbm90IGV4cG9zZSBuYW1lZCBleHBvcnRzIHdoZW4gJyArXG4gICdpbXBvcnRlZCBpbiBhbiBFUyBtb2R1bGUuIFVzZSBhIGRlZmF1bHQgaW1wb3J0IGluc3RlYWQuJztcblxuY29uc3Qgbm9EZWZhdWx0RXhwb3J0RXJyb3IgPVxuICAnRGVmYXVsdCBpbXBvcnQgaXMgbm90IGFsbG93ZWQuIFRoZSBtb2R1bGUgZG9lcyBub3QgZXhwb3NlIGEgZGVmYXVsdCBleHBvcnQgYXQgJyArXG4gICdydW50aW1lLiBVc2UgYSBuYW1lZCBpbXBvcnQgaW5zdGVhZC4nO1xuXG5pbnRlcmZhY2UgUnVsZU9wdGlvbnMge1xuICAvKipcbiAgICogTGlzdCBvZiBtb2R1bGVzIHdpdGhvdXQgYW55IG5hbWVkIGV4cG9ydHMgdGhhdCBOb2RlSlMgY2FuIHN0YXRpY2FsbHkgZGV0ZWN0IHdoZW4gdGhlXG4gICAqIENvbW1vbkpTIG1vZHVsZSBpcyBpbXBvcnRlZCBmcm9tIEVTTS4gTm9kZSBvbmx5IGV4cG9zZXMgbmFtZWQgZXhwb3J0cyB3aGljaCBhcmVcbiAgICogc3RhdGljYWxseSBkaXNjb3ZlcmFibGU6IGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvZXNtLmh0bWwjZXNtX2ltcG9ydF9zdGF0ZW1lbnRzLlxuICAgKi9cbiAgbm9OYW1lZEV4cG9ydHM/OiBzdHJpbmdbXTtcbiAgLyoqXG4gICAqIExpc3Qgb2YgbW9kdWxlcyB3aGljaCBhcHBlYXIgdG8gaGF2ZSBuYW1lZCBleHBvcnRzIGluIHRoZSB0eXBpbmdzIGJ1dCBkb1xuICAgKiBub3QgaGF2ZSBhbnkgYXQgcnVudGltZSBkdWUgdG8gTm9kZUpTIG5vdCBiZWluZyBhYmxlIHRvIGRpc2NvdmVyIHRoZXNlXG4gICAqIHRocm91Z2ggc3RhdGljIGFuYWx5c2lzOiBodHRwczovL25vZGVqcy5vcmcvYXBpL2VzbS5odG1sI2VzbV9pbXBvcnRfc3RhdGVtZW50cy5cbiAgICogKi9cbiAgbm9EZWZhdWx0RXhwb3J0Pzogc3RyaW5nW107XG4gIC8qKlxuICAgKiBMaXN0IG9mIG1vZHVsZXMgd2hpY2ggYXJlIGFsd2F5cyBpbmNvbXBhdGlibGUuIFRoZSBydWxlIGFsbG93cyBmb3IgYSBjdXN0b21cbiAgICogbWVzc2FnZSB0byBiZSBwcm92aWRlZCB3aGVuIGl0IGRpc2NvdmVycyBhbiBpbXBvcnQgdG8gc3VjaCBhIG1vZHVsZS5cbiAgICovXG4gIGluY29tcGF0aWJsZU1vZHVsZXM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xufVxuXG4vKipcbiAqIFJ1bGUgdGhhdCBibG9ja3MgbmFtZWQgaW1wb3J0cyBmcm9tIGJlaW5nIHVzZWQgZm9yIGNlcnRhaW4gY29uZmlndXJlZCBtb2R1bGVcbiAqIHNwZWNpZmllcnMuIFRoaXMgaXMgaGVscGZ1bCBmb3IgZW5mb3JjaW5nIGFuIEVTTS1jb21wYXRpYmxlIGludGVyb3Agd2l0aCBDb21tb25KU1xuICogbW9kdWxlcyB3aGljaCBkbyBub3QgZXhwb3NlIG5hbWVkIGJpbmRpbmdzIGF0IHJ1bnRpbWUuXG4gKlxuICogRm9yIGV4YW1wbGUsIGNvbnNpZGVyIHRoZSBgdHlwZXNjcmlwdGAgbW9kdWxlLiBJdCBkb2VzIG5vdCBzdGF0aWNhbGx5IGV4cG9zZSBuYW1lZFxuICogZXhwb3J0cyBldmVuIHRob3VnaCB0aGUgdHlwZSBkZWZpbml0aW9uIHN1Z2dlc3RzIGl0LiBBbiBpbXBvcnQgbGlrZSB0aGUgZm9sbG93aW5nXG4gKiB3aWxsIGJyZWFrIGF0IHJ1bnRpbWUgd2hlbiB0aGUgYHR5cGVzY3JpcHRgIENvbW1vbkpTIG1vZHVsZSBpcyBpbXBvcnRlZCBpbnNpZGUgYW4gRVNNLlxuICpcbiAqIGBgYFxuICogaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG4gKiBjb25zb2xlLmxvZyh0cy5TeW50YXhLaW5kLkNhbGxFeHByZXNzaW9uKTsgLy8gYFN5bnRheEtpbmQgaXMgdW5kZWZpbmVkYC5cbiAqIGBgYFxuICpcbiAqIE1vcmUgZGV0YWlscyBoZXJlOiBodHRwczovL25vZGVqcy5vcmcvYXBpL2VzbS5odG1sI2VzbV9pbXBvcnRfc3RhdGVtZW50cy5cbiAqL1xuZXhwb3J0IGNsYXNzIFJ1bGUgZXh0ZW5kcyBBYnN0cmFjdFJ1bGUge1xuICBvdmVycmlkZSBhcHBseShzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKTogUnVsZUZhaWx1cmVbXSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpLnJ1bGVBcmd1bWVudHNbMF07XG4gICAgcmV0dXJuIHRoaXMuYXBwbHlXaXRoRnVuY3Rpb24oc291cmNlRmlsZSwgKGN0eCkgPT4gdmlzaXROb2RlKHNvdXJjZUZpbGUsIGN0eCwgb3B0aW9ucykpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHZpc2l0Tm9kZShub2RlOiB0cy5Ob2RlLCBjdHg6IFdhbGtDb250ZXh0LCBvcHRpb25zOiBSdWxlT3B0aW9ucykge1xuICBpZiAob3B0aW9ucy5pbmNvbXBhdGlibGVNb2R1bGVzICYmIHRzLmlzSW1wb3J0RGVjbGFyYXRpb24obm9kZSkpIHtcbiAgICBjb25zdCBzcGVjaWZpZXIgPSBub2RlLm1vZHVsZVNwZWNpZmllciBhcyB0cy5TdHJpbmdMaXRlcmFsO1xuICAgIGNvbnN0IGZhaWx1cmVNc2cgPSBvcHRpb25zLmluY29tcGF0aWJsZU1vZHVsZXNbc3BlY2lmaWVyLnRleHRdO1xuXG4gICAgaWYgKGZhaWx1cmVNc2cgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY3R4LmFkZEZhaWx1cmVBdE5vZGUobm9kZSwgZmFpbHVyZU1zZyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgaWYgKG9wdGlvbnMubm9OYW1lZEV4cG9ydHMgJiYgaXNOYW1lZEltcG9ydFRvRGlzYWxsb3dlZE1vZHVsZShub2RlLCBvcHRpb25zLm5vTmFtZWRFeHBvcnRzKSkge1xuICAgIGN0eC5hZGRGYWlsdXJlQXROb2RlKG5vZGUsIG5vTmFtZWRFeHBvcnRzRXJyb3IpO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMubm9EZWZhdWx0RXhwb3J0ICYmIGlzRGVmYXVsdEltcG9ydFRvRGlzYWxsb3dlZE1vZHVsZShub2RlLCBvcHRpb25zLm5vRGVmYXVsdEV4cG9ydCkpIHtcbiAgICBjdHguYWRkRmFpbHVyZUF0Tm9kZShub2RlLCBub0RlZmF1bHRFeHBvcnRFcnJvcik7XG4gIH1cblxuICB0cy5mb3JFYWNoQ2hpbGQobm9kZSwgKG5vZGUpID0+IHZpc2l0Tm9kZShub2RlLCBjdHgsIG9wdGlvbnMpKTtcbn1cblxuZnVuY3Rpb24gaXNOYW1lZEltcG9ydFRvRGlzYWxsb3dlZE1vZHVsZShub2RlOiB0cy5Ob2RlLCBkaXNhbGxvd2VkOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICBpZiAoIXRzLmlzSW1wb3J0RGVjbGFyYXRpb24obm9kZSkgfHwgbm9kZS5pbXBvcnRDbGF1c2UgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBzcGVjaWZpZXIgPSBub2RlLm1vZHVsZVNwZWNpZmllciBhcyB0cy5TdHJpbmdMaXRlcmFsO1xuICByZXR1cm4gISFub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzICYmIGRpc2FsbG93ZWQuaW5jbHVkZXMoc3BlY2lmaWVyLnRleHQpO1xufVxuXG5mdW5jdGlvbiBpc0RlZmF1bHRJbXBvcnRUb0Rpc2FsbG93ZWRNb2R1bGUobm9kZTogdHMuTm9kZSwgZGlzYWxsb3dlZDogc3RyaW5nW10pIHtcbiAgaWYgKCF0cy5pc0ltcG9ydERlY2xhcmF0aW9uKG5vZGUpIHx8IG5vZGUuaW1wb3J0Q2xhdXNlID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3Qgc3BlY2lmaWVyID0gbm9kZS5tb2R1bGVTcGVjaWZpZXIgYXMgdHMuU3RyaW5nTGl0ZXJhbDtcblxuICByZXR1cm4gbm9kZS5pbXBvcnRDbGF1c2UubmFtZSAhPT0gdW5kZWZpbmVkICYmIGRpc2FsbG93ZWQuaW5jbHVkZXMoc3BlY2lmaWVyLnRleHQpO1xufVxuIl19