const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { responseJson } from "@/services/api";


export const getPressReleases = async () => {

    const token = localStorage.getItem("token");

    const res = await fetch(
        `${API_URL}/press-releases`,
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );


    const data = await responseJson(res);

    return data;

};
