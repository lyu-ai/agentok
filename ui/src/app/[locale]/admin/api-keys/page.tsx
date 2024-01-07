'use client';

import CopyButton from '@/components/CopyButton';
import DeleteButton from '@/components/DeleteButton';
import PopupDialog from '@/components/PopupDialog';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { GoEye, GoEyeClosed, GoPencil, GoTrash } from 'react-icons/go';
import { toast } from 'react-toastify';

const ApiKeyText = ({ apikey }: { apikey: string }) => {
  const [isShowing, setIsShowing] = useState(false);
  const [text, setText] = useState('');
  const t = useTranslations('page.Admin.ApiKeys');
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
        className={clsx(
          'mr-2 break-all px-4 py-2 rounded-xl bg-base-100 cursor-pointer'
        )}
        onClick={() => setIsShowing(!isShowing)}
        data-tooltip-id="default-tooltip"
        data-tooltip-content={t('show-apikey')}
      >
        {text}
      </span>
      <button
        className="btn btn-sm btn-ghost btn-square"
        onClick={() => setIsShowing(!isShowing)}
        data-tooltip-id="default-tooltip"
        data-tooltip-content={t('show-apikey')}
      >
        {isShowing ? (
          <GoEyeClosed className="w-4 h-4 text-yellow-600" />
        ) : (
          <GoEye className="w-4 h-4 text-green-600" />
        )}
      </button>
      <CopyButton content={apikey} tooltip="Copy" />
    </div>
  );
};

const CreateKeyDialog = ({ show, onClose }: any) => {
  const [name, setName] = useState('Default Name');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const t = useTranslations('page.Admin.ApiKeys');
  const onSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    fetch('/api/api-keys', {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(resp => resp.json())
      .then(json => {
        console.log('keys', json);
        onClose(true);
      })
      .catch(e => {
        console.error(e);
        setError(e.message);
      })
      .finally(() => setLoading(false));
  };
  return (
    <PopupDialog
      title={t('create-apikey')}
      show={show}
      onClose={onClose}
      className="w-full max-w-md  bg-gray-800/80 backgrop-blur-md border border-gray-700 shadow-box-lg shadow-gray-700"
      classNameTitle="border-b border-base-content/10 p-3 py-4"
      classNameBody="flex flex-grow h-full w-full overflow-y-auto p-3"
    >
      <form
        className="flex flex-col gap-3 w-full"
        onSubmit={onSubmit}
        data-tooltip-id="default-tooltip"
        data-tooltip-content={error}
      >
        <label htmlFor="name">{t('name')}</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="input input-primary input-bordered"
        />
        <button
          type="submit"
          className={clsx('btn btn-primary', {
            'btn-disabled btn-outline': loading || !name,
          })}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="loading loading-sm" />
              {t('creating-apikey')}
            </div>
          ) : (
            t('create-apikey')
          )}
        </button>
      </form>
    </PopupDialog>
  );
};

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [keys, setKeys] = useState<any[]>([]);
  const [showCreateKeyDialog, setShowCreateKeyDialog] = useState(false);
  const t = useTranslations('page.Admin.ApiKeys');
  const fetchKeys = () => {
    setLoading(true);
    fetch('/api/api-keys', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(resp => resp.json())
      .then(json => {
        console.log('keys', json);
        setKeys(json);
      })
      .catch(e => {
        console.error(e);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => fetchKeys, []);

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
        toast.success(t('delete-apikey-success', { key_name: key.name }));
        setKeys(keys.filter(k => k.id !== key.id));
      })
      .catch(e => {
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
      <title>API Keys | FlowGen</title>
      <div className="flex flex-col w-full gap-3 rounded-lg bg-base-content/5 p-4">
        <div className="flex items-center justify-between w-full gap-2 py-2">
          <h2 className="text-2xl font-bold">API Keys</h2>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateKeyDialog(true)}
          >
            {t('create-apikey')}
          </button>
        </div>
        <table className="table border-transparent rounded-lg bg-base-content/20">
          <thead>
            <tr className="flex w-full font-bold">
              <td className="w-12 lg:w-32">{t('name')}</td>
              <td className="flex flex-grow lg:min-w-80">{t('key')}</td>
              <td className="w-40 hidden lg:flex">{t('created')}</td>
              <td className="items-center justify-center gap-2 w-28 hidden lg:flex">
                {t('actions')}
              </td>
            </tr>
          </thead>
          <tbody className="gap-2">
            {keys.map(key => {
              console.log('key', key);
              return (
                <tr key={key.id} className="flex items-center w-full py-2">
                  <td className="w-12 lg:w-32">{key.name || '(No name)'}</td>
                  <td className="flex flex-grow lg:min-w-80">
                    <ApiKeyText apikey={key.key} />
                  </td>
                  <td className="w-40 hidden lg:flex">
                    {new Date(key.created).toLocaleString()}
                  </td>
                  <td className="items-center justify-center gap-2 w-28 hidden lg:flex">
                    <DeleteButton
                      tooltip={t('delete-apikey')}
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
