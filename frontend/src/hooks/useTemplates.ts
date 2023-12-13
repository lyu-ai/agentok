import useSWR from 'swr';
import useTemplateStore from '@/store/template';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { fetcher } from './fetcher';
import { Template } from '@/store/template';

export function useTemplates() {
  const { data, error, mutate } = useSWR('/api/templates', fetcher);
  const setTemplates = useTemplateStore(state => state.setTemplates);
  const deleteTemplate = useTemplateStore(state => state.deleteTemplate);

  useEffect(() => {
    if (data) {
      setTemplates(data);
    }
  }, [data, setTemplates]);

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteTemplate = async (id: string) => {
    setIsDeleting(true);
    // Optimistically remove the template from the local state
    deleteTemplate(Number(id));
    try {
      const supabase = createClient();
      const session = await supabase.auth.getSession();
      await fetch(`/api/templates/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + session.data.session?.access_token,
        },
      });
      mutate(); // Revalidate the cache to reflect the change
    } catch (error) {
      console.error('Failed to delete the template:', error);
      // Rollback or handle the error state as necessary
      mutate();
    } finally {
      setIsDeleting(false);
    }
  };

  const [isPublishing, setIsPublishing] = useState(false);
  const publishTemplate = async (template: Template) => {
    setIsPublishing(true);
    try {
      const supabase = createClient();
      const session = await supabase.auth.getSession();
      const res = await fetch(`/api/templates`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + session.data.session?.access_token,
        },
        body: JSON.stringify(template),
      });
      if (res.ok) {
        mutate(); // Revalidate the cache to reflect the change
        return await res.json();
      }
    } catch (error) {
      console.error('Failed to publish template:', error);
      // Rollback or handle the error state as necessary
      mutate();
    } finally {
      setIsPublishing(false);
    }
  };

  return {
    templates: data,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
    deleteTemplate: handleDeleteTemplate,
    isDeleting,
    publishTemplate,
    isPublishing,
  };
}
