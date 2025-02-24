import { Input } from '@/components/ui/input';

export default function SignUp() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center px-[70px] py-[62px]">
            <div className="flex w-[1300px] h-[900px] justify-center items-center gap-[40px] shrink-0 overflow-hidden">
                <div className="flex flex-col w-1/2 relative items-start self-stretch columns-xl px-[53px] py-[12px] gap-y-[34px]">
                    <p className="text-center text-[32px] not-italic font-bold leading-[normal] whitespace-nowrap">
                        <span className="text-[#DC2626]">Chicken Farm</span> Management System
                    </p>

                    <p className="text-center text-[48px] not-italic font-bold leading-[normal]">
                        Mừng quay lại !
                    </p>

                    <p className="text-center text-[24px] text-[#999] not-italic font-bold leading-[normal]">
                        Hãy đăng ký vào tài khoản của bạn
                    </p>

                    {/* Name */}
                    <Input
                        type="text"
                        placeholder="Họ và tên"
                        className="w-[531px] h-[80px] rounded-[16px] bg-[#F3F3F3] text-[#999] text-[24px] font-medium not-italic leading-[normal]"
                    />
                    {/* Phone */}
                    <Input
                        type="number"
                        placeholder="Số điện thoại"
                        className="w-[531px] h-[80px] rounded-[16px] bg-[#F3F3F3] text-[#999] text-[24px] font-medium not-italic leading-[normal]"
                    />
                    {/* Email */}
                    <Input
                        type="email"
                        placeholder="Email"
                        className="w-[531px] h-[80px] rounded-[16px] bg-[#F3F3F3] text-[#999] text-[24px] font-medium not-italic leading-[normal]"
                    />
                    {/* Password */}
                    <Input
                        type="password"
                        placeholder="Mật khẩu"
                        className="w-[531px] h-[80px] rounded-[16px] bg-[#F3F3F3] text-[#999] text-[24px] font-medium not-italic leading-[normal]"
                    />
                </div>
                <div className="flex-col w-1/2 relative items-start self-stretch columns-xl px-[59px] py-[61px] rounded-[42px] bg-[#ea7d7d]">
                    <h1>Chicken Farm Management System</h1>
                </div>
            </div>
        </div>
    );
}
