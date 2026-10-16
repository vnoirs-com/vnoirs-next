import initialJobs from "./jobs-data.json";

export const JOBS = initialJobs;

export function getJobs({ onlyActive = true } = {}) {
  if (onlyActive) {
    return JOBS.filter((j) => (j.status || "active") === "active");
  }
  return JOBS;
}

export function getJobById(id) {
  return JOBS.find((j) => j.id === id) || null;
}
