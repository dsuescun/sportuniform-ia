'use client';

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ColorSelector from "@/components/color-selector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X as CloseIcon, Loader2, Minus } from "lucide-react";
import Uniforms from "@/components/uniforms";
import { generate } from "@/lib/generate-images";

const Home = () => {
    const [agregarColor, setAgregarColor] = useState(false);
    const [colorSelected, setColorSelected] = useState("#14ae31");
    const [colorSelectedList, setColorSelectedList] = useState([] as string[]);
    const [noMoreColor, setNoMoreColor] = useState(false);
    const [escudoImage, setEscudoImage] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageUrlList, setImageUrlList] = useState([] as string[]);

    const onChangeColor = (color: string) => {
        setColorSelected(color);
    }

    const onContinue = () => {
        setColorSelectedList([...colorSelectedList, colorSelected]);
        setAgregarColor(false);
        if (colorSelectedList.length === 2) {
            setNoMoreColor(true);
        }
    }

    const removeColor = (index: number) => {
        const newColorList = colorSelectedList.filter((color, i) => i !== index);
        setColorSelectedList(newColorList);
        if (noMoreColor) {
            setNoMoreColor(false);
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setEscudoImage(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const generateUniforms = async () => {
        try {
            if (colorSelectedList.length === 0) {
                alert("Por favor selecciona al menos un color para continuar.");
                return;
            }

            if (!escudoImage) {
                alert("Por favor selecciona un escudo para continuar.");
                return;
            }

            setShowResult(false);
            setLoading(true);

            // Call the API to generate the images
            const response = await generate(colorSelectedList, escudoImage);
            console.log("imageUrlList", response);
            if (response && response.length > 0) {
                setImageUrlList(response);
                setShowResult(true);
            }

            setLoading(false);
        }
        catch (error) {
            alert("Ocurrió un error al intentar generar las propuestas de uniformes.");
            setLoading(false);
        }
    }
    
    const reset = () => {
        setAgregarColor(false);
        setColorSelected("#14ae31");
        setColorSelectedList([]);
        setNoMoreColor(false);
        setEscudoImage("");
        setShowResult(false);
        setLoading(false);
        setImageUrlList([]);
    }

    return (
        <main className="flex flex-col items-center p-20">
            <h1 className="text-4xl font-bold">Construye tu uniforme de fútbol con ayuda de la IA!</h1>

            <div className="m-10">
                <div className="flex gap-2 max-w-full">
                    <Card className="w-[450px] max-w-full">
                        <CardHeader>
                            <CardTitle>Colores representativos</CardTitle>
                            <CardDescription>Elige los colores representativos de tu equipo (Máximo 3).</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {
                                colorSelectedList.length > 0 &&
                                <div className="flex flex-col gap-2 mb-5">
                                    {
                                        colorSelectedList.map((color, index) => (
                                            <div key={index} className="flex flex-row">
                                                <div className="h-10 w-1/2 rounded-l-md border-2 border-r-0" style={{ backgroundColor: color }}>
                                                </div>
                                                <div className="h-10 w-1/2 rounded-r-md border-2 border-l-0 content-center text-center">
                                                    {"Color # " + (index + 1)}
                                                </div>
                                                <Button className="ml-1" variant="destructive" size="icon" onClick={() => removeColor(index)}>
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))
                                    }
                                </div>
                            }

                            {
                                !agregarColor && !noMoreColor &&
                                <div className="flex justify-end">
                                    <Button variant="secondary" onClick={() => setAgregarColor(true)}>Agrega color</Button>
                                </div>
                            }

                            {
                                agregarColor &&
                                <div>
                                    <ColorSelector color={colorSelected} onChange={onChangeColor} style={{ width: '100%' }} />
                                    <div className="flex gap-1 justify-end mt-2">
                                        <Button variant="secondary" onClick={() => onContinue()}>Continuar</Button>
                                        <Button variant="destructive" size="icon" onClick={() => setAgregarColor(false)}>
                                            <CloseIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            }
                        </CardContent>
                    </Card>

                    <Card className="w-[450px] max-w-full">
                        <CardHeader>
                            <CardTitle>Escudo</CardTitle>
                            <CardDescription>Elige el escudo de tu equipo.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Input id="picture" type="file" onChange={handleImageChange} />
                            {
                                escudoImage &&
                                <div className="flex justify-center">
                                    <Image src={escudoImage} alt="Escudo" width={200} height={200} className="mt-5" />
                                </div>
                            }
                        </CardContent>
                    </Card>
                </div>

                <div className="flex mt-5 justify-center gap-2">
                    <Button
                        size="lg"
                        onClick={generateUniforms}
                        disabled={loading}
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generar uniformes
                    </Button>
                    <Button
                        size="lg"
                        onClick={reset}
                        disabled={loading}
                        variant="ghost"
                    >
                        Limpiar
                    </Button>
                </div>
            </div>

            {loading && <h1 className="text-2xl font-bold w-[900px] max-w-full text-center">
                La IA esta generando algunas propuestas para ti, espera por favor...</h1>}

            {showResult && <Uniforms imageUrlList={imageUrlList} />}
        </main>
    );
}

export default Home;