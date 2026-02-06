import type {
  RouteResponse,
  AnalysisResponse,
  UserResponse,
  Job as ApiJob,
  Background as ApiBackground,
} from "./types";
import type { Job, Background, CompanySize, SuccessRoute, RouteStep } from "@/lib/data";

// Convert API Job to Frontend Job
export function convertJobFromApi(job: ApiJob): Job {
  return job === "FRONTEND" ? "frontend" : "backend";
}

// Convert Frontend Job to API Job
export function convertJobToApi(job: Job): ApiJob {
  return job === "frontend" ? "FRONTEND" : "BACKEND";
}

// Convert API Background to Frontend Background
export function convertBackgroundFromApi(background: ApiBackground): Background {
  return background === "MAJOR" ? "major" : "non_major";
}

// Convert Frontend Background to API Background
export function convertBackgroundToApi(background: Background): ApiBackground {
  return background === "major" ? "MAJOR" : "NON_MAJOR";
}

// Convert API RouteResponse to Frontend SuccessRoute
export function convertRouteFromApi(
  route: RouteResponse,
  analysis?: AnalysisResponse
): SuccessRoute {
  const routeSteps: RouteStep[] = route.routeSteps.map((step) => ({
    step: step.title,
    duration: step.duration || undefined,
    description: step.description || undefined,
    tip: step.tips || undefined,
    detail: undefined,
  }));

  // Map finalCompanySize to CompanySize
  const companySizeMap: Record<string, CompanySize> = {
    startup: "startup",
    sme: "sme",
    midsize: "midsize",
    enterprise: "enterprise",
  };

  return {
    id: route.id.toString(),
    job: convertJobFromApi(route.job),
    background: convertBackgroundFromApi(route.background),
    companySize: companySizeMap[route.finalCompanySize.toLowerCase()] || "startup",
    skills: route.skills || [],
    route: routeSteps,
    matchScore: analysis?.similarity,
    aiReason: analysis?.reason,
  };
}
