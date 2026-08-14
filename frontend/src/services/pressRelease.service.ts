import {
  apiFetch,
  responseJson,
} from "@/services/api";

export const getPressReleases =
  async () => {
    const response =
      await apiFetch(
        "/press-releases"
      );

    return responseJson(
      response
    );
  };
