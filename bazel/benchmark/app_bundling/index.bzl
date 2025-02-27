# Copyright Google LLC All Rights Reserved.
#
# Use of this source code is governed by an MIT-style license that can be
# found in the LICENSE file at https://angular.io/license

load("@build_bazel_rules_nodejs//:index.bzl", "npm_package_bin")
load("@npm//@bazel/terser:index.bzl", "terser_minified")
load("@npm//prettier:index.bzl", "prettier")
load("@npm//@angular/dev-infra-private/bazel/esbuild:index.bzl", "esbuild", "esbuild_config")
load("@npm//@angular/dev-infra-private/bazel:expand_template.bzl", "expand_template")

def _create_esbuild_minify_options(debug = False):
    # The minify options match with the configuration used by the CLI. The whitespace
    # minification is left to Terser. More details can be found here:
    # https://github.com/angular/angular-cli/blob/0d76bf04bca6e083865972b5398a32bbe9396e14/packages/angular_devkit/build_angular/src/webpack/plugins/javascript-optimizer-worker.ts#L133.
    return {
        "minifyIdentifiers": not debug,
        "minifySyntax": True,
        "minifyWhitespace": False,
        # TODO: Remove when https://github.com/bazelbuild/rules_nodejs/pull/3106 landed.
        "ignoreAnnotations": False,
    }

def app_bundle(
        name,
        entry_point,
        visibility = None,
        platform = "browser",
        target = "es2020",
        format = "iife",
        **kwargs):
    """
      Bundles an Angular applications in an optimized way that closely matches
      the compilation pipeline as within the Angular CLI.

      The rule produces a number of output bundles.

        JS                               : "%{name}.js"
        JS minified                      : "%{name}.min.js"
        JS minified (compressed)         : "%{name}.min.js.br",
        ----
        JS debug                         : "%{name}.debug.js"
        JS debug minified                : "%{name}.debug.min.js"
        JS debug minified (beautified)   : "%{name}.debug.min.beautified.js"
    """

    expand_template(
        name = "%s_config_file" % name,
        output_name = "%s_config.mjs" % name,
        template = "@npm//@angular/dev-infra-private/bazel/benchmark/app_bundling:esbuild.config-tmpl.mjs",
        visibility = visibility,
        substitutions = {
            "TMPL_ENTRY_POINT_ROOTPATH": "$(rootpath %s)" % entry_point,
        },
        data = [entry_point],
    )

    esbuild_config(
        name = "%s_esbuild_config" % name,
        config_file = ":%s_config_file" % name,
        deps = [
            "@npm//@angular/compiler-cli",
            "@npm//@angular/dev-infra-private/shared-scripts/angular-optimization:js_lib",
        ],
        visibility = visibility,
    )

    common_esbuild_options = {
        "config": "%s_esbuild_config" % name,
        "entry_point": entry_point,
        "target": target,
        "platform": platform,
        "format": format,
        "sourcemap": "external",
        "visibility": visibility,
    }

    common_terser_options = {
        "visibility": visibility,
        "config_file": "@npm//@angular/dev-infra-private/bazel/benchmark/app_bundling:terser_config.json",
        # TODO: Enable source maps for better debugging when `@bazel/terser` pre-declares
        # JS and map outputs. Tracked with: DEV-120
        "sourcemap": False,
    }

    esbuild(
        name = name,
        args = _create_esbuild_minify_options(False),
        **dict(kwargs, **common_esbuild_options)
    )

    esbuild(
        name = "%s.debug" % name,
        args = _create_esbuild_minify_options(True),
        **dict(kwargs, tags = ["manual"], **common_esbuild_options)
    )

    terser_minified(name = name + ".min", src = name + ".js", **common_terser_options)
    native.filegroup(name = name + ".min.js", srcs = [name + ".min"], visibility = visibility)

    terser_minified(name = name + ".debug.min", src = name + ".debug.js", debug = True, tags = ["manual"], **common_terser_options)
    native.filegroup(name = name + ".debug.min.js", srcs = [name + ".debug.min"], visibility = visibility, tags = ["manual"])

    # For better debugging, we also run prettier on the minified debug bundle. This is
    # necessary as Terser no longer has beautify/formatting functionality.
    prettier(
        name = name + ".debug.min.beautified",
        args = ["$(execpath %s)" % (name + ".debug.min")],
        # The `outs` attribute needs to be set when `stdout` is captured as an output.
        outs = [],
        stdout = name + ".debug.min.beautified.js",
        data = [name + ".debug.min"],
        visibility = visibility,
        tags = ["manual"],
    )

    npm_package_bin(
        name = "_%s_brotli" % name,
        tool = "@npm//@angular/dev-infra-private/bazel/benchmark/brotli-cli",
        data = [name + ".min.js"],
        outs = [name + ".min.js.br"],
        args = [
            "--output=$(execpath %s.min.js.br)" % name,
            "$(execpath %s.min.js)" % name,
        ],
        visibility = visibility,
    )
