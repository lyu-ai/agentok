import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { GoImage } from 'react-icons/go';
import { MdOutlineCleaningServices } from 'react-icons/md';

// ... rest of the component code
{
  url ? (
    <div className="h-full aspect-w-1 aspect-h-1 overflow-hidden">
      <img src={url} alt="image" className="object-cover w-full h-full" />
      <Button
        variant="default"
        size="sm"
        className="absolute top-1 right-1"
        onClick={() => setUrl('')}
      >
        <MdOutlineCleaningServices className="w-4 h-4" />
      </Button>
    </div>
  ) : (
            // ... rest of the JSX
          )
}
        </div >
  <div className="absolute inset-x-0 bottom-1">
    <Input
      type="text"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      className="h-8 text-sm"
      placeholder={t('image-url-placeholder')}
    />
  </div> 