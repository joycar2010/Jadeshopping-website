import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ContentService, type ContentPage } from '@/services/contentService';

interface ContentPageWrapperProps {
  pageKey: string;
  defaultTitle: string;
  defaultDescription: string;
  children: (contentPage: ContentPage | null, loading: boolean) => React.ReactNode;
}

const ContentPageWrapper: React.FC<ContentPageWrapperProps> = ({
  pageKey,
  defaultTitle,
  defaultDescription,
  children
}) => {
  const [contentPage, setContentPage] = useState<ContentPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const page = await ContentService.getContentPageByKey(pageKey);
        setContentPage(page);
      } catch (error) {
        console.error(`Failed to fetch ${pageKey} page content:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [pageKey]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jade-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{contentPage?.meta_title || defaultTitle}</title>
        <meta name="description" content={contentPage?.meta_description || defaultDescription} />
      </Helmet>
      {children(contentPage, loading)}
    </>
  );
};

export default ContentPageWrapper;