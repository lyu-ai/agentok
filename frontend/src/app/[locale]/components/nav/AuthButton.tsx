'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Database } from '@/utils/supabase/database.types';
import { useEffect, useState } from 'react';

const AuthButton = () => {
  const [user, setUser] = useState<any>(null);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  useEffect(() => {
    supabase.auth.getUser().then(res => {
      setUser(res.data.user);
    });
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.replace('/login');
  };

  return user ? (
    <div className="ml-4 flex items-center gap-4">
      Hey, {user.email}!
      <button className="btn btn-sm btn-outline" onClick={signOut}>
        Logout
      </button>
    </div>
  ) : (
    <Link href="/login" className="ml-4 btn btn-sm btn-primary btn-outline">
      Login
    </Link>
  );
};

export default AuthButton;
