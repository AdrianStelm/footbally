"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useAuthStore } from "../../../store/authStore";
import ArticleCard from "../../../components/Article";
import { ArticleType } from "../../../types/ArticleTypes";
import { useState } from "react";
import { FieldConfig } from "../../../types/formTypes";
import Form from "../../../components/Form";
import { UpdateUserType } from "../../../types/userType";

const changeEmailField: FieldConfig[] = [{ name: 'email', label: 'Input your new email', type: 'email', placeholder: "Type here", required: true }]
const changeUsernameField: FieldConfig[] = [{ name: 'username', label: 'Input your new username', type: 'text', placeholder: "Type here", required: true }]
const changePasswordFields: FieldConfig[] = [
    { name: 'oldPassword', label: 'Input your current password', type: 'password', placeholder: "Type here", required: true },
    { name: 'newPassword', label: 'Input your new password', type: 'password', placeholder: "Type here", required: true }
]

const GET_MY_ARTICLES = gql`
  query GetArticlesByAuthor {
    getArticlesByAuthor {
      id
      slug
      title
      text
      author {
        id
        username
      }
      createdAt
      updatedAt
      likesCount
    }
  }
`;

const UPDATE_USERNAME = gql`
mutation updateUserData($data:UpdateUser!){
    updateUser(data:$data){
        username
    }
}
`

enum ProfileMode {
    Articles = 'articles',
    ChangePassword = 'changePassword',
    ChangeUsername = 'changeUsername',
    ChangeEmail = 'changeEmail',
}

export default function ProfilePage() {
    const { accessToken, initialized } = useAuthStore();
    const [mode, setMode] = useState<ProfileMode>(ProfileMode.Articles)
    const [updateUsername] = useMutation(UPDATE_USERNAME, {
        refetchQueries: [{ query: GET_MY_ARTICLES }],
    });


    const { data, loading, error } = useQuery(GET_MY_ARTICLES, {
        skip: !initialized,
        context: {
            headers: {
                authorization: accessToken ? `Bearer ${accessToken}` : "",
            },
        },
    });

    if (!initialized) return <p>Loading auth...</p>;

    if (loading) return <p>Loading articles...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const items: ArticleType[] = data?.getArticlesByAuthor || [];

    const handleUpdateUsername = async (formData: UpdateUserType) => {
        try {
            const result = await updateUsername({
                variables: {
                    data: {
                        username: formData.username
                    }
                }
            })
            setMode(ProfileMode.Articles)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <section>
            <div className="flex justify-between mx-20">
                <p style={{ color: mode === ProfileMode.Articles ? '#166534' : '' }} className={`cursor-pointer`} onClick={() => setMode(ProfileMode.Articles)}>Your articles</p>
                <p style={{ color: mode === ProfileMode.ChangeUsername ? '#166534' : '' }} className={` cursor-pointer`} onClick={() => setMode(ProfileMode.ChangeUsername)}>Change username</p>
                <p style={{ color: mode === ProfileMode.ChangePassword ? '#166534' : '' }} className={` cursor-pointer`} onClick={() => setMode(ProfileMode.ChangePassword)}>Change password</p>
                <p style={{ color: mode === ProfileMode.ChangeEmail ? '#166534' : '' }} className={`cursor-pointer`} onClick={() => setMode(ProfileMode.ChangeEmail)}>Change email</p>
            </div>
            {
                mode === ProfileMode.Articles ? (
                    <>
                        <h2 className="text-4xl font-bold">Your profile</h2>
                        <p>{items[0].author.username}</p>
                        <h2 className="text-3xl text-center font-bold mt-4">Your articles</h2>
                        <div className="space-y-4 mt-2">
                            {items.map((article) => (
                                <ArticleCard
                                    key={article.id}
                                    id={article.id}
                                    slug={article.slug}
                                    title={article.title}
                                    text={article.text}
                                    author={article.author}
                                    createdAt={article.createdAt}
                                    updatedAt={article.updatedAt}
                                    likesCount={article.likesCount}
                                />
                            ))}
                        </div>
                    </>
                )
                    // ) : mode === ProfileMode.ChangePassword ? (
                    //     <>
                    //         <Form fields={changePasswordFields} onSubmit={ } buttonText="Update password"></Form>
                    //     </>
                    // ) : mode === ProfileMode.ChangeEmail ? (
                    //     <>
                    //         <Form fields={changeEmailField} onSubmit={ } buttonText="Update email"></Form>
                    //     </>
                    // ) 
                    : mode === ProfileMode.ChangeUsername ? (
                        <>
                            <Form fields={changeUsernameField} onSubmit={handleUpdateUsername} buttonText="Change username"></Form>
                        </>
                    ) : null
            }
        </section >
    );


}