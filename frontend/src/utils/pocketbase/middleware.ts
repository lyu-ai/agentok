import type { NextRequest } from 'next/server';

import pb from './client';

const loadAuthFromRequestCookie = (request: NextRequest) => {
  const authValue = request.cookies.get('pb_auth')?.value;
  pb.authStore.loadFromCookie(['pb_auth', authValue].join('='));
  return pb;
};

export default loadAuthFromRequestCookie;
