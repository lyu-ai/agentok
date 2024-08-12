'use client';
import Loading from '@/components/Loading';
import { useUser } from '@/hooks';

const AccountPage = () => {
  const { user, loading } = useUser();

  if (loading || !user) return <Loading />;

  return (
    <div className="w-full p-2">
      <h1 className="text-xl font-bold mb-4">Account</h1>
      <div className="flex flex-col gap-6 border rounded-lg p-6 w-full border-base-content/20 bg-gradient-to-r from-transparent to-base-content/20">
        <div className="avatar">
          <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img
              src={user.user_metadata?.avatar_url ?? '/logo-spaced.png'}
              alt="User avatar"
            />
          </div>
        </div>
        <div className="flex-grow">
          <div className="mb-4">
            <span className="font-bold">Name:</span>{' '}
            {user.user_metadata?.full_name ??
              user.email?.match(/^([^@]+)/)?.[1] ??
              '(No Name)'}
          </div>
          <div className="mb-4">
            <span className="font-bold">Email:</span> {user.email}
          </div>
          <div>
            <span className="font-bold">Since:</span>{' '}
            {new Date(user.created_at).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
