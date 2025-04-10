import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Tractor } from 'lucide-react';
import FarmForm from '@/components/forms/farm-form';
import Link from 'next/link';
import config from '@/configs';
import { Button } from '@/components/ui/button';

export default function Page() {
    return (
        <section className="w-full min-h-screen flex flex-col items-start justify-center py-8">
            <Card className="w-full max-w-2xl mx-auto">
                <Link href={config.routes.farm}>
                    <Button variant="ghost" className="mt-4">
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Quay lại
                    </Button>
                </Link>
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
