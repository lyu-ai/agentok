'use client';
import { useEffect, useState } from 'react';
import supabase from '@/utils/supabase/client'; // Adjust the import path as necessary
import Loading from '@/components/Loading';
import { User } from '@supabase/supabase-js';

const AccountPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      await supabase.auth.getUser().then(resp => {
        const user = resp.data?.user;
        setUser(user);
      }).catch(err => {
        setError(err.message);
      }).finally(() => {
        setLoading(false);
      });
    };

    fetchUserData();
  }, []);

  if (loading || !user) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full p-2">
      <h1 className="text-xl font-bold mb-4">Account</h1>
      <div className="flex flex-col gap-6 border rounded-lg p-6 w-full border-base-content/20 bg-gradient-to-r from-transparent to-base-content/20">
        <div className="avatar">
          <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img src={avatar} alt="User avatar" />
          </div>
        </div>
        <div className="flex-grow">
          <div className="mb-4">
            <span className="font-bold">Name:</span> {user.email}
          </div>
          <div className="mb-4">
            <span className="font-bold">Email:</span> {user.email}
          </div>
          <div>
            <span className="font-bold">Created:</span>{' '}
            {new Date(user.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
