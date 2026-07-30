import { Sponsor } from "@/types/sponsor";
import { responseJson } from "@/services/api";

const API =
  process.env.NEXT_PUBLIC_API_URL +
  "/sponsors";

const authOptions = () => ({
  credentials: "include" as RequestCredentials,
  headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
});


// GET ALL
export const getSponsors = async (): Promise<
  Sponsor[]
> => {

  const res = await fetch(API);

  const data = await responseJson<{ data: Sponsor[] }>(res);

  return data.data;

};



// GET ONE
export const getSponsor = async (
  id: string
): Promise<Sponsor> => {

  const res = await fetch(`${API}/${id}`);

  const data = await responseJson<{ data: Sponsor }>(res);

  return data.data;

};



// CREATE
export const createSponsor = async (
  formData: FormData
) => {

  const res = await fetch(API, {

    method: "POST",
    ...authOptions(),
    body: formData,

  });


  return responseJson(res);

};



// UPDATE
export const updateSponsor = async (
  id: string,
  formData: FormData
) => {

  const res = await fetch(`${API}/${id}`, {

    method: "PUT",
    ...authOptions(),
    body: formData,

  });


  return responseJson(res);

};



// UPDATE STATUS
export const updateSponsorStatus = async (
  id: string,
  status: string
) => {

  const res = await fetch(`${API}/${id}`, {

    method: "PUT",

    headers: {
      "Content-Type": "application/json",
      ...authOptions().headers,
    },

    credentials: "include",

    body: JSON.stringify({

      status,

    }),

  });


  return responseJson(res);

};



// DELETE
export const deleteSponsor = async (
  id: string
) => {

  const res = await fetch(`${API}/${id}`, {

    method: "DELETE",
    ...authOptions(),

  });


  return responseJson(res);

};
