'use client';

import { CopyButton } from '@/components/copy-button';
import { DeleteButton } from '@/components/delete-button';
import { Icons } from '@/components/icons';
import { PopupDialog } from '@/components/popup-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

const ApiKeyText = ({ apikey }: { apikey: string }) => {
  const [isShowing, setIsShowing] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    if (isShowing) {
      setText(apikey);
    } else {
      setText(
        apikey.slice(0, 6) + '*'.repeat(apikey.length - 10) + apikey.slice(-4)
      );
    }
  }, [apikey, isShowing]);
  return (
    <div className="flex items-center gap-1">
      <span
        className={cn(
          'mr-2 break-all px-4 py-2 rounded-xl bg-base-100 cursor-pointer'
        )}
        onClick={() => setIsShowing(!isShowing)}
      >
        {text}
      </span>
      <Button
        className="btn btn-sm btn-ghost btn-square"
        onClick={() => setIsShowing(!isShowing)}
      >
        {isShowing ? (
          <Icons.eyeOff className="w-4 h-4 text-yellow-600" />
        ) : (
          <Icons.eye className="w-4 h-4 text-green-600" />
        )}
      </Button>
      <CopyButton content={apikey} />
    </div>
  );
};

const CreateKeyDialog = ({ show, onClose }: any) => {
  const [name, setName] = useState('Default Name');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    fetch('/api/api-keys', {
      method: 'POST',
      body: JSON.stringify({ name, key: '<to_be_generated>' }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((resp) => resp.json())
      .then((json) => {
        onClose(true);
      })
      .catch((e) => {
        console.error(e);
        setError(e.message);
      })
      .finally(() => setLoading(false));
  };
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogTrigger>
        <Button>Create API Key</Button>
      </DialogTrigger>
      <DialogTitle>Create API Key</DialogTitle>
      <DialogDescription>
        Create a new API key to use in your projects.
      </DialogDescription>
      <DialogContent>
        <form className="flex flex-col gap-3 w-full" onSubmit={onSubmit}>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-primary input-bordered"
          />
          <Button
            type="submit"
            className={clsx('btn btn-primary', {
              'btn-disabled btn-outline': loading || !name,
            })}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="loading loading-sm" />
                Creating API Key...
              </div>
            ) : (
              'Create API Key'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [keys, setKeys] = useState<any[]>([]);
  const [showCreateKeyDialog, setShowCreateKeyDialog] = useState(false);

  const fetchKeys = async () => {
    setLoading(true);
    await fetch('/api/api-keys', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((resp) => resp.json())
      .then((json) => {
        if (json.error) {
          toast({
            title: 'Error',
            description: json.error,
            variant: 'destructive',
          });
          throw new Error(json.error);
        }
        setKeys(json);
      })
      .catch((e) => {
        console.error(JSON.stringify(e));
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchKeys();
  }, []);

  const onCloseCreateKeyDialog = (refresh: boolean) => {
    setShowCreateKeyDialog(false);
    if (refresh) fetchKeys();
  };

  const onDeleteKey = async (key: any) => {
    await fetch(`/api/api-keys/${key.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(() => {
        toast({
          title: 'Delete API Key',
          description: `Successfully deleted API key "${key.name}"`,
        });
        setKeys(keys.filter((k) => k.id !== key.id));
      })
      .catch((e) => {
        console.error(e);
      });
  };

  if (loading) {
    return (
      <div className="relative flex flex-col w-full h-full items-center justify-center gap-2">
        <div className="loading text-primary loading-infinity"></div>
      </div>
    );
  }

  return (
    <>
      <title>API Keys | Agentok Studio</title>
      <div className="flex flex-col w-full gap-3 ">
        <div className="flex items-center justify-between w-full gap-2 py-2">
          <h2 className="text-2xl font-bold">API Keys</h2>
          <CreateKeyDialog
            show={showCreateKeyDialog}
            onClose={onCloseCreateKeyDialog}
          />
        </div>
        <table className="table border-transparent rounded-lg bg-base-content/20">
          <thead>
            <tr className="flex w-full font-bold">
              <td className="w-12 lg:w-32">Name</td>
              <td className="flex flex-grow lg:min-w-80">Key</td>
              <td className="w-40 hidden lg:flex">Created</td>
              <td className="items-center justify-center gap-2 w-28 hidden lg:flex">
                Actions
              </td>
            </tr>
          </thead>
          <tbody className="gap-2">
            {keys.map((key) => {
              return (
                <tr key={key.id} className="flex items-center w-full py-2">
                  <td className="w-12 lg:w-32">{key.name || '(No name)'}</td>
                  <td className="flex flex-grow lg:min-w-80">
                    <ApiKeyText apikey={key.key} />
                  </td>
                  <td className="hidden lg:flex">
                    {new Date(key.created_at).toLocaleString()}
                  </td>
                  <td className="items-center justify-center gap-2 w-28 hidden lg:flex">
                    <DeleteButton
                      tooltip="Delete API Key"
                      onDelete={() => onDeleteKey(key)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <CreateKeyDialog
          show={showCreateKeyDialog}
          onClose={onCloseCreateKeyDialog}
        />
      </div>
    </>
  );
};

export default Page;
