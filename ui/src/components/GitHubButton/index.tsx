'use client';
import { FaGithub } from 'react-icons/fa6';
import { useCallback, useEffect, useState } from 'react';

const GitHubButton = ({ user = 'tiwater', repo = 'agentok' }: any) => {
  const [stars, setStars] = useState(null);
  const [fetching, setFetching] = useState(false);

  const fetchStars = useCallback(async () => {
    const api = `https://api.github.com/repos/${user}/${repo}`;
    try {
      setFetching(true);
      const response = await fetch(api);
      const data = await response.json();
      setStars(data.stargazers_count);
    } catch (error) {
      console.error('Error fetching star count:', error);
    } finally {
      setFetching(false);
    }
  }, [user, repo]);

  useEffect(() => {
    fetchStars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchStars();
  }, [user, repo, fetchStars]);

  return (
    <a
      className="flex items-center btn btn-xs btn-ghost gap-2 font-normal rounded-md "
      target="_blank"
      href="https://github.com/hughlv/agentok"
    >
      <FaGithub className="w-4 h-4" />
      <span className="pl-2 border-l border-base-content/60">
        {fetching ? (
          <div className="loading loading-xs loading-infinity" />
        ) : (
          stars
        )}
      </span>
    </a>
  );
};

export default GitHubButton;
