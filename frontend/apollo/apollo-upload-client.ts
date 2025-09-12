import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { useAuthStore } from "../store/authStore";
import { API_URL } from "../consts/API_URL";

const uploadLink = createUploadLink({
    uri: API_URL,
    headers: {
        authorization: `Bearer ${useAuthStore.getState().accessToken || ""}`,
    },
    credentials: "include",
});

const uploadClient = new ApolloClient({
    link: uploadLink,
    cache: new InMemoryCache(),
});

export default uploadClient;
