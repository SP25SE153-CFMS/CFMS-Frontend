import { getResourceById } from '@/services/resource.service';
import { useQuery } from '@tanstack/react-query';

type ResoureCardProps = {
    resourceId: string;
};

export default function ResourceCard({ resourceId }: ResoureCardProps) {
    const { data: resource } = useQuery({
        queryKey: ['resource', resourceId],
        queryFn: () => getResourceById(resourceId),
    });
    return (
        <>
            <></>
        </>
    );
}
