/// <amd-module name="@angular/dev-infra-private/pullapprove/group" />
import { PullApproveGroupConfig } from './parse-yaml';
/** A condition for a group. */
interface GroupCondition {
    expression: string;
    checkFn: (files: string[]) => boolean;
    matchedFiles: Set<string>;
}
/** Result of testing files against the group. */
export interface PullApproveGroupResult {
    groupName: string;
    matchedConditions: GroupCondition[];
    matchedCount: number;
    unmatchedConditions: GroupCondition[];
    unmatchedCount: number;
}
/** A PullApprove group to be able to test files against. */
export declare class PullApproveGroup {
    groupName: string;
    /** List of conditions for the group. */
    conditions: GroupCondition[];
    constructor(groupName: string, config: PullApproveGroupConfig);
    private _captureConditions;
    /**
     * Tests a provided file path to determine if it would be considered matched by
     * the pull approve group's conditions.
     */
    testFile(filePath: string): boolean;
    /** Retrieve the results for the Group, all matched and unmatched conditions. */
    getResults(): PullApproveGroupResult;
}
export {};
