import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const MAX_BUILD_SIZE = 7;

export function useBuildFromUrl() {
  const [searchParams] = useSearchParams();
  const [ids, setIds] = useState<number[]>([]);
  const [buildName, setBuildName] = useState('');

  useEffect(() => {
    const idsString = searchParams.get('ids');
    if (idsString) {
      const uniqueIds = Array.from(
        new Set(
          idsString
            .split(',')
            .map(id => parseInt(id, 10))
            .filter(Boolean),
        ),
      );
      setIds(uniqueIds.slice(0, MAX_BUILD_SIZE));
    }
  }, [searchParams]);

  useEffect(() => {
    const bd = searchParams.get('bd');
    if (bd) setBuildName(bd);
  }, [searchParams]);

  return { ids, buildName, setBuildName };
}
