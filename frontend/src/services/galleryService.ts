import {
  Gallery,
  GalleryFormData,
} from "@/types/gallery";
import { responseJson } from "@/services/api";


const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

type GalleryMutationResponse = { success: boolean; message?: string };

const authOptions = () => ({
  credentials: "include" as RequestCredentials,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  },
});



// GET ALL GALLERY

export const getGallery = async (): Promise<Gallery[]> => {

  const res = await fetch(
    `${API_URL}/gallery`
  );


  const data = await responseJson<{ gallery: Gallery[] }>(res);


  return data.gallery;

};




// CREATE GALLERY

export const createGallery = async (
  galleryData: GalleryFormData
): Promise<GalleryMutationResponse> => {


  const formData = new FormData();



  formData.append(
    "title",
    galleryData.title
  );


  formData.append(
    "category",
    galleryData.category
  );


  formData.append(
    "description",
    galleryData.description
  );


  formData.append(
    "status",
    galleryData.status
  );




  // Cover Image

  if(galleryData.coverImage) {

    formData.append(
      "coverImage",
      galleryData.coverImage
    );

  }





  // Multiple Images

  galleryData.images.forEach(
    (image) => {

      formData.append(
        "images",
        image
      );

    }
  );





  const res = await fetch(
    `${API_URL}/gallery`,
    {
      method:"POST",
      ...authOptions(),
      body:formData,
    }
  );



  return responseJson<GalleryMutationResponse>(res);

};






// UPDATE GALLERY

export const updateGallery = async (

  id:string,

  galleryData:Partial<GalleryFormData>

): Promise<GalleryMutationResponse> => {



  const formData = new FormData();




  if(galleryData.title) {

    formData.append(
      "title",
      galleryData.title
    );

  }




  if(galleryData.category) {

    formData.append(
      "category",
      galleryData.category
    );

  }




  if(galleryData.description) {

    formData.append(
      "description",
      galleryData.description
    );

  }




  if(galleryData.status) {

    formData.append(
      "status",
      galleryData.status
    );

  }




  if(galleryData.coverImage) {

    formData.append(
      "coverImage",
      galleryData.coverImage
    );

  }





  galleryData.images?.forEach(
    (image)=>{

      formData.append(
        "images",
        image
      );

    }
  );





  const res = await fetch(

    `${API_URL}/gallery/${id}`,

    {
      method:"PUT",
      ...authOptions(),
      body:formData,
    }

  );



  return responseJson<GalleryMutationResponse>(res);

};






// DELETE GALLERY

export const deleteGallery = async (

  id:string

): Promise<GalleryMutationResponse> => {


  const res = await fetch(

    `${API_URL}/gallery/${id}`,

    {
      method:"DELETE",
      ...authOptions(),
    }

  );



  return responseJson<GalleryMutationResponse>(res);

};
