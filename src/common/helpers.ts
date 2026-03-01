import type { User } from '../users/entities/user.entity';
import type { Wish } from '../wishes/entities/wish.entity';
import { QueryFailedError } from 'typeorm';

export function toPublicProfile(user: User) {
  return {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    username: user.username,
    about: user.about,
    avatar: user.avatar,
  };
}

export function toUserProfile(user: User) {
  return {
    ...toPublicProfile(user),
    email: user.email,
  };
}

export function sanitizeWish(wish: Wish) {
  const { owner, offers, wishlists: _wl, ...wishData } = wish;
  void _wl;
  return {
    ...wishData,
    owner: owner ? toPublicProfile(owner) : undefined,
    offers: offers?.map((o) => {
      const { user, item: _item, ...offerData } = o;
      void _item;
      return {
        ...offerData,
        user: user ? toPublicProfile(user) : undefined,
      };
    }),
  };
}

export function isUniqueViolation(err: unknown): boolean {
  return (
    err instanceof QueryFailedError &&
    (err.driverError as { code?: string })?.code === '23505'
  );
}
