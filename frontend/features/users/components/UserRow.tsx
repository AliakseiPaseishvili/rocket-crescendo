'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/frontend/components/ui/button';

import { useBanUser, useSetUserRole, useUnbanUser } from '../hooks';

type UserActionsCellProps = {
  id: string;
  role: string;
  banned: boolean | null | undefined;
};

export const UserActionsCell = ({ id, role, banned }: UserActionsCellProps) => {
  const t = useTranslations('user');
  const { mutate: ban, isPending: isBanning } = useBanUser();
  const { mutate: unban, isPending: isUnbanning } = useUnbanUser();
  const { mutate: setRole, isPending: isSettingRole } = useSetUserRole();

  const isAdmin = role === 'admin';

  return (
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
  );
};
