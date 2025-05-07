import { DataTable } from '@/components/table/data-table';
import { columns } from './columns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { downloadCSV } from '@/utils/functions/download-csv.function';
import { HarvestLog } from '@/utils/schemas/harvest-log.schema';

export default function CardHarvest({ harvestLogs }: { harvestLogs: HarvestLog[] }) {
    return (
        <Card className="p-6 mb-4">
            <div className="flex flex-wrap items-center justify-between gap-x-4 space-y-2">
                <div>
                    <h2 className="text-xl font-bold tracking-tight">Danh sách thu hoạch</h2>
                    <p className="text-muted-foreground">
                        Danh sách tất cả các thu hoạch trong chuồng nuôi
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="space-x-1"
                        onClick={() => downloadCSV(harvestLogs, 'harvest-logs.csv')}
                    >
                        <span>Tải file</span> <Download size={18} />
                    </Button>
                </div>
            </div>
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <DataTable data={harvestLogs} columns={columns} />
            </div>
        </Card>
    );
}
