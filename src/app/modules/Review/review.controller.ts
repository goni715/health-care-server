import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { ReviewFields, ReviewSearchableFields } from "./review.constant";
import { createReviewService, getAllReviewsService } from "./review.service";

const createReview = catchAsync(async (req, res) => {
  const { email } = req.headers;
  const result = await createReviewService(email as string, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});


const getAllReviews = catchAsync(async (req, res) => {
  const validatedQuery = pickValidFields(req.query, ReviewFields)
  const result = await getAllReviewsService(validatedQuery);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reviews are retrieved successfully",
    meta: result.meta,
    data: result.data
  })
})





export const ReviewController = {
    createReview,
    getAllReviews
}
