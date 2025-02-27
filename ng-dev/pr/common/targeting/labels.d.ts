/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ReleaseConfig } from '../../../release/config/index';
import { ActiveReleaseTrains } from '../../../release/versioning';
import { GithubConfig } from '../../../utils/config';
import { TargetLabel } from './target-label';
import { GithubClient } from '../../../utils/git/github';
/**
 * Gets a list of target labels which should be considered by the merge
 * tooling when a pull request is processed to be merged.
 *
 * The target labels are implemented according to the design document which
 * specifies versioning, branching and releasing for the Angular organization:
 * https://docs.google.com/document/d/197kVillDwx-RZtSVOBtPb4BBIAw0E9RT3q3v6DZkykU
 *
 * @param api Instance of a Github client. Used to query for the release train branches.
 * @param config Configuration for the Github remote and release packages. Used to fetch
 *   NPM version data when LTS version branches are validated.
 */
export declare function getTargetLabelsForActiveReleaseTrains({ latest, releaseCandidate, next }: ActiveReleaseTrains, api: GithubClient, config: Partial<{
    github: GithubConfig;
    release: ReleaseConfig;
}>): Promise<TargetLabel[]>;
