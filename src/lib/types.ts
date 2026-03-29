export interface Site {
  id: number;
  name: string;
  description: string;
  longDescription: string;
  governorate: string;
  period: string;
  type: string;
  status: "preserved" | "endangered" | "under-restoration" | "digitized";
  has3DModel: boolean;
  images: number;
  documents: number;
  coordinates: { lat: number; lng: number };
  gallery: string[];
}

export interface ArchiveItem {
  id: number;
  title: string;
  description: string;
  category: "manuscripts" | "photos" | "maps" | "documents";
  period: string;
  date: string;
  format: string;
  size: string;
  thumbnail: string;
  tags: string[];
}

export interface Project {
  id: number;
  name: string;
  description: string;
  status: "completed" | "ongoing" | "planned";
  progress: number;
  startDate: string;
  endDate: string;
  budget: string;
  team: string;
}

export interface CultureItem {
  id: number;
  name: string;
  description: string;
  category: "crafts" | "music" | "food" | "events";
  icon: string;
  count: number;
  countLabel: string;
}

export interface EducationResource {
  id: number;
  name: string;
  description: string;
  category: "materials" | "theses" | "researchers" | "labs";
  icon: string;
  count: number;
  countLabel: string;
}

export interface Initiative {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
}

export interface GovernorateMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  sitesCount: number;
}

export interface Labels {
  periods: Record<string, string>;
  types: Record<string, string>;
  statuses: Record<string, string>;
  governorates: Record<string, string>;
  categories: Record<string, string>;
  projectStatuses: Record<string, string>;
}
