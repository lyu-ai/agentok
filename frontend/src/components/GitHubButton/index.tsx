'use client';
import { FaGithub } from 'react-icons/fa6';
import { useEffect, useState } from 'react';

const GitHubButton = ({ user = 'tiwater', repo = 'flowgen' }: any) => {
  const [stars, setStars] = useState(null);

  useEffect(() => {
    const fetchStars = async () => {
      const api = `https://api.github.com/repos/${user}/${repo}`;
      try {
        const response = await fetch(api);
        const data = await response.json();
        setStars(data.stargazers_count);
      } catch (error) {
        console.error('Error fetching star count:', error);
      }
    };

    fetchStars();
  }, [user, repo]);
  return (
    <a
      className="flex items-center btn btn-sm gap-2 font-normal rounded-md hover:bg-base-content/10 text-base-content"
      target="_blank"
      href="https://github.com/tiwater/flowgen"
    >
      <FaGithub className="w-4 h-4" />
      <span className="pl-2 border-l border-base-content/60">{stars}</span>
    </a>
  );
};

export default GitHubButton;
