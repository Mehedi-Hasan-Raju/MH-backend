import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Education } from "../models/educationSchema.js";
import ErrorHandelar from "../middleware/error.js";

export const postEducation = catchAsyncError(async (req, res, next) => {
  const { degree, institute, grade, from, to } = req.body;
  const newEducation = await Education.create({
    degree,
    institute,
    grade,
    duration: { from, to },
  });
  res.status(200).json({
    success: true,
    message: "Education Added",
    newEducation,
  });
});

export const deleteEducation = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const education = await Education.findById(id);
  if (!education) {
    return next(new ErrorHandelar("Education not found", 404));
  }
  await education.deleteOne();
  res.status(200).json({
    success: true,
    message: "Education Deleted",
  });
});

export const getAllEducations = catchAsyncError(async (req, res, next) => {
  const educations = await Education.find();
  res.status(200).json({
    success: true,
    educations,
  });
});