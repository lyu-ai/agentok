'use client';

import React, { useEffect, useState } from 'react';
import { Icons } from '@/components/icons';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSettings } from '@/hooks';

interface Template {
  id: string;
  name: string;
  description: string;
  data: any;
}

interface TemplateListProps {
  show: boolean;
  onClose: () => void;
  onSelect: (template: Template) => void;
}

export const TemplateList = ({ show, onClose, onSelect }: TemplateListProps) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    if (show) {
      loadTemplates();
    }
  }, [show]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Template</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Icons.spinner className="w-6 h-6 animate-spin" />
            </div>
          ) : templates.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 p-8 text-base-content/60">
              <Icons.inbox className="w-12 h-12" />
              <div className="text-sm">No templates available</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  className="flex flex-col gap-2 p-4 text-left border rounded-lg hover:border-primary/40 hover:bg-base-content/5"
                  onClick={() => onSelect(template)}
                >
                  <div className="font-bold">{template.name}</div>
                  <div className="text-sm text-base-content/60">
                    {template.description}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
