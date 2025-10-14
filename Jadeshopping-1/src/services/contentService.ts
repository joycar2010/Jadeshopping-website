import { supabase } from '@/lib/supabase';

export interface ContentPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentSection {
  id: string;
  page_id: string;
  section_type: 'hero' | 'text' | 'image' | 'video' | 'contact_form' | 'faq' | 'team' | 'features';
  title?: string;
  content?: string;
  image_url?: string;
  video_url?: string;
  order_index: number;
  is_visible: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class ContentService {
  // 获取页面内容
  async getPageBySlug(slug: string): Promise<ServiceResponse<ContentPage & { sections: ContentSection[] }>> {
    try {
      const { data: page, error: pageError } = await supabase
        .from('content_pages')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (pageError) {
        console.error('Error fetching page:', pageError);
        return { success: false, error: pageError.message };
      }

      // 获取页面的所有sections
      const { data: sections, error: sectionsError } = await supabase
        .from('content_sections')
        .select('*')
        .eq('page_id', page.id)
        .eq('is_visible', true)
        .order('order_index', { ascending: true });

      if (sectionsError) {
        console.error('Error fetching sections:', sectionsError);
        return { success: false, error: sectionsError.message };
      }

      return {
        success: true,
        data: {
          ...page,
          sections: sections || []
        }
      };
    } catch (error) {
      console.error('ContentService.getPageBySlug error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 获取所有已发布的页面
  async getPublishedPages(): Promise<ServiceResponse<ContentPage[]>> {
    try {
      const { data, error } = await supabase
        .from('content_pages')
        .select('id, slug, title, meta_title, meta_description, created_at, updated_at')
        .eq('is_published', true)
        .order('title', { ascending: true });

      if (error) {
        console.error('Error fetching published pages:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('ContentService.getPublishedPages error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 创建页面
  async createPage(pageData: Omit<ContentPage, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceResponse<ContentPage>> {
    try {
      const { data, error } = await supabase
        .from('content_pages')
        .insert({
          ...pageData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating page:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('ContentService.createPage error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 更新页面
  async updatePage(id: string, pageData: Partial<Omit<ContentPage, 'id' | 'created_at' | 'updated_at'>>): Promise<ServiceResponse<ContentPage>> {
    try {
      const { data, error } = await supabase
        .from('content_pages')
        .update({
          ...pageData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating page:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('ContentService.updatePage error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 删除页面
  async deletePage(id: string): Promise<ServiceResponse<boolean>> {
    try {
      // 先删除相关的sections
      await supabase
        .from('content_sections')
        .delete()
        .eq('page_id', id);

      // 删除页面
      const { error } = await supabase
        .from('content_pages')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting page:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: true };
    } catch (error) {
      console.error('ContentService.deletePage error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 创建内容区块
  async createSection(sectionData: Omit<ContentSection, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceResponse<ContentSection>> {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .insert({
          ...sectionData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating section:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('ContentService.createSection error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 更新内容区块
  async updateSection(id: string, sectionData: Partial<Omit<ContentSection, 'id' | 'created_at' | 'updated_at'>>): Promise<ServiceResponse<ContentSection>> {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .update({
          ...sectionData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating section:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('ContentService.updateSection error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 删除内容区块
  async deleteSection(id: string): Promise<ServiceResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('content_sections')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting section:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: true };
    } catch (error) {
      console.error('ContentService.deleteSection error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 更新区块顺序
  async updateSectionOrder(pageId: string, sectionOrders: Array<{ id: string; order_index: number }>): Promise<ServiceResponse<boolean>> {
    try {
      for (const { id, order_index } of sectionOrders) {
        const { error } = await supabase
          .from('content_sections')
          .update({ 
            order_index,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .eq('page_id', pageId);

        if (error) {
          console.error('Error updating section order:', error);
          return { success: false, error: error.message };
        }
      }

      return { success: true, data: true };
    } catch (error) {
      console.error('ContentService.updateSectionOrder error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 获取联系信息（特殊处理）
  async getContactInfo(): Promise<ServiceResponse<{
    email: string;
    phone: string;
    address: string;
    business_hours: string;
    social_links: Record<string, string>;
  }>> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['contact_email', 'contact_phone', 'contact_address', 'business_hours', 'social_links']);

      if (error) {
        console.error('Error fetching contact info:', error);
        return { success: false, error: error.message };
      }

      const contactInfo = {
        email: '',
        phone: '',
        address: '',
        business_hours: '',
        social_links: {}
      };

      data?.forEach(setting => {
        switch (setting.key) {
          case 'contact_email':
            contactInfo.email = setting.value;
            break;
          case 'contact_phone':
            contactInfo.phone = setting.value;
            break;
          case 'contact_address':
            contactInfo.address = setting.value;
            break;
          case 'business_hours':
            contactInfo.business_hours = setting.value;
            break;
          case 'social_links':
            contactInfo.social_links = JSON.parse(setting.value || '{}');
            break;
        }
      });

      return { success: true, data: contactInfo };
    } catch (error) {
      console.error('ContentService.getContactInfo error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 获取FAQ列表
  async getFAQs(): Promise<ServiceResponse<Array<{ question: string; answer: string; category?: string }>>> {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching FAQs:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('ContentService.getFAQs error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 提交联系表单
  async submitContactForm(formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<ServiceResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          ...formData,
          status: 'new',
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error submitting contact form:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: true };
    } catch (error) {
      console.error('ContentService.submitContactForm error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 获取默认内容（用于fallback）
  getDefaultContent(slug: string): ContentPage & { sections: ContentSection[] } {
    const defaultContents: Record<string, ContentPage & { sections: ContentSection[] }> = {
      about: {
        id: 'default-about',
        slug: 'about',
        title: 'About Us',
        content: 'Learn more about our company and mission.',
        meta_title: 'About Us - JadeShopping',
        meta_description: 'Learn about JadeShopping\'s mission, values, and commitment to quality.',
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sections: [
          {
            id: 'about-hero',
            page_id: 'default-about',
            section_type: 'hero',
            title: 'About JadeShopping',
            content: 'We are committed to providing the best shopping experience with quality products and exceptional service.',
            order_index: 1,
            is_visible: true,
            metadata: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'about-story',
            page_id: 'default-about',
            section_type: 'text',
            title: 'Our Story',
            content: 'Founded with a passion for quality and customer satisfaction, JadeShopping has grown to become a trusted name in online retail. We carefully curate our products to ensure they meet our high standards.',
            order_index: 2,
            is_visible: true,
            metadata: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      },
      contact: {
        id: 'default-contact',
        slug: 'contact',
        title: 'Contact Us',
        content: 'Get in touch with our team.',
        meta_title: 'Contact Us - JadeShopping',
        meta_description: 'Contact JadeShopping for support, questions, or feedback.',
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sections: [
          {
            id: 'contact-hero',
            page_id: 'default-contact',
            section_type: 'hero',
            title: 'Contact Us',
            content: 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
            order_index: 1,
            is_visible: true,
            metadata: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'contact-form',
            page_id: 'default-contact',
            section_type: 'contact_form',
            title: 'Send us a message',
            order_index: 2,
            is_visible: true,
            metadata: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      },
      help: {
        id: 'default-help',
        slug: 'help',
        title: 'Help Center',
        content: 'Find answers to common questions.',
        meta_title: 'Help Center - JadeShopping',
        meta_description: 'Find help and support for your JadeShopping experience.',
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sections: [
          {
            id: 'help-hero',
            page_id: 'default-help',
            section_type: 'hero',
            title: 'Help Center',
            content: 'Find answers to frequently asked questions and get the help you need.',
            order_index: 1,
            is_visible: true,
            metadata: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'help-faq',
            page_id: 'default-help',
            section_type: 'faq',
            title: 'Frequently Asked Questions',
            order_index: 2,
            is_visible: true,
            metadata: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      }
    };

    return defaultContents[slug] || defaultContents.about;
  }
}