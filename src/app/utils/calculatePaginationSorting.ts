
type TPagination = {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
}

type TPaginationResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
}

const calculatePaginationSorting = (args: TPagination) : TPaginationResult => {
    const page: number = Number(args.page) || 1;
    const limit: number = Number(args.limit) || 10;
    const skip: number = Number(page-1)*limit;

    const sortBy: string = args.sortBy || 'createdAt';
    const sortOrder: string = args.sortOrder || 'desc';

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    }
}

export default calculatePaginationSorting