/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { GithubConfig } from '../config';
import { GitClient } from './git-client';
import { AuthenticatedGithubClient, GithubRepo } from './github';
/** Describes a function that can be used to test for given Github OAuth scopes. */
export declare type OAuthScopeTestFunction = (scopes: string[], missing: string[]) => void;
/**
 * Extension of the `GitClient` with additional utilities which are useful for
 * authenticated Git client instances.
 */
export declare class AuthenticatedGitClient extends GitClient {
    readonly githubToken: string;
    /**
     * Regular expression that matches the provided Github token. Used for
     * sanitizing the token from Git child process output.
     */
    private readonly _githubTokenRegex;
    /** The OAuth scopes available for the provided Github token. */
    private _cachedOauthScopes;
    /** Cached found fork of the configured project. */
    private _cachedForkRepo;
    /** Instance of an authenticated github client. */
    readonly github: AuthenticatedGithubClient;
    protected constructor(githubToken: string, baseDir?: string, config?: {
        github: GithubConfig;
    });
    /** Sanitizes a given message by omitting the provided Github token if present. */
    sanitizeConsoleOutput(value: string): string;
    /** Git URL that resolves to the configured repository. */
    getRepoGitUrl(): string;
    /**
     * Assert the GitClient instance is using a token with permissions for the all of the
     * provided OAuth scopes.
     */
    hasOauthScopes(testFn: OAuthScopeTestFunction): Promise<true | {
        error: string;
    }>;
    /**
     * Gets an owned fork for the configured project of the authenticated user, caching the determined
     * fork repository as the authenticated user cannot change during action execution.
     */
    getForkOfAuthenticatedUser(): Promise<GithubRepo>;
    /** Fetch the OAuth scopes for the loaded Github token. */
    private _fetchAuthScopesForToken;
    /** The singleton instance of the `AuthenticatedGitClient`. */
    private static _authenticatedInstance;
    /**
     * Static method to get the singleton instance of the `AuthenticatedGitClient`,
     * creating it if it has not yet been created.
     */
    static get(): AuthenticatedGitClient;
    /** Configures an authenticated git client. */
    static configure(token: string): void;
}
