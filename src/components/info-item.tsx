import { cn } from '@/lib/utils';

export default function InfoItem({
    label,
    value,
    icon,
    className,
}: {
    label: string;
    value: React.ReactNode;
    icon: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('flex items-center gap-3 text-sm mb-4 group', className)}>
            <div className="text-muted-foreground transition-colors group-hover:text-primary">
                {icon}
            </div>
            <span className="text-muted-foreground">{label}:</span>
            <div className="flex-1 text-right font-medium">{value}</div>
        </div>
    );
}
