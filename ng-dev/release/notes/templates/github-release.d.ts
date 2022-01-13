/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
declare const _default: "\n<a name=\"<%- urlFragmentForRelease %>\"></a>\n# <%- version %><% if (title) { %> \"<%- title %>\"<% } %> (<%- dateStamp %>)\n\n<%_\nconst breakingChanges = commits.filter(hasBreakingChanges);\nif (breakingChanges.length) {\n_%>\n## Breaking Changes\n\n<%_\n  for (const group of asCommitGroups(breakingChanges)) {\n_%>\n### <%- group.title %>\n<%- group.commits.map(commit => bulletizeText(commit.breakingChanges[0].text)).join('\\n\\n') %>\n<%_\n  }\n}\n_%>\n\n<%_\nconst deprecations = commits.filter(hasDeprecations);\nif (deprecations.length) {\n_%>\n## Deprecations\n<%_\n  for (const group of asCommitGroups(deprecations)) {\n_%>\n### <%- group.title %>\n<%- group.commits.map(commit => bulletizeText(commit.deprecations[0].text)).join('\\n\\n') %>\n<%_\n  }\n}\n_%>\n\n<%_\nconst commitsInChangelog = commits.filter(includeInReleaseNotes());\nfor (const group of asCommitGroups(commitsInChangelog)) {\n_%>\n\n### <%- group.title %>\n| Commit | Description |\n| -- | -- |\n<%_\n  for (const commit of group.commits) {\n_%>\n| <%- commitToBadge(commit) %> | <%- commit.description %> |\n<%_\n  }\n}\n_%>\n\n<%_\nconst authors = commitAuthors(commits);\nif (authors.length === 1) {\n_%>\n## Special Thanks\n<%- authors[0]%>\n<%_\n}\nif (authors.length > 1) {\n_%>\n## Special Thanks\n<%- authors.slice(0, -1).join(', ') %> and <%- authors.slice(-1)[0] %>\n<%_\n}\n_%>\n";
export default _default;
