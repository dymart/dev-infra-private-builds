/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Assertions, MultipleAssertions } from './assertion-typings';
/**
 * Describes the Github configuration for dev-infra. This configuration is
 * used for API requests, determining the upstream remote, etc.
 */
export interface GithubConfig {
    /** Owner name of the repository. */
    owner: string;
    /** Name of the repository. */
    name: string;
    /** Main branch name for the repository. */
    mainBranchName: string;
    /** If SSH protocol should be used for git interactions. */
    useSsh?: boolean;
    /** Whether the specified repository is private. */
    private?: boolean;
}
/**
 * Set the cached configuration object to be loaded later. Only to be used on CI situations in
 * which loading from the `.ng-dev/` directory is not possible.
 */
export declare function setConfig(config: {}): void;
/**
 * Get the configuration from the file system, returning the already loaded
 * copy if it is defined.
 */
export declare function getConfig(): {};
export declare function getConfig(baseDir: string): {};
export declare function getConfig<A extends MultipleAssertions>(assertions: A): Assertions<A>;
/**
 * Get the local user configuration from the file system, returning the already loaded copy if it is
 * defined.
 *
 * @returns The user configuration object, or an empty object if no user configuration file is
 * present. The object is an untyped object as there are no required user configurations.
 */
export declare function getUserConfig(): {
    [x: string]: any;
};
/** A standard error class to thrown during assertions while validating configuration. */
export declare class ConfigValidationError extends Error {
    readonly errors: string[];
    constructor(message?: string, errors?: string[]);
}
/** Validate th configuration has been met for the ng-dev command. */
export declare function assertValidGithubConfig<T>(config: T & Partial<{
    github: GithubConfig;
}>): asserts config is T & {
    github: GithubConfig;
};
