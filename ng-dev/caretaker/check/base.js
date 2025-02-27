"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModule = void 0;
const authenticated_git_client_1 = require("../../utils/git/authenticated-git-client");
/** The BaseModule to extend modules for caretaker checks from. */
class BaseModule {
    constructor(config) {
        this.config = config;
        /** The singleton instance of the authenticated git client. */
        this.git = authenticated_git_client_1.AuthenticatedGitClient.get();
        /** The data for the module. */
        this.data = this.retrieveData();
    }
}
exports.BaseModule = BaseModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL25nLWRldi9jYXJldGFrZXIvY2hlY2svYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFHSCx1RkFBZ0Y7QUFHaEYsa0VBQWtFO0FBQ2xFLE1BQXNCLFVBQVU7SUFNOUIsWUFBc0IsTUFBMEQ7UUFBMUQsV0FBTSxHQUFOLE1BQU0sQ0FBb0Q7UUFMaEYsOERBQThEO1FBQ3BELFFBQUcsR0FBRyxpREFBc0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUM3QywrQkFBK0I7UUFDdEIsU0FBSSxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUUrQyxDQUFDO0NBT3JGO0FBYkQsZ0NBYUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtHaXRodWJDb25maWd9IGZyb20gJy4uLy4uL3V0aWxzL2NvbmZpZyc7XG5pbXBvcnQge0F1dGhlbnRpY2F0ZWRHaXRDbGllbnR9IGZyb20gJy4uLy4uL3V0aWxzL2dpdC9hdXRoZW50aWNhdGVkLWdpdC1jbGllbnQnO1xuaW1wb3J0IHtDYXJldGFrZXJDb25maWd9IGZyb20gJy4uL2NvbmZpZyc7XG5cbi8qKiBUaGUgQmFzZU1vZHVsZSB0byBleHRlbmQgbW9kdWxlcyBmb3IgY2FyZXRha2VyIGNoZWNrcyBmcm9tLiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJhc2VNb2R1bGU8RGF0YT4ge1xuICAvKiogVGhlIHNpbmdsZXRvbiBpbnN0YW5jZSBvZiB0aGUgYXV0aGVudGljYXRlZCBnaXQgY2xpZW50LiAqL1xuICBwcm90ZWN0ZWQgZ2l0ID0gQXV0aGVudGljYXRlZEdpdENsaWVudC5nZXQoKTtcbiAgLyoqIFRoZSBkYXRhIGZvciB0aGUgbW9kdWxlLiAqL1xuICByZWFkb25seSBkYXRhID0gdGhpcy5yZXRyaWV2ZURhdGEoKTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgY29uZmlnOiB7Y2FyZXRha2VyOiBDYXJldGFrZXJDb25maWc7IGdpdGh1YjogR2l0aHViQ29uZmlnfSkge31cblxuICAvKiogQXN5bmNyb25vdXNseSByZXRyaWV2ZSBkYXRhIGZvciB0aGUgbW9kdWxlLiAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmV0cmlldmVEYXRhKCk6IFByb21pc2U8RGF0YT47XG5cbiAgLyoqIFByaW50IHRoZSBpbmZvcm1hdGlvbiBkaXNjb3ZlcmVkIGZvciB0aGUgbW9kdWxlIHRvIHRoZSB0ZXJtaW5hbC4gKi9cbiAgYWJzdHJhY3QgcHJpbnRUb1Rlcm1pbmFsKCk6IFByb21pc2U8dm9pZD47XG59XG4iXX0=