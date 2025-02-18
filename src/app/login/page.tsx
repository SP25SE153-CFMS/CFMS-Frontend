import Image from 'next/image';

export default function Page() {
    return (
        <div className="flex w-[1440px] h-[1024px] px-[70px] py-[62px] justify-center items-center">
            <div className="flex w-[1300px] h-[980px] justify-center items-center gap-2.5 shrink-0">
                <div className="flex-col w-1/2 relative items-start self-stretch columns-xl px-[59px] py-[61px] rounded-[42px] bg-primary bg-opacity-60">
                    <h2 className="font-[Inter] text-center text-[60px] text-textPrimary not-italic font-bold leading-[140%]">
                        Chicken Farm Management System
                    </h2>

                    <div className="w-[483px] mt-[72px]">
                        <p className="font-[Inter] text-[24px] mb-[56px] text-textPrimary font-normal leading-normal">
                            Pass đồ và thuê đồ một cách dễ dàng và tiện lợi hơn với EcoClothé
                        </p>
                        <Image
                            className="absolute left-[150px] bottom-[72px]"
                            alt="Logo"
                            src="/assets/logo/logo.png"
                            width={329}
                            height={329}
                        />
                    </div>
                </div>
                <div className="columns-2xl">
                    <h3>Chicken Farm Management System</h3>
                </div>
            </div>
        </div>
    );
}

// display: flex;
// width: 1440px;
// height: 1024px;
// padding: 62px 70px;
// justify-content: center;
// align-items: center;
