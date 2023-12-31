import 'server-only';
import { cookies } from 'next/headers';
import PocketBase from 'pocketbase';

interface OptionType {
  refresh: boolean;
  pb: PocketBase;
}

const parseCookie = (str: string) =>
  Object.fromEntries(
    str.split('; ').map(v => v.split(/=(.*)/s).map(decodeURIComponent))
  );

const setAuthCookie = (pb: PocketBase) => {
  const authCookie = parseCookie(
    pb.authStore.exportToCookie({ httpOnly: false })
  );
  cookies().set('pb_auth', authCookie.pb_auth, {
    httpOnly: false, // This is important!!!
    path: '/',
    expires: new Date(authCookie.Expires),
  });
};

const loadAuthFromCookie = async (options?: Partial<OptionType>) => {
  const refresh = options?.refresh ?? false;
  const pb =
    options?.pb ?? new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  const cookieStore = cookies();
  const cookieObj = cookieStore.get('pb_auth');
  if (cookieObj) {
    // load the store data from the request cookie string
    pb.authStore.loadFromCookie([cookieObj.name, cookieObj.value].join('='));
    if (refresh) {
      pb.authStore.onChange(() => {
        setAuthCookie(pb);
      });
    }
  } else {
    // If there is no user info in the cookie, we need to reset current user's info!
    // Otherwise, it will mess up with other user!!
    pb.authStore.clear();
  }

  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
    refresh &&
      pb.authStore.isValid &&
      (await pb.collection('users').authRefresh());
  } catch (_) {
    // clear the auth store on failed refresh
    pb.authStore.clear();
  }

  return pb;
};

export default loadAuthFromCookie;
