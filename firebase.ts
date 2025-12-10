// Storage layer for Gram Panchayat Chikhali Portal
// Using PostgreSQL database with Drizzle ORM

import {
  adminUsers, type AdminUser, type InsertAdminUser,
  blogPosts, type BlogPost, type InsertBlogPost,
  notices, type Notice, type InsertNotice,
  schemes, type Scheme, type InsertScheme,
  services, type Service, type InsertService,
  projects, type Project, type InsertProject,
  gallery, type Gallery, type InsertGallery,
  meetings, type Meeting, type InsertMeeting,
  officials, type Official, type InsertOfficial,
  taxes, type Tax, type InsertTax,
  tenders, type Tender, type InsertTender,
  siteSettings, type SiteSettings, type InsertSiteSettings,
  users, type User, type InsertUser,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, or } from "drizzle-orm";

export interface IStorage {
  // Admin Users
  getAdminUser(id: string): Promise<AdminUser | undefined>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  updateAdminUser(id: string, user: Partial<InsertAdminUser>): Promise<AdminUser | undefined>;

  // Blog Posts
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;

  // Notices
  getAllNotices(): Promise<Notice[]>;
  getNotice(id: string): Promise<Notice | undefined>;
  createNotice(notice: InsertNotice): Promise<Notice>;
  updateNotice(id: string, notice: Partial<InsertNotice>): Promise<Notice | undefined>;
  deleteNotice(id: string): Promise<boolean>;

  // Schemes
  getAllSchemes(): Promise<Scheme[]>;
  getScheme(id: string): Promise<Scheme | undefined>;
  createScheme(scheme: InsertScheme): Promise<Scheme>;
  updateScheme(id: string, scheme: Partial<InsertScheme>): Promise<Scheme | undefined>;
  deleteScheme(id: string): Promise<boolean>;

  // Services
  getAllServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;

  // Projects
  getAllProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Gallery
  getAllGallery(): Promise<Gallery[]>;
  getGalleryItem(id: string): Promise<Gallery | undefined>;
  createGalleryItem(item: InsertGallery): Promise<Gallery>;
  deleteGalleryItem(id: string): Promise<boolean>;

  // Meetings
  getAllMeetings(): Promise<Meeting[]>;
  getMeeting(id: string): Promise<Meeting | undefined>;
  createMeeting(meeting: InsertMeeting): Promise<Meeting>;
  updateMeeting(id: string, meeting: Partial<InsertMeeting>): Promise<Meeting | undefined>;
  deleteMeeting(id: string): Promise<boolean>;

  // Officials
  getAllOfficials(): Promise<Official[]>;
  getOfficial(id: string): Promise<Official | undefined>;
  createOfficial(official: InsertOfficial): Promise<Official>;
  updateOfficial(id: string, official: Partial<InsertOfficial>): Promise<Official | undefined>;
  deleteOfficial(id: string): Promise<boolean>;

  // Taxes
  getAllTaxes(): Promise<Tax[]>;
  getTax(id: string): Promise<Tax | undefined>;
  searchTaxes(query: string): Promise<Tax[]>;
  createTax(tax: InsertTax): Promise<Tax>;
  updateTax(id: string, tax: Partial<InsertTax>): Promise<Tax | undefined>;
  deleteTax(id: string): Promise<boolean>;

  // Tenders
  getAllTenders(): Promise<Tender[]>;
  getTender(id: string): Promise<Tender | undefined>;
  createTender(tender: InsertTender): Promise<Tender>;
  updateTender(id: string, tender: Partial<InsertTender>): Promise<Tender | undefined>;
  deleteTender(id: string): Promise<boolean>;

  // Site Settings
  getSiteSettings(): Promise<SiteSettings | undefined>;
  updateSiteSettings(settings: Partial<InsertSiteSettings>): Promise<SiteSettings>;

  // Legacy User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  // Admin Users
  async getAdminUser(id: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user || undefined;
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user || undefined;
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const [created] = await db.insert(adminUsers).values(user).returning();
    return created;
  }

  async updateAdminUser(id: string, user: Partial<InsertAdminUser>): Promise<AdminUser | undefined> {
    const [updated] = await db.update(adminUsers).set(user).where(eq(adminUsers.id, id)).returning();
    return updated || undefined;
  }

  // Blog Posts
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts).orderBy(desc(blogPosts.date));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [created] = await db.insert(blogPosts).values(post).returning();
    return created;
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updated] = await db.update(blogPosts).set(post).where(eq(blogPosts.id, id)).returning();
    return updated || undefined;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
    return result.length > 0;
  }

  // Notices
  async getAllNotices(): Promise<Notice[]> {
    return db.select().from(notices).orderBy(desc(notices.date));
  }

  async getNotice(id: string): Promise<Notice | undefined> {
    const [notice] = await db.select().from(notices).where(eq(notices.id, id));
    return notice || undefined;
  }

  async createNotice(notice: InsertNotice): Promise<Notice> {
    const [created] = await db.insert(notices).values(notice).returning();
    return created;
  }

  async updateNotice(id: string, notice: Partial<InsertNotice>): Promise<Notice | undefined> {
    const [updated] = await db.update(notices).set(notice).where(eq(notices.id, id)).returning();
    return updated || undefined;
  }

  async deleteNotice(id: string): Promise<boolean> {
    const result = await db.delete(notices).where(eq(notices.id, id)).returning();
    return result.length > 0;
  }

  // Schemes
  async getAllSchemes(): Promise<Scheme[]> {
    return db.select().from(schemes);
  }

  async getScheme(id: string): Promise<Scheme | undefined> {
    const [scheme] = await db.select().from(schemes).where(eq(schemes.id, id));
    return scheme || undefined;
  }

  async createScheme(scheme: InsertScheme): Promise<Scheme> {
    const [created] = await db.insert(schemes).values(scheme).returning();
    return created;
  }

  async updateScheme(id: string, scheme: Partial<InsertScheme>): Promise<Scheme | undefined> {
    const [updated] = await db.update(schemes).set(scheme).where(eq(schemes.id, id)).returning();
    return updated || undefined;
  }

  async deleteScheme(id: string): Promise<boolean> {
    const result = await db.delete(schemes).where(eq(schemes.id, id)).returning();
    return result.length > 0;
  }

  // Services
  async getAllServices(): Promise<Service[]> {
    return db.select().from(services);
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }

  async createService(service: InsertService): Promise<Service> {
    const [created] = await db.insert(services).values(service).returning();
    return created;
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined> {
    const [updated] = await db.update(services).set(service).where(eq(services.id, id)).returning();
    return updated || undefined;
  }

  async deleteService(id: string): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id)).returning();
    return result.length > 0;
  }

  // Projects
  async getAllProjects(): Promise<Project[]> {
    return db.select().from(projects);
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [created] = await db.insert(projects).values(project).returning();
    return created;
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    const [updated] = await db.update(projects).set(project).where(eq(projects.id, id)).returning();
    return updated || undefined;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id)).returning();
    return result.length > 0;
  }

  // Gallery
  async getAllGallery(): Promise<Gallery[]> {
    return db.select().from(gallery);
  }

  async getGalleryItem(id: string): Promise<Gallery | undefined> {
    const [item] = await db.select().from(gallery).where(eq(gallery.id, id));
    return item || undefined;
  }

  async createGalleryItem(item: InsertGallery): Promise<Gallery> {
    const [created] = await db.insert(gallery).values(item).returning();
    return created;
  }

  async deleteGalleryItem(id: string): Promise<boolean> {
    const result = await db.delete(gallery).where(eq(gallery.id, id)).returning();
    return result.length > 0;
  }

  // Meetings
  async getAllMeetings(): Promise<Meeting[]> {
    return db.select().from(meetings).orderBy(desc(meetings.date));
  }

  async getMeeting(id: string): Promise<Meeting | undefined> {
    const [meeting] = await db.select().from(meetings).where(eq(meetings.id, id));
    return meeting || undefined;
  }

  async createMeeting(meeting: InsertMeeting): Promise<Meeting> {
    const [created] = await db.insert(meetings).values(meeting).returning();
    return created;
  }

  async updateMeeting(id: string, meeting: Partial<InsertMeeting>): Promise<Meeting | undefined> {
    const [updated] = await db.update(meetings).set(meeting).where(eq(meetings.id, id)).returning();
    return updated || undefined;
  }

  async deleteMeeting(id: string): Promise<boolean> {
    const result = await db.delete(meetings).where(eq(meetings.id, id)).returning();
    return result.length > 0;
  }

  // Officials
  async getAllOfficials(): Promise<Official[]> {
    return db.select().from(officials);
  }

  async getOfficial(id: string): Promise<Official | undefined> {
    const [official] = await db.select().from(officials).where(eq(officials.id, id));
    return official || undefined;
  }

  async createOfficial(official: InsertOfficial): Promise<Official> {
    const [created] = await db.insert(officials).values(official).returning();
    return created;
  }

  async updateOfficial(id: string, official: Partial<InsertOfficial>): Promise<Official | undefined> {
    const [updated] = await db.update(officials).set(official).where(eq(officials.id, id)).returning();
    return updated || undefined;
  }

  async deleteOfficial(id: string): Promise<boolean> {
    const result = await db.delete(officials).where(eq(officials.id, id)).returning();
    return result.length > 0;
  }

  // Taxes
  async getAllTaxes(): Promise<Tax[]> {
    return db.select().from(taxes);
  }

  async getTax(id: string): Promise<Tax | undefined> {
    const [tax] = await db.select().from(taxes).where(eq(taxes.id, id));
    return tax || undefined;
  }

  async searchTaxes(query: string): Promise<Tax[]> {
    return db.select().from(taxes).where(
      or(
        like(taxes.ownerName, `%${query}%`),
        like(taxes.houseNo, `%${query}%`)
      )
    );
  }

  async createTax(tax: InsertTax): Promise<Tax> {
    const [created] = await db.insert(taxes).values(tax).returning();
    return created;
  }

  async updateTax(id: string, tax: Partial<InsertTax>): Promise<Tax | undefined> {
    const [updated] = await db.update(taxes).set(tax).where(eq(taxes.id, id)).returning();
    return updated || undefined;
  }

  async deleteTax(id: string): Promise<boolean> {
    const result = await db.delete(taxes).where(eq(taxes.id, id)).returning();
    return result.length > 0;
  }

  // Tenders
  async getAllTenders(): Promise<Tender[]> {
    return db.select().from(tenders).orderBy(desc(tenders.closingDate));
  }

  async getTender(id: string): Promise<Tender | undefined> {
    const [tender] = await db.select().from(tenders).where(eq(tenders.id, id));
    return tender || undefined;
  }

  async createTender(tender: InsertTender): Promise<Tender> {
    const [created] = await db.insert(tenders).values(tender).returning();
    return created;
  }

  async updateTender(id: string, tender: Partial<InsertTender>): Promise<Tender | undefined> {
    const [updated] = await db.update(tenders).set(tender).where(eq(tenders.id, id)).returning();
    return updated || undefined;
  }

  async deleteTender(id: string): Promise<boolean> {
    const result = await db.delete(tenders).where(eq(tenders.id, id)).returning();
    return result.length > 0;
  }

  // Site Settings
  async getSiteSettings(): Promise<SiteSettings | undefined> {
    const [settings] = await db.select().from(siteSettings);
    return settings || undefined;
  }

  async updateSiteSettings(settings: Partial<InsertSiteSettings>): Promise<SiteSettings> {
    const existing = await this.getSiteSettings();
    if (existing) {
      const [updated] = await db.update(siteSettings).set(settings).where(eq(siteSettings.id, existing.id)).returning();
      return updated;
    } else {
      const [created] = await db.insert(siteSettings).values(settings as InsertSiteSettings).returning();
      return created;
    }
  }

  // Legacy User methods (for compatibility)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
