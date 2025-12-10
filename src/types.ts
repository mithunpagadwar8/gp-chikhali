
export interface BlogPost {
  id: string;
  title: string;
  category: string;
  content: string; // HTML or Text
  thumbnail: string; // Base64 or URL
  images: string[]; // Array of Base64 or URLs
  videoUrl?: string; // Uploaded video (Base64/Link)
  youtubeUrl?: string; // Embedded link
  tags: string[];
  status: 'draft' | 'published';
  date: string;
  author: string;
}

export interface Notice {
  id: string;
  text: string;
  date: string;
  isNew: boolean;
  image?: string; // Added image for notices
}

export interface Scheme {
  id: string;
  title: string;
  description: string;
  beneficiaries: string;
  link?: string;
}

export interface Official {
  id: string;
  role: string;
  name: string;
  photo: string;
  phone: string;
  address?: string;
  category: 'committee' | 'staff';
}

export interface Project {
  id: string;
  title: string;
  status: 'Completed' | 'Ongoing' | 'Planned';
  image: string;
}

export interface Contractor {
  id: string;
  name: string;
  applicationDate: string;
}

export interface Tender {
  id: string;
  title: string;
  refNumber: string;
  closingDate: string;
  downloadLink: string;
  applicants: Contractor[]; // Added applicants list
}

export interface Meeting {
  id: string;
  title: string;
  type: 'Gram Sabha' | 'Masik Sabha' | 'Ward Sabha' | 'Bal Sabha';
  date: string;
  description: string;
  file?: string;
  photos: string[]; // Added photos array
}

export interface TaxRecord {
  id: string;
  houseNo: string;
  ownerName: string;
  address: string;
  mobile: string;
  houseTax: number;
  waterTax: number;
  dueDate: string;
  status: 'Paid' | 'Pending';
}

export interface Service {
  id: string;
  name: string;
  description: string;
  requirements: string; // Documents needed
  fees: string;
}

export interface ContactDetails {
  address: string;
  phone: string;
  email: string;
  mapUrl: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export interface AppData {
  logo: string;
  contact: ContactDetails;
  sliderImages: string[];
  posts: BlogPost[];
  notices: Notice[];
  schemes: Scheme[];
  officials: Official[];
  projects: Project[];
  tenders: Tender[];
  meetings: Meeting[];
  taxes: TaxRecord[];
  gallery: string[];
  services: Service[];
  firebaseConfig?: FirebaseConfig; // Added for Google Auth
}

export const CATEGORIES = ['Development', 'Health', 'Education', 'Agriculture', 'General'];
