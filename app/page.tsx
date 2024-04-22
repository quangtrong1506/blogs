"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "@quangtrong1506/ckeditor-custom";
import { useState } from "react";

const editor: any = Editor;

export default function Home() {
    const [data, setData] = useState<string>("");
    const handleSubmit = async () => {
        let div = document.createElement("div");
        div.innerHTML = data;
        let imgs = div.getElementsByTagName("img");
        function DataURIToBlob(dataURI: string) {
            const splitDataURI = dataURI.split(",");
            const byteString = splitDataURI[0].indexOf("base64") >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
            const mimeString = splitDataURI[0].split(":")[1].split(";")[0];
            const ia = new Uint8Array(byteString.length);
            for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
            return new Blob([ia], { type: mimeString });
        }
        for await (const img of imgs) {
            const formdata = new FormData();
            formdata.append("image", img.src.match("base64") ? DataURIToBlob(img.src) : img.src);
            let res = await fetch("https://api.imgbb.com/1/upload?key=c4d352e8ca22bc39f85197a113954d54", {
                method: "POST",
                body: formdata,
                redirect: "follow",
            });
            let resJson = await res.json();
            console.log(resJson);
            img.setAttribute("src", resJson.data?.display_url);
            setData(div.innerHTML);
        }
    };
    return (
        <>
            <div className="px-2">
                <CKEditor
                    editor={editor}
                    data={data}
                    onChange={(event, editor: any) => {
                        const text = editor.getData();
                        setData(text);
                    }}
                />
            </div>
            <div className="mt-3 text-center">
                <button className="p-2 bg-[#00f2ff] rounded-md" onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </>
    );
}
