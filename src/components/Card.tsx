import { cn } from '@/lib/utils';

type CardProps = {
  favicon?: string;
  title: string;
  small?: boolean;
};

export const Card: React.FC<CardProps> = ({ favicon, title, small }) => {
  return (
    <div
      className={cn(
        'flex flex-col items-start justify-center bg-gray-700 rounded-xl',
        small ? 'h-[40px] p-2' : 'h-[80px] p-4'
      )}
    >
      <div className={cn('flex items-center', small ? 'gap-2' : 'gap-4')}>
        {favicon && (
          <img
            src={favicon}
            alt={title}
            className={cn(small ? 'w-4 h-4' : 'w-6 h-6')}
          />
        )}
        <h4
          className={cn(
            'text-sm font-bold text-gray-100',
            small ? 'line-clamp-1' : 'line-clamp-2'
          )}
        >
          {title}
        </h4>
      </div>
    </div>
  );
};
