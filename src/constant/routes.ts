import { IconType } from 'react-icons';
import { BiSearch } from 'react-icons/bi';
import { HiHome } from 'react-icons/hi';
import { TbMusicStar, TbUserHeart, TbUsers } from 'react-icons/tb';

export interface Route {
  icon: IconType;
  label: string;
  href: string;
  pill?: string;
}

export const routes: Route[] = [
  {
    icon: HiHome,
    label: 'Home',
    href: '/',
  },
  {
    icon: BiSearch,
    label: 'Search',
    href: '/search',
  },
  {
    icon: TbUserHeart,
    label: 'Artists',
    href: '/artists',
  },
  {
    icon: TbMusicStar,
    label: 'Releases',
    href: '/releases',
  },
  {
    icon: TbUsers,
    label: 'Users',
    href: '/users',
    pill: 'New',
  },
];
