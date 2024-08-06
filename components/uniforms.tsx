import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Uniforms = (props: { imageUrlList: string[] }) => {

    return (
        <div className="flex flex-col items-center">
            <div className="">
                <div className="flex gap-2 max-w-full">
                    {
                        props.imageUrlList[0] &&
                        <Card className="w-[450px] max-w-full">
                            <CardHeader>
                                <CardTitle>Opción # 1</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Image src={props.imageUrlList[0]} width={450} height={450} alt="option-1" />
                            </CardContent>
                        </Card>
                    }

                    {
                        props.imageUrlList[1] &&
                        <Card className="w-[450px] max-w-full">
                            <CardHeader>
                                <CardTitle>Opción # 2</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Image src={props.imageUrlList[1]} width={450} height={450} alt="option-2" />
                            </CardContent>
                        </Card>
                    }
                </div>
            </div>
        </div>
    );
};

export default Uniforms;