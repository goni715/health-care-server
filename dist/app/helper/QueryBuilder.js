"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePaginationSorting = exports.makeFilterQuery = exports.makeSearchQuery = void 0;
class QueryBuilder {
    makeSearchQuery(SearchableFields, searchTerm) {
        const searchQuery = SearchableFields.map((item) => ({
            [item]: {
                contains: searchTerm,
                mode: "insensitive",
            },
        }));
        return searchQuery;
    }
    makeFilterQuery(filters) {
        const filterQuery = Object.keys(filters).map((key) => ({
            [key]: filters[key],
        }));
        return filterQuery;
    }
    calculatePaginationSorting(args) {
        const page = Number(args.page) || 1;
        const limit = Number(args.limit) || 10;
        const skip = Number(page - 1) * limit;
        const sortBy = args.sortBy || 'createdAt';
        const sortOrder = args.sortOrder || 'desc';
        return {
            page,
            limit,
            skip,
            sortBy,
            sortOrder
        };
    }
}
_a = new QueryBuilder(), exports.makeSearchQuery = _a.makeSearchQuery, exports.makeFilterQuery = _a.makeFilterQuery, exports.calculatePaginationSorting = _a.calculatePaginationSorting;
