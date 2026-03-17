import CandidateProfile from "../models/candidate.profile.model.js";
import calculateProfileCompletion from "../utils/calculateProfileCompletion.js";

export const createProfile = async (req, res, next) => {
    try {
        // Check if profile already exists
        const existingProfile = await candidateProfile.findOne({
            candidate: req.user._id,
        })

        if (existingProfile) {
            return res.status(400).json({
                status: "error",
                message: "Profile already exists."
            });
        }

         // Create a new profile linked to the logged in candidate
        const profile = await CandidateProfile.create({
        candidate: req.user._id,
        ...req.body,
    });

    // Calculate and save profile completion
    profile.profileCompletion = calculateProfileCompletion(profile);
    await profile.save();

    res.status(201).json({
    status: "success",
    message: "Profile created successfully",
    profileCompletion: `${profile.profileCompletion}%`,
    data: { profile },
});
    } catch (error) {
         if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((el) => el.message);
        return res.status(400).json({
        status: "error",
        message: messages.join(". "),
      });
    }
    next(error)
    }
};

// Get My Profile
export const getMyProfile = async (req, res, next) => {
    try{
        const profile = await CandidateProfile.findOne({
            candidate: req.user._id,
        }).populate("candidate", "name email");

        if (!profile) {
            return res.status(404).json({
                status: "error",
                message: "Profile not found. Please create your profile.",
            });
        }

        res.status(200).json({
             status: "success",
             data: { profile },
        });
    }  catch (error) {
        next(error);
  }
};

// Update Basic Info
export const updateBasicInfo = async (req, res, next) => {
    try {
        const profile = await CandidateProfile.findOneAndUpdate(
            { candidate: req.user._id},
            { basicInfo: req.body },
            { new: true, runValidators: true } 
        );

        if (!profile) {
             return res.status(404).json({
            status: "error",
            message: "Profile not found",
      });
        }

        profile.profileCompletion = calculateProfileCompletion(profile);
        await profile.save();

        res.status(200).json({
            status: "success",
            message: "Basic info updated successfully",
            profileCompletion: `${profile.profileCompletion}%`,
            data: { basicInfo: profile.basicInfo },
        });
    }  catch (error) {
    next(error);
  }
};

// Add Experience
export const addExperience = async (req, res, next) => {
    try {
        const profile = await CandidateProfile.findOne({ candidate: req.user._id });

        if (!profile) {
            return res.status(404).json({
                status: "error",
                message: "Profile not found",
            });
        }

         // Push new experience entry into the experience array
    profile.experience.push(req.body);
    profile.profileCompletion = calculateProfileCompletion(profile);
    await profile.save();
 
    res.status(200).json({
      status: "success",
      message: "Experience added successfully",
      profileCompletion: `${profile.profileCompletion}%`,
      data: { experience: profile.experience },
    });
  } catch (error) {
    next(error);
  }
};

// Update Experience
export const updateExperience = async (req, res, next) => {
  try {
    const profile = await CandidateProfile.findOne({ candidate: req.user._id });
 
    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found",
      });
    }
 
    // Find the specific experience entry by its _id
    const experience = profile.experience.id(req.params.experienceId);
 
    if (!experience) {
      return res.status(404).json({
        status: "error",
        message: "Experience not found",
      });
    }

    // Update the experience field
    Object.assign(experience, req.body);
    await profile.save();
 
    res.status(200).json({
      status: "success",
      message: "Experience updated successfully",
      data: { experience: profile.experience },
    });
  } catch (error) {
    next(error);
  }
};

// Delete Experience
export const deleteExperience = async (req, res, next) => {
  try {
    const profile = await CandidateProfile.findOne({ candidate: req.user._id });
 
    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found",
      });
    }
 
    // Remove the experience entry by its _id
    profile.experience.pull({ _id: req.params.experienceId });
    profile.profileCompletion = calculateProfileCompletion(profile);
    await profile.save();
 
    res.status(200).json({
      status: "success",
      message: "Experience deleted successfully",
      data: { experience: profile.experience },
    });
  } catch (error) {
    next(error);
  }
};

// Add Education
export const addEducation = async (req, res, next) => {
  try {
    const profile = await CandidateProfile.findOne({ candidate: req.user._id });
 
    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found",
      });
    }
 
    // Push new education entry into the education array
    profile.education.push(req.body);
    profile.profileCompletion = calculateProfileCompletion(profile);
    await profile.save();
 
    res.status(200).json({
      status: "success",
      message: "Education added successfully",
      profileCompletion: `${profile.profileCompletion}%`,
      data: { education: profile.education },
    });
  } catch (error) {
    next(error);
  }
};

// Update Education
export const updateEducation = async (req, res, next) => {
  try {
    const profile = await CandidateProfile.findOne({ candidate: req.user._id });
 
    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found",
      });
    }
 
    const education = profile.education.id(req.params.educationId);
 
    if (!education) {
      return res.status(404).json({
        status: "error",
        message: "Education not found",
      });
    }
 
    Object.assign(education, req.body);
    await profile.save();
 
    res.status(200).json({
      status: "success",
      message: "Education updated successfully",
      data: { education: profile.education },
    });
  } catch (error) {
    next(error);
  }
};

// Delete Education
export const deleteEducation = async (req, res, next) => {
  try {
    const profile = await CandidateProfile.findOne({ candidate: req.user._id });
 
    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found",
      });
    }
 
    profile.education.pull({ _id: req.params.educationId });
    profile.profileCompletion = calculateProfileCompletion(profile);
    await profile.save();
 
    res.status(200).json({
      status: "success",
      message: "Education deleted successfully",
      data: { education: profile.education },
    });
  } catch (error) {
    next(error);
  }
};

// Update Skills
export const updateSkills = async (req, res, next) => {
  try {
    const profile = await CandidateProfile.findOneAndUpdate(
      { candidate: req.user._id },
      { skills: req.body.skills },
      { new: true, runValidators: true }
    );
 
    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found",
      });
    }
 
    profile.profileCompletion = calculateProfileCompletion(profile);
    await profile.save();
 
    res.status(200).json({
      status: "success",
      message: "Skills updated successfully",
      profileCompletion: `${profile.profileCompletion}%`,
      data: { skills: profile.skills },
    });
  } catch (error) {
    next(error);
  }
};

// Update Resume
export const updateResume = async (req, res, next) => {
  try {
    const profile = await CandidateProfile.findOneAndUpdate(
      { candidate: req.user._id },
      { resume: req.body },
      { new: true, runValidators: true }
    );
 
    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found",
      });
    }
 
    profile.profileCompletion = calculateProfileCompletion(profile);
    await profile.save();
 
    res.status(200).json({
      status: "success",
      message: "Resume updated successfully",
      profileCompletion: `${profile.profileCompletion}%`,
      data: { resume: profile.resume },
    });
  } catch (error) {
    next(error);
  }
};

// Update Visibility
export const updateVisibility = async (req, res, next) => {
  try {
    const profile = await CandidateProfile.findOneAndUpdate(
      { candidate: req.user._id },
      { visibility: req.body },
      { new: true, runValidators: true }
    );
 
    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found",
      });
    }
 
    res.status(200).json({
      status: "success",
      message: "Visibility settings updated successfully",
      data: { visibility: profile.visibility },
    });
  } catch (error) {
    next(error);
  }
};

// Update Job Preferences
export const updateJobPreferences = async (req, res, next) => {
  try {
    const profile = await CandidateProfile.findOneAndUpdate(
      { candidate: req.user._id },
      { jobPreferences: req.body },
      { new: true, runValidators: true }
    );
 
    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found",
      });
    }
 
    profile.profileCompletion = calculateProfileCompletion(profile);
    await profile.save();
 
    res.status(200).json({
      status: "success",
      message: "Job preferences updated successfully",
      profileCompletion: `${profile.profileCompletion}%`,
      data: { jobPreferences: profile.jobPreferences },
    });
  } catch (error) {
    next(error);
  }
};