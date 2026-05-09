'use client';

import { useTranslations } from 'next-intl';

import { Badge } from '@/frontend/components/ui/badge';
import { Button } from '@/frontend/components/ui/button';

import { useBanUser, useSetUserRole, useUnbanUser } from '../hooks';

type UserRowProps = {
  id: string;
  username: string | undefined;
  email: string;
  role: string;
  banned: boolean | null | undefined;
};

export const UserRow = ({ id, username, email, role, banned }: UserRowProps) => {
  const t = useTranslations('user');
  const { mutate: ban, isPending: isBanning } = useBanUser();
  const { mutate: unban, isPending: isUnbanning } = useUnbanUser();
  const { mutate: setRole, isPending: isSettingRole } = useSetUserRole();

  const isAdmin = role === 'admin';

  return (
    <tr className="border-b last:border-0">
      <td className="py-3 pr-4">
        <div className="font-medium">{username ? `@${username}` : email}</div>
        <div className="text-sm text-muted-foreground">{email}</div>
      </td>
      <td className="py-3 pr-4">
        <Badge variant={isAdmin ? 'default' : 'secondary'}>
          {isAdmin ? t('roleAdmin') : t('roleUser')}
        </Badge>
      </td>
      <td className="py-3 pr-4">
        <Badge variant={banned ? 'destructive' : 'outline'}>
          {banned ? t('banned') : t('active')}
        </Badge>
      </td>
      <td className="py-3">
        <div className="flex items-center gap-2 justify-end">
          <Button
            size="sm"
            variant="outline"
            disabled={isSettingRole}
            onClick={() => setRole({ userId: id, role: isAdmin ? 'user' : 'admin' })}
          >
            {isAdmin ? t('removeAdmin') : t('makeAdmin')}
          </Button>
          <Button
            size="sm"
            variant={banned ? 'outline' : 'destructive'}
            disabled={isBanning || isUnbanning}
            onClick={() => (banned ? unban(id) : ban(id))}
          >
            {banned ? t('unban') : t('ban')}
          </Button>
        </div>
      </td>
    </tr>
  );
};
