import { PopupDialog } from '@/components/popup-dialog';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useProject, useTemplates } from '@/hooks';
import { Loading } from '@/components/loader';
import { toast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

export const ProjectPublish = ({ projectId, show, onClose }: any) => {
  const { project, isLoading } = useProject(projectId);
  const { publishTemplate, isPublishing } = useTemplates();
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description ?? '');
    }
  }, [project]);

  if (isLoading || !project) {
    return <Loading />;
  }

  const onPublishProject = async () => {
    await publishTemplate({
      name,
      description,
      project,
    })
      .then((template) => {
        toast({
          title: 'Publish success',
          description: `Publish success, ${project.name}`,
        });
        router.push(`/discover/${template.id}`);
      })
      .catch(() => {
        toast({
          title: 'Publish failed',
          description: `Publish failed, ${project.name}`,
        });
      });
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icons.share className="w-5 h-5" />
            Publish
          </DialogTitle>
          <DialogDescription>
            Publish your project to the world
          </DialogDescription>
        </DialogHeader>
        <span className="font-bold whitespace-nowrap">Project name</span>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
        <span className="font-bold whitespace-nowrap">Project description</span>
        <Textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <DialogFooter>
          <Button onClick={onPublishProject}>
            {isPublishing && <Icons.spinner className="w-4 h-4 animate-spin" />}
            Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
