// import { catchAsyncError } from "../middleware/catchAsyncError.js";
// import ErrorHandelar from "../middleware/error.js";
// import { Project } from "../models/projectSchema.js";
// import { v2 as cloudinary } from "cloudinary";

// export const addNewProject = catchAsyncError(async (req, res, next) => {
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return next(new ErrorHandelar("Project Banner Image Required!", 404));
//   }
//   const { projectBanner } = req.files;
//   const {
//     title,
//     description,
//     gitRepoLink,
//     projectLink,
//     stack,
//     technologies,
//     deployed,
//   } = req.body;
//   if (
//     !title ||
//     !description ||
//     !gitRepoLink ||
//     !projectLink ||
//     !stack ||
//     !technologies ||
//     !deployed
//   ) {
//     return next(new ErrorHandelar("Please Provide All Details!", 400));
//   }
//   const cloudinaryResponse = await cloudinary.uploader.upload(
//     projectBanner.tempFilePath,
//     { folder: "PORTFOLIO PROJECT IMAGES" }
//   );
//   if (!cloudinaryResponse || cloudinaryResponse.error) {
//     console.error(
//       "Cloudinary Error:",
//       cloudinaryResponse.error || "Unknown Cloudinary error"
//     );
//     return next(new ErrorHandelar("Failed to upload avatar to Cloudinary", 500));
//   }
//   const project = await Project.create({
//     title,
//     description,
//     gitRepoLink,
//     projectLink,
//     stack,
//     technologies,
//     deployed,
//     projectBanner: {
//       public_id: cloudinaryResponse.public_id, // Set your cloudinary public_id here
//       url: cloudinaryResponse.secure_url, // Set your cloudinary secure_url here
//     },
//   });
//   res.status(201).json({
//     success: true,
//     message: "New Project Added!",
//     project,
//   });
// });

// export const updateProject = catchAsyncError(async (req, res, next) => {
//   const newProjectData = {
//     title: req.body.title,
//     description: req.body.description,
//     stack: req.body.stack,
//     technologies: req.body.technologies,
//     deployed: req.body.deployed,
//     projectLink: req.body.projectLink,
//     gitRepoLink: req.body.gitRepoLink,
//   };
//   if (req.files && req.files.projectBanner) {
//     const projectBanner = req.files.projectBanner;
//     const project = await Project.findById(req.params.id);
//     const projectImageId = project.projectBanner.public_id;
//     await cloudinary.uploader.destroy(projectImageId);
//     const newProjectImage = await cloudinary.uploader.upload(
//       projectBanner.tempFilePath,
//       {
//         folder: "PORTFOLIO PROJECT IMAGES",
//       }
//     );
//     newProjectData.projectBanner = {
//       public_id: newProjectImage.public_id,
//       url: newProjectImage.secure_url,
//     };
//   }
//   const project = await Project.findByIdAndUpdate(
//     req.params.id,
//     newProjectData,
//     {
//       new: true,
//       runValidators: true,
//       useFindAndModify: false,
//     }
//   );
//   res.status(200).json({
//     success: true,
//     message: "Project Updated!",
//     project,
//   });
// });

// export const deleteProject = catchAsyncError(async (req, res, next) => {
//   const { id } = req.params;
//   const project = await Project.findById(id);
//   if (!project) {
//     return next(new ErrorHandelar("Already Deleted!", 404));
//   }
//   const projectImageId = project.projectBanner.public_id;
//   await cloudinary.uploader.destroy(projectImageId);
//   await project.deleteOne();
//   res.status(200).json({
//     success: true,
//     message: "Project Deleted!",
//   });
// });

// export const getAllProjects = catchAsyncError(async (req, res, next) => {
//   const projects = await Project.find();
//   res.status(200).json({
//     success: true,
//     projects,
//   });
// });

// export const getSingleProject = catchAsyncError(async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     const project = await Project.findById(id);
//     res.status(200).json({
//       success: true,
//       project,
//     });
//   } catch (error) {
//     res.status(400).json({
//       error,
//     });
//   }
// });

import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandelar from "../middleware/error.js";
import { Project } from "../models/projectSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const addNewProject = catchAsyncError(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandelar("Project Images Required!", 404));
  }
  const { projectImages } = req.files;
  if (!projectImages) {
    return next(new ErrorHandelar("Project Images Required!", 404));
  }

  // Normalize to array (express-fileupload gives a single object if only 1 file, array if multiple)
  const filesArray = Array.isArray(projectImages)
    ? projectImages
    : [projectImages];

  // Limit to a maximum of 5 images
  const limitedFiles = filesArray.slice(0, 5);

  const {
    title,
    description,
    gitRepoLink,
    projectLink,
    stack,
    technologies,
    deployed,
  } = req.body;
  if (
    !title ||
    !description ||
    !gitRepoLink ||
    !projectLink ||
    !stack ||
    !technologies ||
    !deployed
  ) {
    return next(new ErrorHandelar("Please Provide All Details!", 400));
  }

  const uploadedImages = [];
  for (const file of limitedFiles) {
    const cloudinaryResponse = await cloudinary.uploader.upload(
      file.tempFilePath,
      { folder: "PORTFOLIO PROJECT IMAGES" }
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary error"
      );
      return next(
        new ErrorHandelar("Failed to upload project image to Cloudinary", 500)
      );
    }
    uploadedImages.push({
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    });
  }

  const project = await Project.create({
    title,
    description,
    gitRepoLink,
    projectLink,
    stack,
    technologies,
    deployed,
    projectImages: uploadedImages,
    // Keep projectBanner filled with the first image for backward compatibility
    projectBanner: uploadedImages[0],
  });
  res.status(201).json({
    success: true,
    message: "New Project Added!",
    project,
  });
});

export const updateProject = catchAsyncError(async (req, res, next) => {
  const newProjectData = {
    title: req.body.title,
    description: req.body.description,
    stack: req.body.stack,
    technologies: req.body.technologies,
    deployed: req.body.deployed,
    projectLink: req.body.projectLink,
    gitRepoLink: req.body.gitRepoLink,
  };

  if (req.files && req.files.projectImages) {
    const filesArray = Array.isArray(req.files.projectImages)
      ? req.files.projectImages
      : [req.files.projectImages];
    const limitedFiles = filesArray.slice(0, 5);

    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(new ErrorHandelar("Project Not Found!", 404));
    }
    // Delete old images from Cloudinary
    if (project.projectImages && project.projectImages.length > 0) {
      for (const img of project.projectImages) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    } else if (project.projectBanner && project.projectBanner.public_id) {
      await cloudinary.uploader.destroy(project.projectBanner.public_id);
    }

    // Upload new images
    const uploadedImages = [];
    for (const file of limitedFiles) {
      const newProjectImage = await cloudinary.uploader.upload(
        file.tempFilePath,
        { folder: "PORTFOLIO PROJECT IMAGES" }
      );
      uploadedImages.push({
        public_id: newProjectImage.public_id,
        url: newProjectImage.secure_url,
      });
    }

    newProjectData.projectImages = uploadedImages;
    newProjectData.projectBanner = uploadedImages[0];
  }

  const project = await Project.findByIdAndUpdate(
    req.params.id,
    newProjectData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
    message: "Project Updated!",
    project,
  });
});

export const deleteProject = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    return next(new ErrorHandelar("Already Deleted!", 404));
  }

  if (project.projectImages && project.projectImages.length > 0) {
    for (const img of project.projectImages) {
      await cloudinary.uploader.destroy(img.public_id);
    }
  } else if (project.projectBanner && project.projectBanner.public_id) {
    await cloudinary.uploader.destroy(project.projectBanner.public_id);
  }

  await project.deleteOne();
  res.status(200).json({
    success: true,
    message: "Project Deleted!",
  });
});

export const getAllProjects = catchAsyncError(async (req, res, next) => {
  const projects = await Project.find();
  res.status(200).json({
    success: true,
    projects,
  });
});

export const getSingleProject = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id);
    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
});