import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

export default function CreateReceipt() {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Tạo phiếu yêu cầu</CardTitle>
                    <CardDescription>Điền thông tin chi tiết cho phiếu</CardDescription>
                </CardHeader>
                <form>
                    <CardContent>
                        <div>
                            <div>
                                <Label>Loại phiếu</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="import">Nhập</SelectItem>
                                            <SelectItem value="export">Xuất</SelectItem>
                                        </SelectContent>
                                    </SelectTrigger>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
