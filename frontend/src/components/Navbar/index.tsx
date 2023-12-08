import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';

import AuthButton from '../AuthButton';
import Containers from './Containers';
import Menu from './Menu';

const Navbar = () => {
  return (
    <div className="z-50 navbar flex w-full items-center justify-between px-2">
      <div className="navbar-start">
        <a href="/" className="flex gap-2 items-end">
          <Image
            width={128}
            height={32}
            alt="logo"
            src="/logo-full-white.png"
            className="h-8 object-contain aspect-w-1 aspect-h-1"
          />
        </a>
      </div>
      <div className="navbar-center gap-6">
        <Menu />
      </div>
      <div className="navbar-end">
        <a href="https://github.com/tiwater/flowgen" target="_blank">
          <FaGithub className="h-5 w-5" />
        </a>
        <AuthButton />
      </div>
      <Containers />
    </div>
  );
};

export default Navbar;
