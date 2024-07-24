'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { BiSolidMoon, BiSolidSun } from 'react-icons/bi';

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSetTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (!mounted) return null;

  return (
    <div className='text-dark dark:text-light'>
      {/* The current theme is: {theme} */}
      <button className='block p-1 rounded-full' onClick={handleSetTheme}>
        {theme === 'light' ? (
          <BiSolidMoon className='w-5 h-5' />
        ) : (
          <BiSolidSun className='w-5 h-5' />
        )}
      </button>
    </div>
  );
}
