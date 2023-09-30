import axios from "axios";

async function enhanceImg(url: URL, scale: any) {
    const scaleNumber = scale ? scale : 2
    try {
        const { data } = await axios(`https://toolsapi.spyne.ai/api/forward`, {
            method: "post",
            data: {
                image_url: url,
                scale: scaleNumber,
                save_params: {
                    extension: ".png",
                    quality: 95
                }
            },
            headers: {
                "content-type": "application/json",
                accept: "*/*"
            }
        })
        
        return data
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const textToImage = async (text: string) => {
    try {
        const { data } = await axios.get("https://tti.photoleapapp.com/api/v1/generate?prompt=" + text)
        const enhanceImages = await enhanceImg(data.result_url, 2)
        const result = {
            status: true,
            url: enhanceImages.url
        }
        return result
    } catch (err: any) {
        const result = {
            status: false,
            message: String(err.message)
        }
        console.log(result)
        return result
    }
}