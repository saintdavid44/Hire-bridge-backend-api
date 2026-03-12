import Job from "../models/job.model.js";

export const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      data: job
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};