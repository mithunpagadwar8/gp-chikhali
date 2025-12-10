import { AppData, BlogPost, Notice, Scheme, Official, Project, Tender, Meeting, TaxRecord, Service } from '../types';

const STORAGE_KEY = 'gp_chikhali_data';
const AUTH_KEY = 'gp_chikhali_auth';
const CREDENTIALS_KEY = 'gp_chikhali_creds';
const PUBLIC_USER_KEY = 'gp_chikhali_public_user';

// Initial Seed Data
const INITIAL_DATA: AppData = {
  logo: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg',
  contact: {
    address: 'Gram Panchayat Chikhali, Taluka Haveli, District Pune, Maharashtra - 411062',
    phone: '+91 20 1234 5678',
    email: 'contact@gpchikhali.in',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.273673756286!2d73.8099!3d18.6517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b84576326d97%3A0x6338081604179374!2sChikhali%2C%20Pimpri-Chinchwad%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1633000000000!5m2!1sen!2sin'
  },
  sliderImages: [
    'https://picsum.photos/seed/village/1600/900',
    'https://picsum.photos/seed/farm/1600/900',
    'https://picsum.photos/seed/school/1600/900'
  ],
  services: [
    { id: '1', name: 'Birth Certificate', description: 'Issuance of birth certificate for children born within village limits.', requirements: 'Hospital Discharge Card, Parents ID Proof', fees: '₹20' },
    { id: '2', name: 'Death Certificate', description: 'Registration and issuance of death certificate.', requirements: 'Doctor Certificate, Aadhaar of deceased', fees: '₹10' },
    { id: '3', name: 'Marriage Registration', description: 'Legal registration of marriage.', requirements: 'Wedding Invitation, Photos, Witnesses', fees: '₹100' },
    { id: '4', name: 'Construction Permission', description: 'NOC for new house construction.', requirements: 'Land 7/12 extract, Plan map', fees: 'As per sq.ft' },
  ],
  posts: [
    {
      id: '1',
      title: 'New Water Tank Construction Started',
      category: 'Development',
      content: 'We are pleased to announce that the construction of the new overhead water tank with a capacity of 50,000 liters has commenced in Ward No. 3. This project aims to solve the water scarcity issue during summer.',
      thumbnail: 'https://picsum.photos/seed/water/800/600',
      images: ['https://picsum.photos/seed/const1/800/600'],
      tags: ['Water', 'Infrastructure'],
      status: 'published',
      date: '2023-10-15',
      author: 'Admin'
    },
    {
      id: '2',
      title: 'Gram Sabha Meeting scheduled for next Monday',
      category: 'General',
      content: 'All villagers are requested to attend the Gram Sabha meeting scheduled on 20th Oct at the Panchayat Hall. Topics: Road repairs and Solar street lights.',
      thumbnail: 'https://picsum.photos/seed/meeting/800/600',
      images: [],
      tags: ['Meeting', 'Governance'],
      status: 'published',
      date: '2023-10-18',
      author: 'Sarpanch'
    },
    {
      id: '3',
      title: 'Health Camp Success Story',
      category: 'Health',
      content: 'Over 500 villagers benefited from the free eye checkup camp organized by the Panchayat in collaboration with the District Hospital.',
      thumbnail: 'https://picsum.photos/seed/health/800/600',
      images: [],
      youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
      tags: ['Health', 'Community'],
      status: 'published',
      date: '2023-10-05',
      author: 'Admin'
    }
  ],
  notices: [
    { id: '1', text: 'Property Tax payment deadline extended to 31st March.', date: '2023-10-20', isNew: true },
    { id: '2', text: 'Plastic ban enforcement drive starts next week.', date: '2023-10-18', isNew: true },
    { id: '3', text: 'Apply for PM Awas Yojana before 15th Nov.', date: '2023-10-15', isNew: false },
  ],
  schemes: [
    { id: '1', title: 'Pradhan Mantri Awas Yojana', description: 'Housing for all by 2024.', beneficiaries: 'BPL Families', link: 'https://pmaymis.gov.in/' },
    { id: '2', title: 'Swachh Bharat Mission', description: 'Construction of toilets and waste management.', beneficiaries: 'All Households', link: 'https://swachhbharatmission.gov.in/' },
    { id: '3', title: 'Jal Jeevan Mission', description: 'Tap water connection to every household.', beneficiaries: 'Rural Homes', link: 'https://jaljeevanmission.gov.in/' },
  ],
  officials: [
    { id: '1', category: 'committee', role: 'Sarpanch', name: 'Shri. Rajesh Kumar', photo: 'https://picsum.photos/seed/sarpanch/200/200', phone: '+91 98765 43210', address: 'Ward 1, Chikhali' },
    { id: '2', category: 'committee', role: 'Up-Sarpanch', name: 'Smt. Sunita Devi', photo: 'https://picsum.photos/seed/upsarpanch/200/200', phone: '+91 98765 00000', address: 'Ward 2, Chikhali' },
    { id: '3', category: 'committee', role: 'Tantamukt Adhyaksh', name: 'Mr. Vilas Patil', photo: 'https://picsum.photos/seed/tanta/200/200', phone: '+91 98765 11111', address: 'Main Road, Chikhali' },
    { id: '4', category: 'committee', role: 'Police Patil', name: 'Mr. Ashok Deshmukh', photo: 'https://picsum.photos/seed/police/200/200', phone: '+91 98765 22222', address: 'Chikhali Gaon' },
    { id: '5', category: 'staff', role: 'Gram Sevak', name: 'Smt. Anita Patil', photo: 'https://picsum.photos/seed/gramsevak/200/200', phone: '+91 98765 12345', address: 'Panchayat Office' },
    { id: '6', category: 'staff', role: 'Clerk', name: 'Mr. Suresh Deshmukh', photo: 'https://picsum.photos/seed/clerk/200/200', phone: '+91 98765 67890', address: 'Panchayat Office' },
  ],
  projects: [
    { id: '1', title: 'Main Road Concretization', status: 'Ongoing', image: 'https://picsum.photos/seed/road/400/300' },
    { id: '2', title: 'Community Hall Renovation', status: 'Completed', image: 'https://picsum.photos/seed/hall/400/300' },
    { id: '3', title: 'Solar Street Lights', status: 'Planned', image: 'https://picsum.photos/seed/solar/400/300' },
  ],
  tenders: [
    { 
      id: '1', 
      title: 'Construction of Drainage Line Ward 4', 
      refNumber: 'GP/2023/01', 
      closingDate: '2023-11-01', 
      downloadLink: '#',
      applicants: [
        { id: '101', name: 'Ramesh Infrastructure Pvt Ltd', applicationDate: '2023-10-10' },
        { id: '102', name: 'Patil Constructions', applicationDate: '2023-10-12' }
      ]
    },
    { 
      id: '2', 
      title: 'Supply of Office Stationery', 
      refNumber: 'GP/2023/02', 
      closingDate: '2023-10-25', 
      downloadLink: '#',
      applicants: []
    },
  ],
  meetings: [
    { id: '1', title: 'Diwali Gram Sabha', type: 'Gram Sabha', date: '2023-10-20', description: 'General discussion on village hygiene.', photos: [] }
  ],
  taxes: [],
  gallery: [
    'https://picsum.photos/seed/g1/800/600',
    'https://picsum.photos/seed/g2/800/600',
    'https://picsum.photos/seed/g3/800/600'
  ],
  firebaseConfig: {
    apiKey: "AIzaSyDrq3HQJS7tTmxGnnnPP7eXW_D8EBbgtsE",
    authDomain: "grampanchayatchikhali-853fe.firebaseapp.com",
    projectId: "grampanchayatchikhali-853fe",
    storageBucket: "grampanchayatchikhali-853fe.firebasestorage.app",
    messagingSenderId: "36658942460",
    appId: "1:36658942460:web:305a97df8580c94519a279",
    measurementId: "G-6ZLCQF6WGC"
  }
};

export const getStoredData = (): AppData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      
      // Ensure firebase config from INITIAL_DATA is used if missing or user requests hardcoded values
      const firebaseConfig = (parsed.firebaseConfig && parsed.firebaseConfig.apiKey) 
          ? parsed.firebaseConfig 
          : INITIAL_DATA.firebaseConfig;

      return { 
          ...INITIAL_DATA, 
          ...parsed,
          taxes: parsed.taxes || [],
          gallery: parsed.gallery || INITIAL_DATA.gallery,
          projects: parsed.projects || INITIAL_DATA.projects,
          services: parsed.services || INITIAL_DATA.services,
          contact: parsed.contact || INITIAL_DATA.contact,
          firebaseConfig: firebaseConfig
      }; 
    }
  } catch (e) {
    console.error("Failed to load data", e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
  return INITIAL_DATA;
};

export const saveStoredData = (data: AppData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    alert("Storage Full! Cannot save data.");
    console.error("Storage Limit Exceeded", e);
  }
};

// Admin Authentication
export const isAuthenticated = (): boolean => {
  return sessionStorage.getItem(AUTH_KEY) === 'true';
};

export const login = (user: string, pass: string): boolean => {
  let creds = JSON.parse(localStorage.getItem(CREDENTIALS_KEY) || '{"u":"admin","p":"admin123"}');
  if (user === creds.u && pass === creds.p) {
    sessionStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  return false;
};

export const updateCredentials = (newUser: string, newPass: string) => {
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify({ u: newUser, p: newPass }));
};

export const logout = () => {
  sessionStorage.removeItem(AUTH_KEY);
};

// Public User Authentication
export const getPublicUser = () => {
    const u = sessionStorage.getItem(PUBLIC_USER_KEY);
    return u ? JSON.parse(u) : null;
};

export const setPublicUser = (user: any) => {
    sessionStorage.setItem(PUBLIC_USER_KEY, JSON.stringify(user));
};

export const removePublicUser = () => {
    sessionStorage.removeItem(PUBLIC_USER_KEY);
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
