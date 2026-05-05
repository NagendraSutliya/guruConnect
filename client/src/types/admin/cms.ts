export interface HeroData {
  title: string;
  subtitle: string;
  button1: string;
  button2: string;
  announcement: string;
  backgroundImage: string;
}

export interface AchievementData {
  bannerTitle: string;
  bannerSubtitle: string;
  stats: Array<{ label: string; value: string; sub: string }>;
  toppers: Array<{ name: string; score: string; class: string; rank: string }>;
  awards: Array<{ award: string; body: string }>;
  bannerImage: string;
}

export interface AboutData {
  bannerTitle: string;
  bannerSubtitle: string;
  establishedYear: string;
  mainTitle: string;
  mainSubtitle: string;
  description: string;
  stats: Array<{ label: string; value: string }>;
  directorMessage: {
    name: string;
    designation: string;
    quote: string;
  };
  bannerImage: string;
  directorImage: string;
}

export interface AcademicsData {
  bannerTitle: string;
  bannerSubtitle: string;
  pedagogyTitle: string;
  pedagogySubtitle: string;
  phases: Array<{ phase: string; title: string; years: string; desc: string; color: string }>;
  infrastructureTitle: string;
  infrastructureDesc: string;
  infrastructureItems: Array<{ title: string; desc: string; icon: string }>;
  departments: Array<{ name: string; icon: string }>;
  bannerImage?: string;
  labImage?: string;
}

export interface AdmissionsData {
  bannerTitle: string;
  bannerSubtitle: string;
  processTitle: string;
  steps: Array<{ step: string; title: string; desc: string }>;
  eligibilityTitle: string;
  eligibilityDesc: string;
  matrix: Array<{ grade: string; age: string }>;
  documents: string[];
  bannerImage?: string;
}

export interface ContactData {
  bannerTitle: string;
  bannerSubtitle: string;
  bannerImage: string;
  addressTitle: string;
  addressDetail: string;
  phoneTitle: string;
  phoneDetail: string;
  emailTitle: string;
  emailDetail: string;
  hoursTitle: string;
  hoursDetail: string;
  mapEmbedUrl: string;
}

export interface GalleryData {
  bannerTitle: string;
  bannerSubtitle: string;
  items: Array<{ title: string; category: string; img: string }>;
}
