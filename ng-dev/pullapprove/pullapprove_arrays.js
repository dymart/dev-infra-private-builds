"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PullApproveGroupArray = exports.PullApproveStringArray = exports.PullApproveGroupStateDependencyError = void 0;
const utils_1 = require("./utils");
class PullApproveGroupStateDependencyError extends Error {
}
exports.PullApproveGroupStateDependencyError = PullApproveGroupStateDependencyError;
/**
 * Superset of a native array. The superset provides methods which mimic the
 * list data structure used in PullApprove for files in conditions.
 */
class PullApproveStringArray extends Array {
    /** Returns a new array which only includes files that match the given pattern. */
    include(pattern) {
        return new PullApproveStringArray(...this.filter((s) => (0, utils_1.getOrCreateGlob)(pattern).match(s)));
    }
    /** Returns a new array which only includes files that did not match the given pattern. */
    exclude(pattern) {
        return new PullApproveStringArray(...this.filter((s) => !(0, utils_1.getOrCreateGlob)(pattern).match(s)));
    }
}
exports.PullApproveStringArray = PullApproveStringArray;
/**
 * Superset of a native array. The superset provides methods which mimic the
 * list data structure used in PullApprove for groups in conditions.
 */
class PullApproveGroupArray extends Array {
    include(pattern) {
        return new PullApproveGroupArray(...this.filter((s) => s.groupName.match(pattern)));
    }
    /** Returns a new array which only includes files that did not match the given pattern. */
    exclude(pattern) {
        return new PullApproveGroupArray(...this.filter((s) => s.groupName.match(pattern)));
    }
    get pending() {
        throw new PullApproveGroupStateDependencyError();
    }
    get active() {
        throw new PullApproveGroupStateDependencyError();
    }
    get inactive() {
        throw new PullApproveGroupStateDependencyError();
    }
    get rejected() {
        throw new PullApproveGroupStateDependencyError();
    }
    get names() {
        return this.map((g) => g.groupName);
    }
}
exports.PullApproveGroupArray = PullApproveGroupArray;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVsbGFwcHJvdmVfYXJyYXlzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbmctZGV2L3B1bGxhcHByb3ZlL3B1bGxhcHByb3ZlX2FycmF5cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFRQSxtQ0FBd0M7QUFFeEMsTUFBYSxvQ0FBcUMsU0FBUSxLQUFLO0NBQUc7QUFBbEUsb0ZBQWtFO0FBRWxFOzs7R0FHRztBQUNILE1BQWEsc0JBQXVCLFNBQVEsS0FBYTtJQUN2RCxrRkFBa0Y7SUFDbEYsT0FBTyxDQUFDLE9BQWU7UUFDckIsT0FBTyxJQUFJLHNCQUFzQixDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBQSx1QkFBZSxFQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUYsQ0FBQztJQUVELDBGQUEwRjtJQUMxRixPQUFPLENBQUMsT0FBZTtRQUNyQixPQUFPLElBQUksc0JBQXNCLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUEsdUJBQWUsRUFBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9GLENBQUM7Q0FDRjtBQVZELHdEQVVDO0FBRUQ7OztHQUdHO0FBQ0gsTUFBYSxxQkFBc0IsU0FBUSxLQUF1QjtJQUNoRSxPQUFPLENBQUMsT0FBZTtRQUNyQixPQUFPLElBQUkscUJBQXFCLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEYsQ0FBQztJQUVELDBGQUEwRjtJQUMxRixPQUFPLENBQUMsT0FBZTtRQUNyQixPQUFPLElBQUkscUJBQXFCLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEYsQ0FBQztJQUVELElBQUksT0FBTztRQUNULE1BQU0sSUFBSSxvQ0FBb0MsRUFBRSxDQUFDO0lBQ25ELENBQUM7SUFFRCxJQUFJLE1BQU07UUFDUixNQUFNLElBQUksb0NBQW9DLEVBQUUsQ0FBQztJQUNuRCxDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1YsTUFBTSxJQUFJLG9DQUFvQyxFQUFFLENBQUM7SUFDbkQsQ0FBQztJQUVELElBQUksUUFBUTtRQUNWLE1BQU0sSUFBSSxvQ0FBb0MsRUFBRSxDQUFDO0lBQ25ELENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN0QyxDQUFDO0NBQ0Y7QUE3QkQsc0RBNkJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge1B1bGxBcHByb3ZlR3JvdXB9IGZyb20gJy4vZ3JvdXAnO1xuaW1wb3J0IHtnZXRPckNyZWF0ZUdsb2J9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgY2xhc3MgUHVsbEFwcHJvdmVHcm91cFN0YXRlRGVwZW5kZW5jeUVycm9yIGV4dGVuZHMgRXJyb3Ige31cblxuLyoqXG4gKiBTdXBlcnNldCBvZiBhIG5hdGl2ZSBhcnJheS4gVGhlIHN1cGVyc2V0IHByb3ZpZGVzIG1ldGhvZHMgd2hpY2ggbWltaWMgdGhlXG4gKiBsaXN0IGRhdGEgc3RydWN0dXJlIHVzZWQgaW4gUHVsbEFwcHJvdmUgZm9yIGZpbGVzIGluIGNvbmRpdGlvbnMuXG4gKi9cbmV4cG9ydCBjbGFzcyBQdWxsQXBwcm92ZVN0cmluZ0FycmF5IGV4dGVuZHMgQXJyYXk8c3RyaW5nPiB7XG4gIC8qKiBSZXR1cm5zIGEgbmV3IGFycmF5IHdoaWNoIG9ubHkgaW5jbHVkZXMgZmlsZXMgdGhhdCBtYXRjaCB0aGUgZ2l2ZW4gcGF0dGVybi4gKi9cbiAgaW5jbHVkZShwYXR0ZXJuOiBzdHJpbmcpOiBQdWxsQXBwcm92ZVN0cmluZ0FycmF5IHtcbiAgICByZXR1cm4gbmV3IFB1bGxBcHByb3ZlU3RyaW5nQXJyYXkoLi4udGhpcy5maWx0ZXIoKHMpID0+IGdldE9yQ3JlYXRlR2xvYihwYXR0ZXJuKS5tYXRjaChzKSkpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgYSBuZXcgYXJyYXkgd2hpY2ggb25seSBpbmNsdWRlcyBmaWxlcyB0aGF0IGRpZCBub3QgbWF0Y2ggdGhlIGdpdmVuIHBhdHRlcm4uICovXG4gIGV4Y2x1ZGUocGF0dGVybjogc3RyaW5nKTogUHVsbEFwcHJvdmVTdHJpbmdBcnJheSB7XG4gICAgcmV0dXJuIG5ldyBQdWxsQXBwcm92ZVN0cmluZ0FycmF5KC4uLnRoaXMuZmlsdGVyKChzKSA9PiAhZ2V0T3JDcmVhdGVHbG9iKHBhdHRlcm4pLm1hdGNoKHMpKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBTdXBlcnNldCBvZiBhIG5hdGl2ZSBhcnJheS4gVGhlIHN1cGVyc2V0IHByb3ZpZGVzIG1ldGhvZHMgd2hpY2ggbWltaWMgdGhlXG4gKiBsaXN0IGRhdGEgc3RydWN0dXJlIHVzZWQgaW4gUHVsbEFwcHJvdmUgZm9yIGdyb3VwcyBpbiBjb25kaXRpb25zLlxuICovXG5leHBvcnQgY2xhc3MgUHVsbEFwcHJvdmVHcm91cEFycmF5IGV4dGVuZHMgQXJyYXk8UHVsbEFwcHJvdmVHcm91cD4ge1xuICBpbmNsdWRlKHBhdHRlcm46IHN0cmluZyk6IFB1bGxBcHByb3ZlR3JvdXBBcnJheSB7XG4gICAgcmV0dXJuIG5ldyBQdWxsQXBwcm92ZUdyb3VwQXJyYXkoLi4udGhpcy5maWx0ZXIoKHMpID0+IHMuZ3JvdXBOYW1lLm1hdGNoKHBhdHRlcm4pKSk7XG4gIH1cblxuICAvKiogUmV0dXJucyBhIG5ldyBhcnJheSB3aGljaCBvbmx5IGluY2x1ZGVzIGZpbGVzIHRoYXQgZGlkIG5vdCBtYXRjaCB0aGUgZ2l2ZW4gcGF0dGVybi4gKi9cbiAgZXhjbHVkZShwYXR0ZXJuOiBzdHJpbmcpOiBQdWxsQXBwcm92ZUdyb3VwQXJyYXkge1xuICAgIHJldHVybiBuZXcgUHVsbEFwcHJvdmVHcm91cEFycmF5KC4uLnRoaXMuZmlsdGVyKChzKSA9PiBzLmdyb3VwTmFtZS5tYXRjaChwYXR0ZXJuKSkpO1xuICB9XG5cbiAgZ2V0IHBlbmRpbmcoKSB7XG4gICAgdGhyb3cgbmV3IFB1bGxBcHByb3ZlR3JvdXBTdGF0ZURlcGVuZGVuY3lFcnJvcigpO1xuICB9XG5cbiAgZ2V0IGFjdGl2ZSgpIHtcbiAgICB0aHJvdyBuZXcgUHVsbEFwcHJvdmVHcm91cFN0YXRlRGVwZW5kZW5jeUVycm9yKCk7XG4gIH1cblxuICBnZXQgaW5hY3RpdmUoKSB7XG4gICAgdGhyb3cgbmV3IFB1bGxBcHByb3ZlR3JvdXBTdGF0ZURlcGVuZGVuY3lFcnJvcigpO1xuICB9XG5cbiAgZ2V0IHJlamVjdGVkKCkge1xuICAgIHRocm93IG5ldyBQdWxsQXBwcm92ZUdyb3VwU3RhdGVEZXBlbmRlbmN5RXJyb3IoKTtcbiAgfVxuXG4gIGdldCBuYW1lcygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoKGcpID0+IGcuZ3JvdXBOYW1lKTtcbiAgfVxufVxuIl19