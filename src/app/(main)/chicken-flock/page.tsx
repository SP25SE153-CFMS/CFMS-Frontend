import { DataTable } from '@/components/table/data-table';
import { tasks } from '@/utils/data/table.data';
import { columns } from './columns';

export default function ChickenFlockPage() {
    return (
        <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Quản lý đàn gà</h2>
                    <p className="text-muted-foreground">
                        Here&apos;s a list of your tasks for this month!
                    </p>
                </div>
            </div>
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <DataTable data={tasks} columns={columns} />
            </div>
        </div>
    );
}
