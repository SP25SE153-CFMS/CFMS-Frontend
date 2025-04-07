import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tractor } from 'lucide-react';
import FarmForm from '@/components/forms/farm-form';

export default function Page() {
    return (
        <section className="w-full min-h-screen flex flex-col items-center justify-center py-8">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center">
                        <Tractor className="mr-2" />
                        Đăng ký Trang trại Mới
                    </CardTitle>
                    <CardDescription>Điền thông tin chi tiết về trang trại của bạn</CardDescription>
                </CardHeader>
                <FarmForm />
            </Card>
        </section>
    );
}
