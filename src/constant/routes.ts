import { IconType } from 'react-icons';
import {
  TbHome,
  TbMusicStar,
  TbSearch,
  TbUserHeart,
  TbUsers,
} from 'react-icons/tb';

export interface Route {
  icon: IconType;
  label: string;
  href: string;
  pill?: string;
}

export const routes: Route[] = [
  {
    icon: TbHome,
    label: 'Home',
    href: '/',
  },
  {
    icon: TbSearch,
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
