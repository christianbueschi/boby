import { useCollections } from '../context/CollectionsContext';
import { PiExportLight } from 'react-icons/pi';
import { Button } from '@/components/ui/button';

export const Footer: React.FC = () => {
  const { exportCollections, importCollections } = useCollections();

  return (
    <div className="flex items-center bg-gray-900 w-full gap-12 p-4">
      <div className="flex items-center gap-2">
        <img
          src="/favicon.png"
          alt="Boby"
          className="w-8 h-8 rounded-md"
        />
        <span className="text-gray-100">Boby - the better Toby</span>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={exportCollections} size="xs" variant="ghost">
          <PiExportLight />
          Export Collections
        </Button>
        <Button onClick={importCollections} size="xs" variant="ghost">
          Import Collections
        </Button>
      </div>
    </div>
  );
};
