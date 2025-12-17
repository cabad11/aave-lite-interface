import { cn } from '@/utils/cn';

const Skeleton = ({ className}: { className: string | undefined }) => {
  return (
    <div className={cn(`
      size-full animate-pulse rounded bg-gray-200
      dark:bg-gray-800
    `, className)}
    />
  );
};
export default Skeleton;
