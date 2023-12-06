'use client';

import { useEffect, useState } from 'react';
import Chat from '../../components/Chat';

const Page = ({ params: { id } }: any) => {
  const [data, setData] = useState<any>({});
  useEffect(() => {
    fetch(`/api/flows/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(resp => resp.json())
      .then(json => {
        setData(json);
        console.log(json);
      });
  }, [id]);
  return (
    <div
      className="flex w-full h-full items-center justify-center bg-no-repeat bg-center bg-[url('/logo-bg.svg')]"
      style={{ backgroundSize: '160px' }}
    >
      <div className="m-1 flex w-full shadow-box shadow-gray-600 rounded-xl backdrop-blur-md bg-gray-700/80 text-base-content border border-gray-600 max-w-[1200px] h-[90vh]">
        <Chat data={{ id, flow: data }} standalone />
      </div>
    </div>
  );
};

export default Page;
